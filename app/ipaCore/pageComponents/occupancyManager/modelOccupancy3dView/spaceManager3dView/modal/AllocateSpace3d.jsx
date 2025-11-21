import React, { useEffect, useState, useRef } from 'react';
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import { makeStyles, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import { ScriptHelper } from '@invicara/ipa-core/modules/IpaUtils'
import { IafProj, IafUserGroup } from '@dtplatform/platform-api';
import moment from "moment";
import * as UiUtils from '@dtplatform/ui-utils'
import '../../../components/UserModal.scss'

const AllocateSpace3d = ({ isOpen, onClose, isSuccessOrFailMsg, spaceInfo, mode, ...props }) => {
    //console.log('move user info :--->', userInfo)
    console.log(props, 'props-->');

    if (!isOpen) return null;

    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState({})
    const [selectDatas, setSelectDatas] = useState([])
    const [currentUserGroup, setCurrentUserGroup] = useState("")
    const [statusOptions, setStatusOptions] = useState([])
    const [isFloorEnabled, setIsFloorEnabled] = useState(false);
    const [isRoomFunctionEnabled, setIsRoomFunctionEnabled] = useState(false);
    const [isSpaceEnabled, setIsSpaceEnabled] = useState(false);
    const [isRemainingFieldsEnabled, setIsRemainingFieldsEnabled] = useState(false);
    const [spaceData, setSpaceData] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedSpace, setSelectedSpace] = useState({});
    const [filteredSpaces, setFilteredSpaces] = useState([]);

    const createCompProps = props.handler.spaceOccupancy.config.actions.Create.component || {}
    const disabledFields = ["Building", "Floor", "Space Name", "Room Function", "Area"];

    useEffect(() => {
        setSpaceData(spaceInfo);
        console.log('space info in effect :-->', spaceInfo)
        if (spaceInfo?.properties) {
            const initialInputs = {};
            Object.entries(spaceInfo.properties).forEach(([key, prop]) => {
                if (prop.type === 'date' && prop.val?.trim()) {
                    initialInputs[key] = convertDate(prop.val);
                } else {
                    initialInputs[key] = prop.val ?? '';
                }
            });
            console.log('initialInputs value :---->', initialInputs)
            setUserInput(initialInputs);
        }
    }, [spaceInfo, mode]);

    const convertDate = (dateStr) => {
        if (!dateStr) return '';

        // If already in correct format, skip conversion
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

        const [dd, mm, yyyy] = dateStr.split('-');
        return `${yyyy}-${mm}-${dd}`; // Return in YYYY-MM-DD
    };

    const handleChangeEdit = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        setUserInput(values => ({ ...values, [field]: value }));

        // Enable next field based on current selection
        if (field === 'Building') {
            setSelectedBuilding(value);
            setIsFloorEnabled(true);
        }
        if (field === 'Floor') {
            setSelectedFloor(value);
            setIsSpaceEnabled(true)
            // setIsRoomFunctionEnabled(true);
        }
        if (field === 'Space Name') {
            const selectedSpace = spaceData.find(item => item['Space Name'] === value);
            console.log('seleted space :----->', selectedSpace)
            setSelectedSpace(selectedSpace)

            if (selectedSpace) {
                const newInputs = {};

                Object.entries(selectedSpace.properties).forEach(([key, prop]) => {
                    if (prop.type === 'date' && prop.val?.trim()) {
                        // const [mm, dd, yyyy] = prop.val.split('/');
                        // newInputs[key] = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
                        const dateValue = convertDate(prop.val)
                        console.log('converted date :----.', dateValue)
                        newInputs[key] = dateValue;

                    } else {
                        newInputs[key] = prop.val ?? "";
                    }
                });

                newInputs['Space Name'] = selectedSpace['Space Name'];

                setUserInput(prev => ({
                    ...prev,
                    ...newInputs
                }));
                setIsRoomFunctionEnabled(true);
            }
            setIsRemainingFieldsEnabled(true);
        }
    };

    const mergeSpaceData = (primaryObj, targetObj) => {
        // const updatedProperties = { ...targetObj.properties };
           const updatedProperties = structuredClone(targetObj.properties);

        // console.log('final datye :----->',finaldate)
        Object.keys(primaryObj).forEach(key => {
            const newValue = primaryObj[key];

            if (
                updatedProperties[key] &&
                typeof newValue === 'string' &&
                newValue.trim() !== ''
            ) {
                updatedProperties[key].val = newValue;
                if (updatedProperties[key].type == 'date') {
                    const epochValue = UiUtils.IafDataPlugin.convertToEpoch(newValue)
                    updatedProperties[key].epoch = epochValue
                }
            }
        });
        if (updatedProperties['Rental Status']) {
            updatedProperties['Rental Status'].val = 'TRUE';
        }
        return {
            ...targetObj,
            properties: updatedProperties,
        };
    };

    const createEntity = async () => {
        setIsLoading(true)
        console.log(userInput, 'userInput');
         console.log(spaceData, 'spaceData');
        let mergerSpacevalue = mergeSpaceData(userInput, spaceData)
        console.log('mergerSpacevalue :----->', mergerSpacevalue)

         let updatedItemArray = [{
            _id: mergerSpacevalue._id,
            "Space Name": mergerSpacevalue['Space Name'],
            properties: mergerSpacevalue.properties
        }]

        console.log('final updated array :---->', updatedItemArray)
        ScriptCache.clearCache();
        const allocateSpace = await ScriptCache.runScript(props.handler.spaceOccupancy.config.actions.Create.script, updatedItemArray)
        console.log(allocateSpace, 'allocateSpace');
        if (allocateSpace.success) {
            isSuccessOrFailMsg({ success: true, modalForm: 'Space', action: 'Allocated' })
            onClose()
            setIsLoading(false)
        } else {
            isSuccessOrFailMsg({ success: false, modalForm: 'Space', action: 'Allocated' })
            onClose()
            setIsLoading(false)

        }
    }

    const validate = () => {
        console.log('createCompProps:---->', createCompProps)
        console.log('userInput:--->', userInput)
        let validation = createCompProps.requiredProperties.map(prop => {
            console.log(prop, userInput[prop], 'prop');
            //return userInput[prop] !== undefined && userInput[prop].length > 0
            return _.isEmpty(userInput[prop])
        })
        console.log(validation, 'valn')
        return validation.includes(true)
    }


    return (
        <div className="modal-overlay unassign-user">
            <div className="modal-content">
                <div className="modal-header">
                    <div className='header-content'>
                        <h4>Allocate Space</h4>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="move-user-grid">
                        {/* From Section */}
                        <div className="move-user-column">
                            {
                                props.handler.spaceOccupancy.config.actions.Create.component.fields.map(field => {
                                    if (field.type === 'text') {
                                        return (
                                            <div key={field.name}>
                                                <label className={createCompProps.requiredProperties.includes(field.name) ? "reqd" : ""}>{field.title}</label>
                                                <input
                                                    type={field.type}
                                                    disabled={disabledFields.includes(field.name)}
                                                    name={field.name}
                                                    className={`move-user-select user-input ${disabledFields.includes(field.name) ? 'disable' : ''
                                                        }`}
                                                    value={userInput[field.name] || ''}
                                                    onChange={(e) => handleChangeEdit(e)}
                                                />
                                            </div>
                                        )
                                    }
                                    if (field.type === 'textarea') {
                                        return (
                                            <div key={field.name}>
                                                <label className={createCompProps.requiredProperties.includes(field.name) ? "reqd" : ""}>{field.title}</label>
                                                <textarea
                                                    type={field.type}
                                                    name={field.name}
                                                    className={`textarea-modal ${disabledFields.includes(field.name) ? 'disable' : ''
                                                        }`}
                                                    disabled={disabledFields.includes(field.name)}
                                                    value={userInput[field.name] || ''}
                                                    onChange={(e) => handleChangeEdit(e)}
                                                />
                                            </div>
                                        )
                                    }
                                    if (field.type === 'date') {
                                        return (
                                            <>
                                                <label className={createCompProps.requiredProperties.includes(field.name) ? "reqd" : ""}>{field.title}</label>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    disabled={disabledFields.includes(field.name)}
                                                    className={`move-user-select user-input${disabledFields.includes(field.name) ? 'disable' : ''
                                                        }`}
                                                    value={convertDate(userInput[field.name])}
                                                    onChange={e => handleChangeEdit(e)}
                                                />
                                            </>
                                        )
                                    }
                                    if (field.type == 'select') {

                                        return (
                                            <>
                                                <label className={createCompProps.requiredProperties.includes(field.title) ? "reqd" : ""}>{field.title}</label>
                                                <select
                                                    className={`move-user-select user-input ${disabledFields.includes(field.name) ? 'disable' : ''
                                                        }`}
                                                    type={field.type}
                                                    name={field.name}
                                                    disabled={disabledFields.includes(field.name)} // optional, if you want to lock it
                                                    onChange={handleChangeEdit}
                                                    value={userInput[field.name]}
                                                >
                                                    <option value={userInput[field.name]}>{userInput[field.name]}</option>
                                                </select>
                                            </>
                                        )
                                    }
                                })

                            }
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className={"cancel-btn"} onClick={onClose}>{'Cancel'}</button>
                    <button className={`save-btn ${validate() ? 'Mui-disabled' : ''}`}
                        onClick={createEntity}
                        disabled={validate()}
                    >
                        {createCompProps.okButtonText || 'Create'}
                    </button>
                </div>
            </div>
            {isLoading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100vh",
                        background: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress size={40} />
                </div>
            )}
        </div>
    );
};

export default AllocateSpace3d;

import React, { useEffect, useState, useRef } from 'react';
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import { makeStyles, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import { ScriptHelper } from '@invicara/ipa-core/modules/IpaUtils'
import { IafProj, IafUserGroup } from '@dtplatform/platform-api';
import moment from "moment";
import * as UiUtils from '@dtplatform/ui-utils'
import '../../../components/UserModal.scss'

const CreateEntity = ({ isOpen, onClose, isSuccessOrFailMsg, spaceInfo, mode, ...props }) => {
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


    const entityTitle = props.handler.spaceOccupancy.config.type.singular

    const createCompProps = props.handler.spaceOccupancy.config.actions.Create.component || {}
    // const convertDate = (dat) => {
    //     console.log('date input :---->',dat)
    //     if(!dat) return
    //     return dat.split("-").reverse().join("-");
    //   }
    useEffect(() => {
        setSpaceData(spaceInfo)
    }, []);

    useEffect(() => {
        const filterSpace = getFilteredSpaceNames()
        console.log('final filter spaces :----.', filterSpace)
        setFilteredSpaces(filterSpace)
    }, [selectedBuilding, selectedFloor]);

    const convertDate = (dateStr) => {
        if (!dateStr) return '';

        // If already in correct format, skip conversion
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

        const [dd, mm, yyyy] = dateStr.split('-');
        return `${yyyy}-${mm}-${dd}`; // Return in YYYY-MM-DD
    };

    //  const handleChangeEdit = (event) => {
    //     console.log(event,'event');

    //     const field = event.target.name;
    //     //console.log(field,'field name');
    //     const value = event.target.value;
    //     setUserInput(values => ({...values, [field]: value}))
    //   }

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
        // if (field === 'Room Function') {
        //     setSelectedFunction(value)
        //     setIsSpaceEnabled(true)
        // }
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
    const getType = (name) => {
        console.log('nam ein type :--->', name)
        // let inputType = createCompProps.fields.filter(fieldType => fieldType.name === name)[0].type
        let inputType = createCompProps.fields.filter(fieldType => fieldType.name === name)
        console.log(inputType, 'inputType:---->');
        return inputType
    }

    const mergeSpaceData = (primaryObj, targetObj) => {
        const updatedProperties = { ...targetObj.properties };

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
        let mergerSpacevalue = mergeSpaceData(userInput, selectedSpace)
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


    const getFilteredSpaceNames = () => {
        console.log('space data :--->', spaceData)
        return spaceData.filter(item =>
            item.properties['Building']?.val === selectedBuilding &&
            item.properties['Floor']?.val === selectedFloor &&
            item.properties['Rental Status']?.val === 'FALSE'
        ).map(item => item['Space Name']);
    };

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
                                                    disabled={createCompProps.disabled.includes(field.name) || !isRemainingFieldsEnabled}
                                                    name={field.name}
                                                    className={`move-user-select user-input ${createCompProps.disabled.includes(field.name) || !isRemainingFieldsEnabled ? 'disable' : ''
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
                                                    className={`textarea-modal ${createCompProps.disabled.includes(field.name) || !isRemainingFieldsEnabled ? 'disable' : ''
                                                        }`}
                                                   disabled={createCompProps.disabled.includes(field.name) || !isRemainingFieldsEnabled}
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
                                                    disabled={createCompProps.disabled.includes(field.name) || !isRemainingFieldsEnabled}
                                                    className={`move-user-select user-input ${createCompProps.disabled.includes(field.name) || !isRemainingFieldsEnabled ? 'disable' : ''
                                                        }`}
                                                    value={convertDate(userInput[field.name])}
                                                    onChange={e => handleChangeEdit(e)}
                                                />
                                            </>
                                        )
                                    }
                                    if (field.type == 'select') {
                                        let options = [];

                                        if (field.name === 'Space Name') {
                                            if (filteredSpaces.length === 0) {
                                                options = [<option key="no-match" value="">No Match Found</option>];
                                            } else {
                                                options = filteredSpaces.map((name, index) => (
                                                    <option key={index} value={name}>{name}</option>
                                                ));
                                            }

                                        } else {
                                            // Use default static options
                                            options = [
                                                <option key="placeholder" value="" disabled hidden>{field.PlaceHolder}</option>,
                                                ...field?.optionValue.map((name, index) => (
                                                    <option key={index} value={name}>{name}</option>
                                                ))
                                            ];
                                        }

                                        return (
                                            <>
                                                <label className={createCompProps.requiredProperties.includes(field.title) ? "reqd" : ""}>{field.title}</label>
                                                <select
                                                    className="move-user-select user-input"
                                                    type={field.type}
                                                    name={field.name}
                                                    disabled={
                                                        (field.name === 'Floor' && !isFloorEnabled) ||
                                                        (field.name === 'Room Function' && !isRoomFunctionEnabled) ||
                                                        (field.name === 'Space Name' && !isSpaceEnabled)
                                                    }
                                                    onChange={e => handleChangeEdit(e)}
                                                    value={userInput[field.name] || ''}
                                                >
                                                    <option value="" disabled hidden>{field.PlaceHolder}</option>
                                                    {/* {field?.optionValue.map((name, index) => (
                                                        <option key={index} value={name}>{name}</option>
                                                    ))} */}
                                                    {options}
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

export default CreateEntity;

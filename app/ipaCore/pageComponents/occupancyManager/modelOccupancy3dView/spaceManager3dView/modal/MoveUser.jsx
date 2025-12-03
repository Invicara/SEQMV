import React, { useEffect, useState, useRef } from 'react';
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import { makeStyles, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import { ScriptHelper } from '@invicara/ipa-core/modules/IpaUtils'
import { IafProj, IafUserGroup } from '@dtplatform/platform-api';
import moment from "moment";
import * as UiUtils from '@dtplatform/ui-utils'
import '../../../components/UserModal.scss'

const MoveUser = ({ isOpen, onClose, isSuccessOrFailMsg,userInfo, spaceInfo, mode,selectedModel,selectedSpaceCollection, ...props }) => {
    //console.log('move user info :--->', userInfo)
    console.log(props, 'props-->');

    if (!isOpen) return null;

    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState({})
    const [isFloorEnabled, setIsFloorEnabled] = useState(false);
    const [isSpaceEnabled, setIsSpaceEnabled] = useState(false);
    const [spaceData, setSpaceData] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedSpace, setSelectedSpace] = useState({});
    const [filteredSpaces, setFilteredSpaces] = useState([]);

    const disabledFields = ['Customer Code', 'Customer Name', 'Security Deposit', 'Contract', 'Applicable Tariff','Rental Charges','Agreement End Date','Agreement Start Date','Area'];

    const createCompProps = props.handler.spaceOccupancy.config.actions.Create.component || {}
    // const convertDate = (dat) => {
    //     console.log('date input :---->',dat)
    //     if(!dat) return
    //     return dat.split("-").reverse().join("-");
    //   }
    useEffect(() => {
        let spaceInfoData = spaceInfo
        if (mode == '3dView') {
            spaceInfoData = spaceInfo.map((item) => {
                return item.entity
            })
        }
        console.log('total space info :---->',spaceInfoData)
        setSpaceData(spaceInfoData)
        console.log('current uer info :---->',userInfo)
        if (userInfo?.properties) {
            const initialInputs = {};
            Object.entries(userInfo.properties).forEach(([key, prop]) => {
                if (prop.type === 'date' && prop.val?.trim()) {
                    initialInputs[key] = convertDate(prop.val);
                } else {
                    initialInputs[key] = prop.val ?? '';
                }
            });
            initialInputs['Space Name'] = ''
            setSelectedBuilding(initialInputs['Building'])
            setSelectedFloor(initialInputs['Floor'])
            console.log('initialInputs value :---->',initialInputs)
            setUserInput(initialInputs);
        }
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

        const [dd, mm, yyyy] = dateStr.split('/');
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

                newInputs['Area'] = selectedSpace.properties['Area'].val;

                setUserInput(prev => ({
                    ...prev,
                    ...newInputs
                }));

            }
        }
    };

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
        console.log(userInput, 'userInput in create:--');
        console.log(selectedSpace, 'selectedSpace in create:--');
        console.log(userInfo, 'current user in create:--');

        //Unallocate current user....

        const UnallocateUserUpdatedProperties = {
            ...userInfo.properties,

            // Update Rental Status
            ...(userInfo.properties['Rental Status'] && {
                'Rental Status': {
                    ...userInfo.properties['Rental Status'],
                    val: 'FALSE'
                }
            }),

            // Remove 'val' from Agreement Start Date
            ...(userInfo.properties['Agreement Start Date'] && {
                'Agreement Start Date': (() => {
                    const { val, ...rest } = userInfo.properties['Agreement Start Date'];
                    return rest;
                })()
            }),

            // Remove 'val' and 'epoch' from Agreement End Date
            ...(userInfo.properties['Agreement End Date'] && {
                'Agreement End Date': (() => {
                    const { val, ...rest } = userInfo.properties['Agreement End Date'];
                    return rest;
                })()
            }),

            ...(userInfo.properties['Rental Charges'] && {
                'Rental Charges': (() => {
                    const { val, ...rest } = userInfo.properties['Rental Charges'];
                    return rest;
                })()
            }),

            ...(userInfo.properties['Customer Code'] && {
                'Customer Code': (() => {
                    const { val, ...rest } = userInfo.properties['Customer Code'];
                    return rest;
                })()
            }),

            ...(userInfo.properties['Customer Name'] && {
                'Customer Name': (() => {
                    const { val, ...rest } = userInfo.properties['Customer Name'];
                    return rest;
                })()
            }),

            ...(userInfo.properties['Name'] && {
                'Name': (() => {
                    const { val, ...rest } = userInfo.properties['Name'];
                    return rest;
                })()
            }),
            
            ...(userInfo.properties['Security Deposit'] && {
                'Security Deposit': (() => {
                    const { val, ...rest } = userInfo.properties['Security Deposit'];
                    return rest;
                })()
            }),

            ...(userInfo.properties['Contract'] && {
                'Contract': (() => {
                    const { val, ...rest } = userInfo.properties['Contract'];
                    return rest;
                })()
            }),

            ...(userInfo.properties['Applicable Tariff'] && {
                'Applicable Tariff': (() => {
                    const { val, ...rest } = userInfo.properties['Applicable Tariff'];
                    return rest;
                })()
            })

        };

        const updatedUnallocateArray ={
                _id: userInfo._id,
                'Space Name': userInfo['Space Name'],
                properties: UnallocateUserUpdatedProperties
            }

        //Move user property update .......

        const moveUserUpdatedProperties = {
            ...selectedSpace.properties,

            // Update Rental Status
            ...(selectedSpace.properties['Rental Status'] && {
                'Rental Status': {
                    ...selectedSpace.properties['Rental Status'],
                    val: 'TRUE'
                }
            }),

            // Remove 'val' from Agreement Start Date
            ...(selectedSpace.properties['Agreement Start Date'] && {
                'Agreement Start Date': {
                    ...selectedSpace.properties['Agreement Start Date'],
                    val: userInput['Agreement Start Date']
                }
            }),

            ...(selectedSpace.properties['Agreement End Date'] && {
                'Agreement End Date': {
                    ...selectedSpace.properties['Agreement End Date'],
                    val: userInput['Agreement End Date']
                }
            }),

            ...(selectedSpace.properties['Rental Charges'] && {
                'Rental Charges': {
                    ...selectedSpace.properties['Rental Charges'],
                    val: userInput['Rental Charges']
                }
            }),

            ...(selectedSpace.properties['Customer Code'] && {
                'Customer Code': {
                    ...selectedSpace.properties['Customer Code'],
                    val: userInput['Customer Code']
                }
            }),

            ...(selectedSpace.properties['Customer Name'] && {
                'Customer Name': {
                    ...selectedSpace.properties['Customer Name'],
                    val: userInput['Customer Name']
                }
            }),

            ...(selectedSpace.properties['Name'] && {
                'Name': {
                    ...selectedSpace.properties['Name'],
                    val: userInput['Name']
                }
            }),

            ...(selectedSpace.properties['Security Deposit'] && {
                'Security Deposit': {
                    ...selectedSpace.properties['Security Deposit'],
                    val: userInput['Security Deposit']
                }
            }),

            ...(selectedSpace.properties['Contract'] && {
                'Contract': {
                    ...selectedSpace.properties['Contract'],
                    val: userInput['Contract']
                }
            }),

            ...(selectedSpace.properties['Applicable Tariff'] && {
                'Applicable Tariff': {
                    ...selectedSpace.properties['Applicable Tariff'],
                    val: userInput['Applicable Tariff']
                }
            })

        };

        const updatedMoveArray = {
            _id: selectedSpace._id,
            'Space Name': selectedSpace['Space Name'],
            properties: moveUserUpdatedProperties
        }
        
        console.log('Unallocated user array :---->',updatedUnallocateArray)
        console.log('move user array :---->',updatedMoveArray)

        let filter = {
            entity: [updatedUnallocateArray,updatedMoveArray],
            collectionInfo: selectedSpaceCollection[0]
        }


        ScriptCache.clearCache();
        const moveUser = await ScriptCache.runScript(props.handler.spaceOccupancy.config.actions.Create.script, filter)
        console.log('moveUser result:--->',moveUser);
        if (moveUser.success) {
            isSuccessOrFailMsg({ success: true, modalForm: 'Move', action: 'User'})
            onClose()
            setIsLoading(false)
        } else {
            isSuccessOrFailMsg({ success: false, modalForm: 'Move', action: 'User'})
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
        console.log('selected building :--->>',selectedBuilding)
        console.log('selected Floor :--->>',selectedFloor)
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
                        <h4>Move User</h4>
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
                                    if (field.type === 'date') {
                                        return (
                                            <>
                                                <label className={createCompProps.requiredProperties.includes(field.name) ? "reqd" : ""}>{field.title}</label>
                                                <input
                                                    type={field.type}
                                                    disabled={disabledFields.includes(field.name)}
                                                    name={field.name}
                                                    className={`move-user-select user-input ${disabledFields.includes(field.name) ? 'disable' : ''
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

export default MoveUser;

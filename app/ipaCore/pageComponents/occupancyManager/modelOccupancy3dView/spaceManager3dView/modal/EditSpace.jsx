import React, { useEffect, useState } from 'react';
import { CircularProgress } from "@mui/material";
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import * as UiUtils from '@dtplatform/ui-utils';
import '../../../components/UserModal.scss';

const EditSpace = ({ isOpen, onClose, isSuccessOrFailMsg, userInfo, mode, ...props }) => {
    if (!isOpen) return null;

    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState({});

    const createCompProps = props.handler.spaceOccupancy.config.actions.Create.component || {};
    const disabledFields = ['Building', 'Floor', 'Space Name', 'Room Function', 'Area'];

    useEffect(() => {
        if (userInfo?.properties) {
            const initialInputs = {};
            Object.entries(userInfo.properties).forEach(([key, prop]) => {
                if (prop.type === 'date' && prop.val?.trim()) {
                    initialInputs[key] = convertDate(prop.val);
                } else {
                    initialInputs[key] = prop.val ?? '';
                }
            });
            setUserInput(initialInputs);
        }
    }, [userInfo]);

    // const convertDate = (dateStr) => {
    //     if (!dateStr) return '';
    //     if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    //     const [mm, dd, yyyy] = dateStr.split('/');
    //     return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    // };
    const convertDate = (dateStr) => {
        if (!dateStr) return '';

        // If already in correct format, skip conversion
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

        const [dd, mm, yyyy] = dateStr.split('-');
        return `${yyyy}-${mm}-${dd}`; // Return in YYYY-MM-DD
    };

    const handleChangeEdit = (event) => {
        const { name, value } = event.target;
        setUserInput(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        return createCompProps.requiredProperties?.some(
            prop => !userInput[prop] || userInput[prop].trim() === ''
        );
    };

    const createEntity = async () => {
        setIsLoading(true);
        const selectedSpace = userInfo;

        const updatedProperties = { ...selectedSpace.properties };
        Object.keys(userInput).forEach(key => {
            const value = userInput[key];
            if (updatedProperties[key] && typeof value === 'string' && value.trim()) {
                updatedProperties[key].val = value;
                if (updatedProperties[key].type === 'date') {
                    updatedProperties[key].epoch = UiUtils.IafDataPlugin.convertToEpoch(value);
                }
            }
        });

        const finalObject = {
            _id: selectedSpace._id,
            "Space Name": selectedSpace['Space Name'],
            properties: updatedProperties
        };

        console.log('final object to save :---->',finalObject)
        ScriptCache.clearCache();
        const res = await ScriptCache.runScript(props.handler.spaceOccupancy.config.actions.Create.script, [finalObject]);

        if (res.success) {
            isSuccessOrFailMsg({ success: true, modalForm: 'Space', action: 'Update' });
            onClose();
        } else {
            isSuccessOrFailMsg({ success: false, modalForm: 'Space', action: 'Update' });
        }
        setIsLoading(false);
    };

    return (
        <div className="modal-overlay unassign-user">
            <div className="modal-content">
                <div className="modal-header">
                    <div className='header-content'>
                        <h4>Edit Space</h4>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                </div>
                <div className="modal-body">
                    <div className="move-user-grid">
                        <div className="move-user-column">
                            {console.log('final userInput:--->',userInput)}
                            {createCompProps.fields?.map(field => {
                                const commonProps = {
                                    key: field.name,
                                    name: field.name,
                                    value: userInput[field.name] || '',
                                    onChange: handleChangeEdit,
                                    disabled: disabledFields.includes(field.name),
                                    className: `move-user-select user-input ${disabledFields.includes(field.name) ? 'disable' : ''}`
                                };

                                return (
                                    <div key={field.name}>
                                        <label className={createCompProps.requiredProperties.includes(field.name) ? 'reqd' : ''}>{field.title}</label>

                                        {field.type === 'text' && (
                                            <input type="text" {...commonProps} />
                                        )}

                                        {field.type === 'textarea' && (
                                            <textarea {...commonProps} className={`textarea-modal ${disabledFields.includes(field.name) ? 'disable' : ''}`} />
                                        )}

                                        {field.type === 'date' && (
                                            <input type="date" {...commonProps} />
                                        )}

                                        {field.type === 'select' && (
                                            <select {...commonProps}>
                                                <option value="" disabled hidden>{field.PlaceHolder}</option>
                                                <option value={userInput[field.name]} >{userInput[field.name]}</option>
                                                {/* {field.optionValue?.map((name, index) => (
                                                    <option key={index} value={name}>{name}</option>
                                                ))} */}
                                            </select>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button
                        className={`save-btn ${validate() ? 'Mui-disabled' : ''}`}
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

export default EditSpace;

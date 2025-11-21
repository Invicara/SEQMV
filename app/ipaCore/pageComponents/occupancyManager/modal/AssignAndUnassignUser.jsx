import React, { useEffect, useState, useRef } from 'react';
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import { makeStyles, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import './UserModal.scss'

const AssignAndUnassignUser = ({ isOpen, onClose, isUnassigned, userInfo, floorValue, onTextSearch, onFloorChange,onFetch, ...props }) => {
    console.log('move user info :--->', userInfo)
    if (!isOpen) return null;

    const [isLoading, setIsLoading] = useState(false);
    const [userNameInput, setUserNameInput] = useState(
        userInfo?.[0]?.entity?.properties?.['Occupant']?.val || ''
    );

    const isAssigning = !userInfo?.[0]?.entity?.properties?.['Occupant']?.val;

    const editAsset = async () => {
        setIsLoading(true);
        const currentUser = userInfo[0]
        const updateFromAsset = {
            ...currentUser,
            entity: {
                ...currentUser.entity,
                properties: {
                    ...currentUser.entity.properties,
                    ['Occupant']: {
                        ...currentUser.entity.properties?.['Occupant'],
                        val: isAssigning ? userNameInput : '',
                    },
                    ['Occupied']: {
                        ...currentUser.entity.properties?.['Occupied'],
                        val: isAssigning ? 'Yes' : 'No',
                    }
                },
            },
        };

        try {
            ScriptCache.clearCache();
            const floorAssets = await ScriptCache.runScript(props.handler.config.entityData.editUser.script, [updateFromAsset.entity])
            if(floorAssets.success === true){
                if(isAssigning){
                    isUnassigned({success: true, modal: 'Assign'})
                } else {
                    isUnassigned({success: true, modal: 'Unassign'})
                }
            } else {
                isUnassigned({success: false, modal: 'Assign'})
            }
            console.log('current user :----->', currentUser.entity.properties?.['Occupant'].val)
            onFetch({
                floorValue:floorValue,
                type :'assetClick'
              })
            // onTextSearch(currentUser.entity.properties?.['Occupant'].val)
            
        }
        catch (error) {
            console.error('Error fetching assets on fetch--:', error);
        } finally {
            onClose()
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay unassign-user">
            <div className="modal-content">
                <div className="modal-header">
                    <div className='header-content'>
                        <h4>{isAssigning ? 'Assign Workstation' : 'Unassign Workstation'}</h4>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="move-user-grid">
                        {/* From Section */}
                        <div className="move-user-column">
                            <label>Occupant</label>
                            <input
                                type="text"
                                className="move-user-select user-input"
                                value={userNameInput}
                                onChange={(e) => setUserNameInput(e.target.value)}
                                disabled={!isAssigning}
                            />

                            <label>Office</label>
                            <select className="move-user-select" value={userInfo?.[0]?.entity?.properties?.['Office']?.val || ''} disabled>
                                <option>{userInfo[0].entity.properties['Office'].val}</option>
                            </select>

                            <label>Cabin</label>
                            <select className="move-user-select" value={userInfo?.[0]?.entity?.properties?.['Cabin']?.val || ''} disabled>
                                <option>{userInfo[0].entity.properties['Cabin'].val}</option>
                            </select>

                            <label>Workstation No.</label>
                            <select className="move-user-select" value={userInfo?.[0]?.entity?.properties?.['Workstation No']?.val || ''} disabled>
                                <option>{userInfo[0].entity.properties['Workstation No'].val}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button
                        className={`save-btn ${isAssigning && !userNameInput.trim() ? 'Mui-disabled' : ''}`}
                        onClick={editAsset}
                        disabled={isAssigning && !userNameInput.trim()}
                    >{isAssigning ? 'Assign' : 'Unassign'}
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

export default AssignAndUnassignUser;

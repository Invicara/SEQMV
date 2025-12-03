import React, { useEffect, useState, useRef } from 'react';
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import { CircularProgress } from "@mui/material";
import '../../../components/UserModal.scss'

const UnallocateSpace = ({ isOpen, onClose, isSuccessOrFailMsg, userInfo, mode,selectedModel,selectedSpaceCollection, ...props }) => {
    console.log('move user info :--->', userInfo)
    console.log(props,'props-->');
    
    if (!isOpen) return null;

    const [isLoading, setIsLoading] = useState(false);

    
    const spaceName =userInfo['Space Name']

    // const deleteCompProps = props.handler.spaceOccupancy.config.actions.Delete.component || {}
    const unallocateSpace = async () => {
        setIsLoading(true)
        console.log(userInfo,'userInfo-->');

        const updatedProperties = {
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

        // Construct array with updated item format
        // const updatedItemArray = [
        //     {
        //         _id: userInfo._id,
        //         'Space Name': userInfo['Space Name'],
        //         properties: updatedProperties
        //     }
        // ];

        let filter = {
            entity: [
                {
                    _id: userInfo._id,
                    'Space Name': userInfo['Space Name'],
                    properties: updatedProperties
                }
            ],
            collectionInfo: selectedSpaceCollection[0]
        }
        console.log('Final object to save :--->',filter)
        ScriptCache.clearCache();
        const updateSpace = await ScriptCache.runScript(props.handler.spaceOccupancy.config.actions.Create.script, filter)
        console.log(updateSpace, 'unallocateSpace');
        if(updateSpace.success === true){
            isSuccessOrFailMsg({success : true, modalForm : 'Space', action : 'unallocated'})
            onClose()
            setIsLoading(false)
        } else {
            isSuccessOrFailMsg({success : false, modalForm : 'Space', action : 'unallocated'})
            onClose()
            setIsLoading(false)
        }
      }
      
    return (
        <div className="modal-overlay unassign-user">
            <div className="modal-content" style={{width: '450px', height:'40%'}}>
                <div className="modal-header">
                    <div className='header-content'>
                        <h4>Unallocate space </h4>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                </div>

                <div className="modal-body" style={{overflowY:'unset'}}>
                    <div className="move-user-grid">
                        {/* From Section */}
                            <div className="move-user-column">
                                <p>Are you sure you want to unallocate '{spaceName}' space?</p>
                                <p>This action will permanently remove the company allocation.</p>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className={"cancel-btn"} onClick={onClose}>{'Cancel'}</button>
                    <button className={`save-btn`}
                    onClick={unallocateSpace}
                    >
                        Yes, Unallocate
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

export default UnallocateSpace;

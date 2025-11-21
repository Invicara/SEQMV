import React, { useEffect, useState, useRef } from 'react';
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import { makeStyles, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import './UserModal.scss'

const MoveUserModal = ({ isOpen, onClose, userInfo,isMoved, floorValue,onTextSearch,onFloorChange,assetClickType,onFetch, ...props }) => {
  console.log('move user info :--->', userInfo)
  if (!isOpen) return null;
  const [floorAsset, setFloorAsset] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [seatNo, setSeatno] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedWorkstation, setSelectedWorkstation] = useState('');
  const [selectedSeat, setSelectedSeat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [levels, setLevels] = useState([])

  const getLevels = async() => {
    //console.log(props,'props-->');
    if(floorValue == undefined){
      //get all the floors logic
      const getAllAssets = await ScriptCache.runScript(props.handler.spaceOccupancy.script.getOccupancyAssets, { entityInfo: {}})
      let uniqueFloores = [...new Set(getAllAssets.filter(assetData => assetData.properties['Level'].val).map(item => item.properties['Level'].val))];
      //console.log(uniqueFloores,'uniqueFloores');
      setLevels(uniqueFloores)
    } else {
      await setSelectedLevel(floorValue)
      await getRooms(floorValue)
    }
  }

  const getRooms = async (floor) => {
    ScriptCache.clearCache();
    //{floor: '1 st Floor'}
    setIsLoading(true);
    const floorAssets = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.getAssets.script, { floor })
    console.log('move user asset data:-->', floorAssets);
    setFloorAsset(floorAssets)
    let availableRooms = [...new Set(
      floorAssets
        .filter(asset =>
          asset.entity.properties?.["Office"]?.val &&
          asset.entity.properties?.["Occupied"]?.val === "No"
        )
        .map(asset => asset.entity.properties["Office"].val)
    )];

    console.log('availableRooms to move :---->', availableRooms)
    setAvailableRooms(availableRooms)
    setIsLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await getLevels(); 
      } catch (error) {
        console.error('Error fetching assets--:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();

  }, [])
  
  const onLevelChange = (levelName) => {
    console.log(levelName, 'levelName');
    getRooms(levelName)
  }

  const onRoomChange = (roomName) => {
    const matchingAssets = floorAsset.filter(asset =>
      asset.entity.properties?.["Office"]?.val === roomName &&
      asset.entity.properties?.["Occupied"]?.val === "No"
    );

    console.log('on room change :--->', matchingAssets)
    // Extract unique Cabins from matchingAssets
    const workstationsList = [...new Set(
      matchingAssets
        .map(asset => asset.entity.properties?.["Cabin"]?.val)
        .filter(Boolean) // remove undefined/null
    )];

    setWorkstations(workstationsList);
  }

  const onWsChange = (wsName) => {
    const matchingAssets = floorAsset.filter(asset =>
      asset.entity.properties?.["Cabin"]?.val === wsName &&
      asset.entity.properties?.["Office"]?.val === selectedRoom &&
      asset.entity.properties?.["Occupied"]?.val === "No"
    );

    console.log('on ws change  :--->', matchingAssets)
    // Extract unique Cabins from matchingAssets
    const seatNoList = [...new Set(
      matchingAssets
        .map(asset => asset.entity.properties?.["Workstation No"]?.val)
        .filter(Boolean) // remove undefined/null
    )];

    setSeatno(seatNoList)
  }
  const editAsset = async () => {
    setIsLoading(true);
    let filterAsset = floorAsset.filter(asset =>
      asset.entity.properties?.["Workstation No"]?.val === selectedSeat
    )
    const userProp = userInfo[0].entity.properties;
    const currentUser = userInfo[0]

    const assetToUpdate = filterAsset[0];
    console.log('Asset to update :---->', assetToUpdate)

    const updateToAsset = {
      ...assetToUpdate,
      entity: {
        ...assetToUpdate.entity,
        properties: {
          ...assetToUpdate.entity.properties,
          ['Occupant']: {
            ...assetToUpdate.entity.properties?.['Occupant'],
            val: userProp['Occupant'].val,
          },
          ['Occupied']: {
            ...assetToUpdate.entity.properties?.['Occupied'],
            val: 'Yes',
          }
        },
      },
    };

    const updateFromAsset = {
      ...currentUser,
      entity: {
        ...currentUser.entity,
        properties: {
          ...currentUser.entity.properties,
          ['Occupant']: {
            ...currentUser.entity.properties?.['Occupant'],
            val: '',
          },
          ['Occupied']: {
            ...currentUser.entity.properties?.['Occupied'],
            val: 'No',
          }
        },
      },
    };

    try {
      ScriptCache.clearCache();
      const floorAssets = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.editUser.script, [updateToAsset.entity, updateFromAsset.entity])
      console.log(floorAssets,'floorAssets');
      
      console.log('current user :----->',currentUser.entity.properties?.['Occupant'].val)
      if(assetClickType != 'dashboard'){
        if(assetClickType != '')
          {
            onFetch({
              floorValue:floorValue,
              type :'assetClick'
            })
          }
        onTextSearch(assetClickType != '' ? '' :currentUser.entity.properties?.['Occupant'].val)
      }
      if (floorAssets.success == true) {
        isMoved(true)
      } else {
        isMoved(false)
      }
    }
    catch (error) {
      console.error('Error fetching assets on fetch--:', error);
    } 
    finally {
      onClose()
    }
  };


  const isSaveDisabled = !selectedRoom || !selectedWorkstation || !selectedSeat;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className='header-content'>
            <h4>Move Occupant</h4>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal-body">
          <div className="move-user-grid">
            {/* From Section */}
            <div className="move-user-column">
              <h5>From</h5>
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

            {/* To Section */}
            <div className="move-user-column">
              <h5>To</h5>
              {/* Level */}
              {floorValue == undefined && 
              <div>
              <label>Level</label>
              <select
                className="move-user-select"
                value={selectedLevel}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedLevel(value);
                  setSelectedRoom('');
                  setSelectedWorkstation(''); // Reset downstream selections
                  setSelectedSeat('');
                  onLevelChange(value)
                }}
              >
                <option value="" disabled hidden>Choose Level</option>
                {levels.map((room, idx) => (
                  <option key={idx} value={room}>{room}</option>
                ))}
              </select>
              </div>
              }

              {/* Office */}
              <label>Office</label>
              <select
                className="move-user-select"
                value={selectedRoom}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedRoom(value);
                  setSelectedWorkstation(''); // Reset downstream selections
                  setSelectedSeat('');
                  onRoomChange(value)
                }}
                disabled={!selectedLevel}
              >
                <option value="" disabled hidden>Choose office</option>
                {availableRooms.map((room, idx) => (
                  <option key={idx} value={room}>{room}</option>
                ))}
              </select>

              {/* Cabin */}
              <label>Cabin</label>
              <select
                className="move-user-select"
                value={selectedWorkstation}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedWorkstation(value);
                  setSelectedSeat('');
                  onWsChange(value)
                }}
                disabled={!selectedRoom}
              >
                <option value="" disabled hidden>Choose cabin</option>
                {workstations.map((ws, idx) => (
                  <option key={idx} value={ws}>{ws}</option>
                ))}
              </select>

              {/* Workstation No. */}
              <label>Workstation No.</label>
              <select
                className="move-user-select"
                value={selectedSeat}
                onChange={(e) => setSelectedSeat(e.target.value)}
                disabled={!selectedWorkstation}
              >
                <option value="" disabled hidden>Choose workstation</option>
                {seatNo.map((seat, idx) => (
                  <option key={idx} value={seat}>{seat}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className={`save-btn ${isSaveDisabled ? 'Mui-disabled' : ''}`}
            disabled={isSaveDisabled}
            onClick={editAsset}
          >Save</button>
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

export default MoveUserModal;

import React, { useEffect, useState, useRef } from 'react';
import StatusBarChart from './charts/StatusBarChart';

const Sidebar = ({ onFloorChange,
  onBuildinChange,
  spaceBiulding,
  spaceLevels,
  spaceFilter,
  onOfficeChange,
  statusFilter,
  selectedNameOptions,
  spaceData,
  onNameChange,
  onStatusChange,
  onFetch,
  floorSpaces,
  onTextSearch,
  setIsMoveModalOpen,
  setIsUnassignModalOpen,
  setIsAssignModalOpen,
  statusChartData,
  userInfo,
  setUserInfo,
  spaceClickType,
  resetFilter,
  selectedCabin,
  setSelectedCabin,
  availableModel }) => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedSpace, setSelectedSpace] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [noDataFound, setNoDataFound] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const isSearchDisabled = !selectedFloor;
  const [value, setValue] = React.useState(0);

  const iconRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setShowUserOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="sidebar sidebar-scroll">

      {/* Select Building */}
      <select
        className="select"
        onChange={(e) => {
          const value = e.target.value;
          setSelectedBuilding(value);
          setSelectedSpace(""); // Reset Type when Floor changes
          setSelectedName(""); // Reset Name when Floor changes
          setSelectedStatus(""); // Reset Status when Floor changes
          setSearchText("");
          setUserInfo([])
          setSelectedCabin([])
          setNoDataFound(false)
          onBuildinChange(value);
        }}
        value={selectedBuilding}
      >
        <option value="" disabled hidden>Choose Building</option>
        {/* {spaceBiulding?.map((building, index) => (
          <option key={index} value={building}>
            {building}
          </option>
        ))} */}
         {availableModel.sort((a,b) => a._name.localeCompare(b._name)).map(amc => <option key={amc._id} value={amc._id}>{amc._name}</option>)}
      </select>

      {/* Floor Selection */}
      {/* <select
        className="select"
        onChange={(e) => {
          const value = e.target.value;
          setSelectedFloor(value);
          setSelectedSpace(""); // Reset Type when Floor changes
          setSelectedName(""); // Reset Name when Floor changes
          setSelectedStatus(""); // Reset Status when Floor changes
          setSearchText("");
          setUserInfo([])
          setSelectedCabin([])
          setNoDataFound(false)
          onFloorChange(value);
        }}
        value={selectedFloor}
      >
        <option value="" disabled hidden>Choose Floor</option>
        {spaceLevels?.map((level, index) => (
          <option key={index} value={index}>
            {level.name}
          </option>
        ))}
      </select> */}

      {/* Show other selects only if a floor is selected */}
      {selectedBuilding && (
        <>
          {/* Type Selection (Disabled until Floor is selected) */}

          {/* Floor Selection */}
          <select
            className="select"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedFloor(value);
              setSelectedSpace(""); // Reset Type when Floor changes
              setSelectedName(""); // Reset Name when Floor changes
              setSelectedStatus(""); // Reset Status when Floor changes
              setSearchText("");
              setUserInfo([])
              setSelectedCabin([])
              setNoDataFound(false)
              onFloorChange(value);
            }}
            value={selectedFloor}
          >
            <option value="" disabled hidden>Choose Floor</option>
            {console.log('level values :--->',spaceLevels)}
            {spaceLevels?.map((level, index) => (
              <option key={index} value={index}>
                {level.name}
              </option>
            ))}
          </select>

          <select
            className="select"
            onChange={ async (e) => {
              const value = e.target.value;
              setSelectedSpace(value);
              setSelectedName(""); // Reset Name when Type changes
              setSelectedStatus("")
              setSearchText("");
              setSelectedCabin([])
              setNoDataFound(false)
              await onFetch({
                building : selectedBuilding,
                floor: selectedFloor,
                space: value,
                cabin: null,
              });
              await onOfficeChange(value);
      
            }}
            value={selectedSpace} // Reset when Floor changes
          >
            <option value="" disabled hidden>Choose Space</option>
            {spaceFilter?.map((spaceFilter, index) => (
              <option key={index} value={spaceFilter}>
                {spaceFilter}
              </option>
            ))}
          </select>

          {(!isSearchDisabled || userInfo.length > 0) && (<div
            className="rest-filters"
            onClick={() => {
              setSelectedFloor("");
              setSelectedSpace("");
              setSelectedName("");
              setSelectedStatus("");
              setSearchText("");
              setUserInfo([])
              setNoDataFound(false)
              resetFilter()
            }}
          >
            <span className='reset-filter-button'>
              <i className="fa fa-eraser filter-eraser-icon" aria-hidden="true"></i>
              <span className='reset-text'>Reset Filters</span>
            </span>

          </div>)}

          {/* Show "No data found" message if no results */}
          {spaceData.length == 0 && noDataFound && <p className="no-results-message">No matching data found.</p>}

          <div className="or-divider" style={{ width: "100%" }}>
            <span className="line"></span>
            <span className="text">OR</span>
            <span className="line"></span>
          </div>


          {/* Separate Search Input & Button - Only visible when floor is selected */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter name to search..."
              className="input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchText.trim().length >= 3) {
                  setSelectedSpace(""); // Reset Type when Floor changes
                  setSelectedName(""); // Reset Name when Floor changes
                  setSelectedStatus(""); // Reset Status when Floor changes
                  onTextSearch(searchText);
                }
              }}
            />
            {searchText && (
              <i className="fas fa-times clear-icon" onClick={() => { setSearchText(""), setUserInfo([]) }}></i>
            )}
          </div>

          {userInfo.length > 0 && (
            <div className="user-info-tile">
              <div className="user-info-header">
                <span>{spaceClickType !== '' ? 'Space info' : 'Occupant Info'}</span>
                <i
                  className="fas fa-ellipsis-v"
                  ref={iconRef}
                  onClick={() => setShowUserOptions(prev => !prev)}
                  style={{ cursor: 'pointer' }}
                ></i>
              </div>

              <div className="user-details">
                <p><strong>Space name:</strong> {userInfo[0]?.entity?.properties['Space Name'].val}</p>
                <p><strong>Level:</strong> {userInfo[0]?.entity?.properties['Level'].val}</p>
                {/* <p><strong>Customer Code:</strong> {userInfo[0]?.entity?.properties['Customer Code'].val}</p> */}
                <p><strong>Customer Name:</strong> {userInfo[0]?.entity?.properties['Customer Name'].val}</p>
                <p><strong>Contract:</strong> {userInfo[0]?.entity?.properties['Contract'].val}</p>
                <p><strong>Agreement Start Date:</strong> {userInfo[0]?.entity?.properties['Agreement Start Date'].val}</p>
                <p><strong>Agreement End Date:</strong> {userInfo[0]?.entity?.properties['Agreement End Date'].val}</p>
                <p><strong>Applicable Tariff in INR/Sqm:</strong> {userInfo[0]?.entity?.properties['Applicable Tariff'].val}</p>
                <p><strong>Rental Charges (Monthly):</strong> {userInfo[0]?.entity?.properties['Rental Charges'].val}</p>
                <p><strong>Security Deposit:</strong> {userInfo[0]?.entity?.properties['Security Deposit'].val}</p>
              </div>

              {showUserOptions && (
                <div className="dropdown-menu-style" ref={menuRef}>
                  {spaceClickType === 'assigned' && (
                    <>
                      <div className="dropdown-item" onClick={() => { setIsMoveModalOpen(true); setShowUserOptions(false); }}>Move Team</div>
                      <div className="dropdown-item" onClick={() => { setIsUnassignModalOpen(true); setShowUserOptions(false); }}>Unassign Sapce</div>
                    </>
                  )}
                  {spaceClickType === 'unoccupied' && (
                    <div className="dropdown-item" onClick={() => { setIsAssignModalOpen(true); setShowUserOptions(false); }}>Assign Sapce</div>
                  )}
                  {spaceClickType === '' && (
                    <div className="dropdown-item" onClick={() => { setIsMoveModalOpen(true); setShowUserOptions(false); }}>Move Team</div>
                  )}
                </div>
              )}
            </div>
          )}





          {statusChartData.length > 0 && (
            <div className='status-bar-chart'>
              <h5 className='chart-header'>{statusChartData[0].label}</h5>
              <StatusBarChart data={statusChartData} />
            </div>
          )
          }
        </>
      )}
    </div>
  );
};


export default Sidebar;
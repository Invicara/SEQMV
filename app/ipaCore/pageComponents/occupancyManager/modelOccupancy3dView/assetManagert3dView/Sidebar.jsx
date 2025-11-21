import React, { useEffect, useState, useRef } from 'react';
import StatusBarChart from './charts/StatusBarChart';

const Sidebar = ({ onFloorChange,
  spaceLevels,
  officeFilter,
  onOfficeChange,
  statusFilter,
  selectedNameOptions,
  assetData,
  onNameChange,
  onStatusChange,
  onFetch,
  floorAsset,
  onTextSearch,
  setIsMoveModalOpen,
  setIsUnassignModalOpen,
  setIsAssignModalOpen,
  statusChartData,
  userInfo,
  setUserInfo,
  assetClickType,
  resetFilter,
  selectedCabin,
  setSelectedCabin,
  availableModel,
  onBuildinChange }) => {
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [noDataFound, setNoDataFound] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const isSearchDisabled = !selectedFloor || !selectedOffice;

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

  return (
    <div className="sidebar sidebar-scroll">

      {/* Select Building */}
      <select
        className="select"
        onChange={(e) => {
          const value = e.target.value;
          setSelectedBuilding(value);
          // setSelectedSpace(""); // Reset Type when Floor changes
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
        {availableModel.sort((a, b) => a._name.localeCompare(b._name)).map(amc => <option key={amc._id} value={amc._id}>{amc._name}</option>)}
      </select>
      {selectedBuilding && (
        <>
          <select
            className="select"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedFloor(value);
              setSelectedOffice(""); // Reset Type when Floor changes
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
          </select>

          {/* Type Selection (Disabled until Floor is selected) */}
          <select
            className="select"
            onChange={async (e) => {
              const value = e.target.value;
              setSelectedOffice(value);
              setSelectedName(""); // Reset Name when Type changes
              setSelectedStatus("")
              setSearchText("");
              setSelectedCabin([])
              setNoDataFound(false)
              await onFetch({
                floor: selectedFloor,
                office: value,
                cabin: null,
              });
              await onOfficeChange(value);

            }}
            value={selectedOffice}
            disabled={!selectedFloor} // Reset when Floor changes
          >
            <option value="" disabled hidden>Choose Office</option>
            {officeFilter?.map((officeFilter, index) => (
              <option key={index} value={officeFilter}>
                {officeFilter}
              </option>
            ))}
          </select>

          {/* Name Selection (Disabled until Type is selected) */}
          <select
            className="select"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedName(value)
              setSelectedStatus("")
              setNoDataFound(false)
              onNameChange(value);
              onFetch({
                floor: selectedFloor,
                office: selectedOffice,
                cabin: value,
              });
            }}
            value={selectedName} // Reset when Floor or Type changes
            disabled={!selectedOffice || selectedCabin.length === 0} // Only enabled if Type is selected
          >
            <option value="" disabled hidden>Choose Cabin</option>
            {selectedCabin.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>

          {(!isSearchDisabled || userInfo.length > 0) && (<div
            className="rest-filters"
            onClick={() => {
              setSelectedFloor("");
              setSelectedOffice("");
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
          {assetData.length == 0 && noDataFound && <p className="no-results-message">No matching data found.</p>}

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
                  setSelectedOffice(""); // Reset Type when Floor changes
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
                <span>{assetClickType !== '' ? 'Workstation Info' : 'Occupant Info'}</span>
                <i
                  className="fas fa-ellipsis-v"
                  ref={iconRef}
                  onClick={() => setShowUserOptions(prev => !prev)}
                  style={{ cursor: 'pointer' }}
                ></i>
              </div>

              <div className="user-details">
                <p><strong>Occupant:</strong> {userInfo[0].entity.properties['Occupant'].val}</p>
                <p><strong>Office Name:</strong> {userInfo[0].entity.properties['Office'].val}</p>
                <p><strong>Workstation No:</strong> {userInfo[0].entity.properties['Workstation No'].val}</p>
              </div>

              {showUserOptions && (
                <div className="dropdown-menu-style" ref={menuRef}>
                  {assetClickType === 'assigned' && (
                    <>
                      <div className="dropdown-item" onClick={() => { setIsMoveModalOpen(true); setShowUserOptions(false); }}>Move Occupant</div>
                      <div className="dropdown-item" onClick={() => { setIsUnassignModalOpen(true); setShowUserOptions(false); }}>Unassign Workstation</div>
                    </>
                  )}
                  {assetClickType === 'unoccupied' && (
                    <div className="dropdown-item" onClick={() => { setIsUnassignModalOpen(true); setShowUserOptions(false); }}>Assign Workstation</div>
                  )}
                  {assetClickType === '' && (
                    <div className="dropdown-item" onClick={() => { setIsMoveModalOpen(true); setShowUserOptions(false); }}>Move Occupant</div>
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
      {/* Floor Selection */}
      {/* <select
        className="select"
        onChange={(e) => {
          const value = e.target.value;
          setSelectedFloor(value);
          setSelectedOffice(""); // Reset Type when Floor changes
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
    </div>
  );
};


export default Sidebar;
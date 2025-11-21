import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { IafProj } from '@dtplatform/platform-api'
import "@dtplatform/iaf-viewer/dist/iaf-viewer.css"
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import { EnhancedIafViewer } from "./EnhancedIafViewer"
import { useDispatch, useSelector } from "react-redux"
import { Entities } from "@invicara/ipa-core/modules/IpaRedux"
import { makeStyles, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import { setCuttingPlane,cameraOnTop } from "./utilities";
import './OccupancyManagement.scss'
import MoveUserModal from "./modal/MoveUserModal";
import AssignAndUnassignUser from './modal/AssignAndUnassignUser';
import StatusBarChart from './charts/StatusBarChart';
import Notification from './modal/Notification';
import Sidebar from './Sidebar';
import ModelViewer from './ModelViewer';
import { getTemporaryMapBoxToken } from '../../../utils/mapboxUtils'

// const Sidebar = ({ onFloorChange,
//   spaceLevels,
//   officeFilter,
//   onOfficeChange,
//   statusFilter,
//   selectedNameOptions,
//   assetData,
//   onNameChange,
//   onStatusChange,
//   onFetch,
//   floorAsset,
//   onTextSearch,
//   setIsMoveModalOpen,
//   setIsUnassignModalOpen,
//   setIsAssignModalOpen,
//   statusChartData,
//   userInfo,
//   setUserInfo,
//   assetClickType,
//   resetFilter,
//   selectedCabin,
//   setSelectedCabin }) => {
//   const [selectedFloor, setSelectedFloor] = useState("");
//   const [selectedOffice, setSelectedOffice] = useState("");
//   const [selectedName, setSelectedName] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [noDataFound, setNoDataFound] = useState(false);
//   const [showUserOptions, setShowUserOptions] = useState(false);
//   const isSearchDisabled = !selectedFloor || !selectedOffice;

//   const iconRef = useRef(null);
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(event.target) &&
//         iconRef.current &&
//         !iconRef.current.contains(event.target)
//       ) {
//         setShowUserOptions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="sidebar sidebar-scroll">
//       {/* Floor Selection */}
//       <select
//         className="select"
//         onChange={(e) => {
//           const value = e.target.value;
//           setSelectedFloor(value);
//           setSelectedOffice(""); // Reset Type when Floor changes
//           setSelectedName(""); // Reset Name when Floor changes
//           setSelectedStatus(""); // Reset Status when Floor changes
//           setSearchText("");
//           setUserInfo([])
//           setSelectedCabin([])
//           setNoDataFound(false)
//           onFloorChange(value);
//         }}
//         value={selectedFloor}
//       >
//         <option value="" disabled hidden>Choose Floor</option>
//         {spaceLevels?.map((level, index) => (
//           <option key={index} value={index}>
//             {level.name}
//           </option>
//         ))}
//       </select>

//       {/* Show other selects only if a floor is selected */}
//       {selectedFloor && floorAsset?.length > 0 && (
//         <>
//           {/* Type Selection (Disabled until Floor is selected) */}
//           <select
//             className="select"
//             onChange={ async (e) => {
//               const value = e.target.value;
//               setSelectedOffice(value);
//               setSelectedName(""); // Reset Name when Type changes
//               setSelectedStatus("")
//               setSearchText("");
//               setSelectedCabin([])
//               setNoDataFound(false)
//               await onFetch({
//                 floor: selectedFloor,
//                 office: value,
//                 cabin: null,
//               });
//               await onOfficeChange(value);
      
//             }}
//             value={selectedOffice} // Reset when Floor changes
//           >
//             <option value="" disabled hidden>Choose Office</option>
//             {officeFilter?.map((officeFilter, index) => (
//               <option key={index} value={officeFilter}>
//                 {officeFilter}
//               </option>
//             ))}
//           </select>

//           {/* Name Selection (Disabled until Type is selected) */}
//           <select
//             className="select"
//             onChange={(e) => {
//               const value = e.target.value;
//               setSelectedName(value)
//               setSelectedStatus("")
//               setNoDataFound(false)
//               onNameChange(value);
//               onFetch({
//                 floor: selectedFloor,
//                 office: selectedOffice,
//                 cabin: value,
//               });
//             }}
//             value={selectedName} // Reset when Floor or Type changes
//             disabled={!selectedOffice || selectedCabin.length === 0} // Only enabled if Type is selected
//           >
//             <option value="" disabled hidden>Choose Cabin</option>
//             {selectedCabin.map((name, index) => (
//               <option key={index} value={name}>{name}</option>
//             ))}
//           </select>

//           {/* Status Selection (Disabled until Name is selected) */}
//           {/* <select
//             className="select"
//             onChange={(e) => {
//               const value = e.target.value;
//               setSelectedStatus(value)
//               onStatusChange(value);
//               setNoDataFound(false)
//             }}
//             value={selectedStatus}
//             disabled={selectedOffice === "Seats" || !selectedName}>
//             <option value="" disabled hidden>Choose Status</option>
//             {statusFilter?.map((statusValue, index) => (
//               <option key={index} value={statusValue}>
//                 {statusValue}
//               </option>
//             ))}
//           </select>
//           <button
//             className={`fetch-btn  ${isSearchDisabled ? 'Mui-disabled' : ''}`}
//             disabled={isSearchDisabled}
//             onClick={() => {
//               onFetch({
//                 floor: selectedFloor,
//                 type: selectedOffice,
//                 name: selectedName,
//                 status: selectedStatus
//               });
//               setNoDataFound(true);
//               setSearchText("")
//             }}
//           >
//             <span>Fetch</span>
//           </button> */}
//           {/*Rest Filter */}

//           {(!isSearchDisabled || userInfo.length > 0) && (<div
//             className="rest-filters"
//             onClick={() => {
//               setSelectedFloor("");
//               setSelectedOffice("");
//               setSelectedName("");
//               setSelectedStatus("");
//               setSearchText("");
//               setUserInfo([])
//               setNoDataFound(false)
//               resetFilter()
//             }}
//           >
//             <span className='reset-filter-button'>
//               <i className="fa fa-eraser filter-eraser-icon" aria-hidden="true"></i>
//               <span className='reset-text'>Reset Filters</span>
//             </span>

//           </div>)}

//           {/* Show "No data found" message if no results */}
//           {assetData.length == 0 && noDataFound && <p className="no-results-message">No matching data found.</p>}

//           <div className="or-divider" style={{ width: "100%" }}>
//             <span className="line"></span>
//             <span className="text">OR</span>
//             <span className="line"></span>
//           </div>


//           {/* Separate Search Input & Button - Only visible when floor is selected */}
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Enter name to search..."
//               className="input"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && searchText.trim().length >= 3) {
//                   setSelectedOffice(""); // Reset Type when Floor changes
//                   setSelectedName(""); // Reset Name when Floor changes
//                   setSelectedStatus(""); // Reset Status when Floor changes
//                   onTextSearch(searchText);
//                 }
//               }}
//             />
//             {searchText && (
//               <i className="fas fa-times clear-icon" onClick={() => { setSearchText(""), setUserInfo([]) }}></i>
//             )}
//           </div>

//           {userInfo.length > 0 && (
//             <div className="user-info-tile">
//               <div className="user-info-header">
//                 <span>{assetClickType !== '' ? 'Workstation Info' : 'Occupant Info'}</span>
//                 <i
//                   className="fas fa-ellipsis-v"
//                   ref={iconRef}
//                   onClick={() => setShowUserOptions(prev => !prev)}
//                   style={{ cursor: 'pointer' }}
//                 ></i>
//               </div>

//               <div className="user-details">
//                 <p><strong>Occupant:</strong> {userInfo[0].entity.properties['Occupant'].val}</p>
//                 <p><strong>Office Name:</strong> {userInfo[0].entity.properties['Office'].val}</p>
//                 <p><strong>Workstation No:</strong> {userInfo[0].entity.properties['Workstation No'].val}</p>
//               </div>

//               {showUserOptions && (
//                 <div className="dropdown-menu-style" ref={menuRef}>
//                   {assetClickType === 'assigned' && (
//                     <>
//                       <div className="dropdown-item" onClick={() => { setIsMoveModalOpen(true); setShowUserOptions(false); }}>Move Occupant</div>
//                       <div className="dropdown-item" onClick={() => { setIsUnassignModalOpen(true); setShowUserOptions(false); }}>Unassign Workstation</div>
//                     </>
//                   )}
//                   {assetClickType === 'unoccupied' && (
//                     <div className="dropdown-item" onClick={() => { setIsUnassignModalOpen(true); setShowUserOptions(false); }}>Assign Workstation</div>
//                   )}
//                   {assetClickType === '' && (
//                     <div className="dropdown-item" onClick={() => { setIsMoveModalOpen(true); setShowUserOptions(false); }}>Move Occupant</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}





//           {statusChartData.length > 0 && (
//             <div className='status-bar-chart'>
//               <h5 className='chart-header'>{statusChartData[0].label}</h5>
//               <StatusBarChart data={statusChartData} />
//             </div>
//           )
//           }
//         </>
//       )}
//     </div>
//   );
// };

// const ModelViewer = ({ selectedModel, onCreateViewerRef, isolatedEntities, selectedEntities, colorGroups, handleOnSelectedElementChangeCallback }) => {
//   console.log('selectedModel:----->', selectedModel)
//   return (
//     <div className="model-viewer">
//       <div className="model-placeholder">
//         <EnhancedIafViewer
//           enable2DViewer={false}
//           colorGroups={colorGroups}
//           isolatedEntities={[]}
//           selectedEntities={[]}
//           isolatedSpaces={[]}
//           hiddenElementIds={[]}
//           onCreateViewerRef={onCreateViewerRef}
//           model={selectedModel}
//           onSelect={handleOnSelectedElementChangeCallback}
//         />
//       </div>
//     </div>
//   );
// };

const OccupancyManagement = ({ selectedItems, ...props }) => {
  console.log('Props loading :--------->', props)
  console.log('entites loading  :--------->', Entities)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState()
  const [spaceLevels, setSpaceLevels] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [floorAsset, setFloorAsset] = useState([]);
  const [colorGroups, setColorGroups] = useState([]);
  const [selectedLeve, setSelectedLeve] = useState("");
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedNameOptions, setSelectedNameOptions] = useState([]);
  const [selectedCabin, setSelectedCabin] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [statusChartData, setStatusChartData] = useState([])
  const [assetClickType, setAssetClickType] = useState('')
  const [officeFilter, setOfficeFilter] = useState([]);
  const [allFilters, setAllFilters] = useState({});
  const [availableModel, setAvailableModel] = useState([])
  const [spaceMapWithModel, setSpaceMapWithModel] = useState([])
  const [mapboxToken, setMapboxToken] = useState()
  const [statusFilter, setStatusFilter] = useState([
    "Available",
    "Assigned",
    "Available & Assigned"
  ]);
  const [state, setState] = useState({
    openMsg: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const [successErrorMsg, setSuccessErrorMsg] = useState('')
  const [notificationMsg, setNotificationMsg] = useState('')
  const viewerRef = useRef()
  const isolatedEntities = useSelector(Entities.getIsolatedEntities);
  const selectedEntities = useSelector(Entities.getSelectedEntities);
  const levelZvalue = {
    "L0" : 14744.21,
    "L1" : 10884.76,
    "L2" : 10091.56,
    "B1" : -2487.77,
    "1F" : 9783.40,
    "MZ" : 11333.13,
    "GF" : 18595.12
  }

  console.log('isolatedEntities:-----> ', isolatedEntities)
  console.log('selectedEntities:-----> ', selectedEntities)
  const dispatch = useDispatch();

  useEffect(() => {
    // const fetchData = async () => {
    //   const spaceLevelData = await ScriptCache.runScript(props.handler.AssetOccupancy.config.entityData.Level.script, {});
    //   setSpaceLevels(spaceLevelData);

    //   IafProj.getProjectModels(selectedItems?.selectedProject._id)
    //     .then((res) => {
    //       console.log('Model to load :------>', res);
    //       const model = res._list.find(model => model._name === 'L&T_CUP_ARCH_ASBUILT CORE_2019');
    //       if (model) {
    //         setSelectedModel(model);
    //       } else {
    //         console.error('General Medical model has not been imported');
    //       }
    //     });
    // };

    // fetchData();
    getMapboxToken()
    loadAllModels();
  }, []);

  useEffect(() => {
    const entitiesToTheme = assetData.filter(({ shouldTheme }) => shouldTheme);
    const groupedEntities = Object.entries(_.groupBy(entitiesToTheme, e => e.color));

    function rgbToHex(r, g, b) {
      const componentToHex = (c) => {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }

      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    setColorGroups([{
      groupName: "shouldThemeElements",
      colors: groupedEntities.map(([k, v]) => ({
        color: rgbToHex(...v[0].color),
        "opacity": 1000000,
        elementIds: v.map(({ entity }) => entity.modelViewerIds[0])
      }))
    }]);

    dispatch(Entities.setEntities({ entities: entitiesToTheme.map(el => el.entity) }));
  }, [assetData])

  const loadAllModels = async () => {
    try {
      let spaceMapModel = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.getSpacesMapModel.script, {});
      console.log('get space map with model:---->', spaceMapModel);
      setSpaceMapWithModel(spaceMapModel)
      let currentProject = await IafProj.getCurrent()
      let importedModelComposites = await IafProj.getModels(currentProject)
      console.log('All models :----->', importedModelComposites)
      let modelName = spaceMapModel.map(info => {
        return info["Model Name"]
      })
      const spaceWithModel = importedModelComposites.filter(model => modelName.includes(model._name));
      //  importedModelComposites.filter(model=> model._name == info["Model Name"])
      console.log('spaceWithModel:------>', spaceWithModel)
      setAvailableModel(spaceWithModel)
    } catch (err) {
      console.error("ERROR: Retrieving Imported Models")
      console.error(err)
      setAvailableModel([{ _id: 0, _name: "Error Retrieving Imported Models" }])
    }
  }

  const onCreateViewerRef = (ref) => {
    viewerRef.current = ref
    const viewer = viewerRef?.current?.iafviewerRef?.current?._viewer;
    if (!viewer) {
      return;
    }

  }

  const notify = (msg) => {
    let headerStyle = document.getElementsByClassName("titlebar-header");
    //console.log(headerStyle[0].style,'hader--')
    console.log('Notification!');

    headerStyle[0].style.zIndex = -1
    if (msg == 'Success' || msg == 'success') {
      setSuccessErrorMsg('Success')
    } else {
      setNotificationMsg('Something went wrong!')
      setSuccessErrorMsg('Error')
    }
    setState({ openMsg: true, vertical: 'top', horizontal: 'right' });
    setTimeout(() => {
      handleCloseMsg()
    }, 5000);
  };

  const handleCloseMsg = () => {
    setState({ ...state, open: false });
  };

  const isMoved = (moved) => {
    console.log(moved, 'moved==');
    if (moved == true) {
      //getAllAssets()
      setNotificationMsg('Occupant has been moved successfully!')
      notify('success')
    } else {
      notify('error')
    }
  }
  const isUnassigned = (unassigned) => {
    console.log(unassigned, 'unassigned--');
    //getAllAssets()
    if (unassigned.success === true && unassigned.modal === 'Unassign') {
      setNotificationMsg('Workstation has been Unassigned successfully!')
      notify('success')
    } else if (unassigned.success === true && unassigned.modal === 'Assign') {
      setNotificationMsg('Workstation has been Assigned successfully!')
      notify('success')
    } else {
      notify('error')
    }
  }

  const onFloorChange = async (value) => {
    setIsLoading(true);
    let levelName = ""
    if (value === "assetClick") {
      levelName = selectedLeve
    }
    else {
      console.log('on change value :----->', value)
      console.log('get value :--->', spaceLevels[value])
      levelName = spaceLevels[value].name
      let zvalue = spaceLevels[value].zValue
      setSelectedLeve(levelName)

      setCuttingPlane(viewerRef, zvalue);
    }
    try {
      ScriptCache.clearCache();
      const floorAssets = await ScriptCache.runScript(props.handler.AssetOccupancy.config.entityData.getAssets.script, { levelName })
      console.log('asset data:-->', floorAssets);
      setAssetData(floorAssets)
      setFloorAsset(floorAssets)
      let nameOptions = [...new Set(floorAssets
        .filter(asset => asset.entity.properties?.["Office"]?.val)
        .map(asset => asset.entity.properties["Office"].val)
      )];
      setOfficeFilter(nameOptions)
    }
    catch (error) {
      console.error('Error fetching assets--:', error);
    }
    finally {
      setIsLoading(false); // Hide loader
    }
  }


  const onOfficeChange = async (value) => {
    console.log('on type change :--->', value);
    let filters = {
      spaceName : value
    }
    try {
      ScriptCache.clearCache();
      const selectedSpace = await ScriptCache.runScript(props.handler.AssetOccupancy.config.entityData.getSpaceByName.script, filters)
      console.log('get spaces by name :-->', selectedSpace);
      await cameraOnTop(viewerRef, selectedSpace[0]?.modelViewerIds);
      // await cameraOnTop(viewerRef, [15608]);
    }
    catch (error) {
      console.error('Error fetching assets on fetch--:', error);
    }
  };

  const onNameChange = (value) => {
    console.log('on Name chnage :---->', value)
  }

  const onStatusChange = (value) => {
    console.log('on Status change :---->', value)
  }

  const onFetch = async (value) => {
    if (!value) return; // Ensure value is not null/undefined
    setUserInfo([])
    setAssetClickType('')
    setStatusChartData([])
    setIsLoading(true);
    let filters = {
      floor:value?.floorValue || ""
    }
    if(value?.type == "assetClick"){
      filters = {
        ...filters,      // keep existing floor
        ...allFilters    // overwrite floor only if allFilters has it
      };
    }else{
      setSelectedLeve(spaceLevels[value.floor]?.name)
      filters = {
        floor: spaceLevels[value.floor]?.name || "",
        office: value?.office || "",
        cabin: value?.cabin || "",
      };
      setAllFilters(filters)
    }
    
    console.log("final Filters:---> ", filters);
    try {
      ScriptCache.clearCache();
      const floorAssets = await ScriptCache.runScript(props.handler.AssetOccupancy.config.entityData.getAssets.script, filters)
      console.log('asset data on fetch  :-->', floorAssets);
      setAssetData(floorAssets)
      if(filters?.office || filters?.cabin){
        let cabinOptions = [...new Set(floorAssets
          .filter(asset => asset.entity.properties?.["Cabin"]?.val)
          .map(asset => asset.entity.properties["Cabin"].val)
        )];
  
        console.log('selected cabin:---->', cabinOptions)
        if (value?.cabin === null) {
          setSelectedCabin(cabinOptions)
        }
        const chartData = {
          label: value.cabin != null ? value.cabin : value.office,
          Available: 0,
          Assigned: 0,
        };
  
        chartData.Available = floorAssets.filter(
          (asset) => asset.entity.properties?.["Occupied"]?.val === "No"
        ).length;
        chartData.Assigned = floorAssets.filter(
          (asset) => asset.entity.properties?.["Occupied"]?.val === "Yes"
        ).length;
  
  
        console.log("Final Chart Data :---->", chartData)
        setStatusChartData([chartData]);
      }

    }
    catch (error) {
      console.error('Error fetching assets on fetch--:', error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  // const onFetch = async (value) => {
  //   if (!value) return; // Ensure value is not null/undefined
  //   setUserInfo([])
  //   setAssetClickType('')
  //   setStatusChartData([])
  //   setSelectedLeve(spaceLevels[value.floor]?.name)
  //   setIsLoading(true);
  //   let filters = {
  //     floor: spaceLevels[value.floor]?.name || "",
  //     name: value.name || "",
  //     status:
  //       value.status === ""
  //         ? "All"
  //         : value.status === "Available"
  //           ? "No"
  //           : value.status === "Available & Assigned"
  //             ? "All"
  //             : "Yes",
  //   };

  //   const typeMapping = {
  //     Seats: "Seat No",
  //     Workstations: "Workstation Name",
  //     Room: "Room Name"
  //   };

  //   if (value.type in typeMapping) {
  //     filters.type = typeMapping[value.type];
  //   }

  //   console.log("final Filters:---> ", filters);
  //   try {
  //     ScriptCache.clearCache();
  //     const floorAssets = await ScriptCache.runScript(props.handler.AssetOccupancy.config.entityData.getAssets.script, filters)
  //     console.log('asset data on fetch  :-->', floorAssets);
  //     setAssetData(floorAssets)
  //     if (value.type !== "Seats") {
  //       const chartData = {
  //         label: value.name || "",
  //         Available: 0,
  //         Assigned: 0,
  //       };

  //       if (value.status === "Available") {
  //         chartData.Available = floorAssets.length;
  //       } else if (value.status === "Assigned") {
  //         chartData.Assigned = floorAssets.length;
  //       } else if (value.status === "Available & Assigned") {
  //         chartData.Available = floorAssets.filter(
  //           (asset) => asset.entity.properties?.["Occupied"]?.val === "No"
  //         ).length;
  //         chartData.Assigned = floorAssets.filter(
  //           (asset) => asset.entity.properties?.["Occupied"]?.val === "Yes"
  //         ).length;
  //       }

  //       console.log("Final Chart Data :---->", chartData)
  //       setStatusChartData([chartData]);
  //     }
  //   }
  //   catch (error) {
  //     console.error('Error fetching assets on fetch--:', error);
  //   } finally {
  //     setIsLoading(false); // Hide loader
  //   }
  // };

  const onTextSearch = async (value) => {
    setStatusChartData([])
    setAssetClickType('')
    setUserInfo([])
    setAssetData([])
    if (!value || value.trim() === '') return;
    setIsLoading(true);
    console.log('on text search value:---->>>', value)
    try {
      ScriptCache.clearCache();
      const floorAssets = await ScriptCache.runScript(props.handler.AssetOccupancy.config.entityData.getAssets.script, { "userName": value })
      console.log('asset data on search  :-->', floorAssets);
      setAssetData(floorAssets)
      setUserInfo(floorAssets)
      cameraOnTop(viewerRef, floorAssets[0].entity.modelViewerIds);
      // cameraOnTop(viewerRef, [15608]);
   
    }
    catch (error) {
      console.error('Error fetching assets on search--:', error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  }


  const handleOnSelectedElementChangeCallback = (elementIds) => {
    if (!elementIds?.length || !assetData?.length) return;

    const assetId = elementIds[0].id;
    const clickedAsset = assetData.find(item =>
      item.entity.modelViewerIds?.includes(assetId)
    );

    if (!clickedAsset) return;

    const occupancy = clickedAsset.entity.properties['Occupied']?.val?.toLowerCase();
    if (occupancy === 'no') {
      setAssetClickType('unoccupied');
    } else if (occupancy === 'yes') {
      setAssetClickType('assigned');
    }

    setUserInfo([clickedAsset]);
  };

  const onBuildinChange = async (modelCompositeId) => {
    setIsLoading(true);
    setSelectedModel(undefined)



    let selectedModel = availableModel.find(amc => amc._id === modelCompositeId)
    console.log('selected model:---->', selectedModel)
    // setSelectedModel(selectedModel)

    const buildingData = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.getBuildingData.script, {});
    console.log('get Building & level data :---->', buildingData);


    const uniqueLevels = [
      ...new Set(
        buildingData
          .filter(item => item?.properties?.["Model"]?.val == selectedModel._name) // name filter
          .map(item => item?.properties?.["Level"]?.val)
          .filter(Boolean)
      )
    ];


    console.log('uniqueLevels data :--->', uniqueLevels)
    const LevelData = uniqueLevels.map((levelName) => {
      if (levelZvalue[levelName]) {
        return {
          name: levelName,
          zValue: levelZvalue[levelName]
        }
      }
    })
    console.log('level data :--->', LevelData)
    setSpaceLevels(LevelData)
    setSelectedModel(selectedModel)
    setIsLoading(false);
  }

  const resetFilter = () => {
    setCuttingPlane(viewerRef, -12787.78);
    setSelectedLeve("")
    setAssetData([])
    setFloorAsset([])
    setStatusChartData([])
  }

  const getMapboxToken = async () => {
    let token = await getTemporaryMapBoxToken()

    console.log('Mapbox Token :------>', token)
    if (token) {
      setMapboxToken(token)
    }

  }

  return (
    <div className="app">
      <Sidebar
        onFloorChange={onFloorChange}
        spaceLevels={spaceLevels}
        officeFilter={officeFilter}
        onOfficeChange={onOfficeChange}
        statusFilter={statusFilter}
        selectedNameOptions={selectedNameOptions}
        assetData={assetData}
        onNameChange={onNameChange}
        onStatusChange={onStatusChange}
        onFetch={onFetch}
        floorAsset={floorAsset}
        onTextSearch={onTextSearch}
        setIsMoveModalOpen={setIsMoveModalOpen}
        setIsUnassignModalOpen={setIsUnassignModalOpen}
        setIsAssignModalOpen={setIsAssignModalOpen}
        statusChartData={statusChartData}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        assetClickType={assetClickType}
        resetFilter={resetFilter}
        selectedCabin={selectedCabin}
        setSelectedCabin={setSelectedCabin}
        availableModel={availableModel}
        onBuildinChange = {onBuildinChange}
      />
      {selectedModel &&
        <>
          <ModelViewer
            selectedModel={selectedModel}
            onCreateViewerRef={onCreateViewerRef}
            isolatedEntities={isolatedEntities}
            selectedEntities={selectedEntities}
            colorGroups={colorGroups}
            handleOnSelectedElementChangeCallback={handleOnSelectedElementChangeCallback}
          />
        </>

      }
      {/*Move user  */}

      <MoveUserModal
        {...props}
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        userInfo={userInfo}
        floorValue={selectedLeve}
        onTextSearch={onTextSearch}
        onFloorChange={onFloorChange}
        assetClickType={assetClickType}
        isMoved={isMoved}
        onFetch={onFetch}
      />

      {/*Unassign and Assign User */}
      <AssignAndUnassignUser
        {...props}
        isOpen={isUnassignModalOpen}
        onClose={() => setIsUnassignModalOpen(false)}
        userInfo={userInfo}
        floorValue={selectedLeve}
        onTextSearch={onTextSearch}
        onFloorChange={onFloorChange}
        isUnassigned={isUnassigned}
        onFetch={onFetch}
      />
      <Notification 
        open={state.openMsg}
        onClose={() => setState({openMsg: false, vertical:'top', horizontal: 'right'})}
        message={notificationMsg}
        successOrErr={successErrorMsg}
        />
      {/* Full-Page Loader */}
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

// export default withRouter(OccupancyManagement);
export default OccupancyManagement;

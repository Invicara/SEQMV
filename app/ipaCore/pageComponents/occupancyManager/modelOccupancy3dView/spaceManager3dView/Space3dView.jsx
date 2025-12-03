import React, { useEffect, useState, useRef } from 'react';
import { IafProj } from '@dtplatform/platform-api'
import "@dtplatform/iaf-viewer/dist/iaf-viewer.css"
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import { EnhancedIafViewer } from "./EnhancedIafViewer"
import { useDispatch, useSelector } from "react-redux"
import { Entities } from "@invicara/ipa-core/modules/IpaRedux"
import { makeStyles, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import { setCuttingPlane,cameraOnTop } from "./utilities";
import './spaceManager3dView.scss'
import UnallocateSpace from './modal/UnallocateSpace'
import MoveUser from './modal/MoveUser';
import AllocateSpace3d from './modal/AllocateSpace3d';
import StatusBarChart from './charts/StatusBarChart';
import Notification from './modal/Notification';
// Mapbox utilities to support Mapbox in the viewer
import { getTemporaryMapBoxToken } from '../../../utils/mapboxUtils'
// import HoverTooltipOperator from './HoverTooltipOperator';
import { createHoverTooltipOperator } from './HoverTooltipOperator';
import HoverInfo from './tooltips/HoverInfo';
import { createPortal } from 'react-dom';
import Sidebar from './Sidebar';
import ModelViewer from './ModelViewer';

// const Sidebar = ({ onFloorChange,
//   onBuildinChange,
//   spaceBiulding,
//   spaceLevels,
//   spaceFilter,
//   onOfficeChange,
//   statusFilter,
//   selectedNameOptions,
//   spaceData,
//   onNameChange,
//   onStatusChange,
//   onFetch,
//   floorSpaces,
//   onTextSearch,
//   setIsMoveModalOpen,
//   setIsUnassignModalOpen,
//   setIsAssignModalOpen,
//   statusChartData,
//   userInfo,
//   setUserInfo,
//   spaceClickType,
//   resetFilter,
//   selectedCabin,
//   setSelectedCabin,
//   availableModel }) => {
//   const [selectedBuilding, setSelectedBuilding] = useState("");
//   const [selectedFloor, setSelectedFloor] = useState("");
//   const [selectedSpace, setSelectedSpace] = useState("");
//   const [selectedName, setSelectedName] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [noDataFound, setNoDataFound] = useState(false);
//   const [showUserOptions, setShowUserOptions] = useState(false);
//   const isSearchDisabled = !selectedFloor;

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

//       {/* Select Building */}
//       <select
//         className="select"
//         onChange={(e) => {
//           const value = e.target.value;
//           setSelectedBuilding(value);
//           setSelectedSpace(""); // Reset Type when Floor changes
//           setSelectedName(""); // Reset Name when Floor changes
//           setSelectedStatus(""); // Reset Status when Floor changes
//           setSearchText("");
//           setUserInfo([])
//           setSelectedCabin([])
//           setNoDataFound(false)
//           onBuildinChange(value);
//         }}
//         value={selectedBuilding}
//       >
//         <option value="" disabled hidden>Choose Building</option>
//         {/* {spaceBiulding?.map((building, index) => (
//           <option key={index} value={building}>
//             {building}
//           </option>
//         ))} */}
//          {availableModel.sort((a,b) => a._name.localeCompare(b._name)).map(amc => <option key={amc._id} value={amc._id}>{amc._name}</option>)}
//       </select>

//       {/* Floor Selection */}
//       {/* <select
//         className="select"
//         onChange={(e) => {
//           const value = e.target.value;
//           setSelectedFloor(value);
//           setSelectedSpace(""); // Reset Type when Floor changes
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
//       </select> */}

//       {/* Show other selects only if a floor is selected */}
//       {selectedBuilding && (
//         <>
//           {/* Type Selection (Disabled until Floor is selected) */}

//           {/* Floor Selection */}
//           <select
//             className="select"
//             onChange={(e) => {
//               const value = e.target.value;
//               setSelectedFloor(value);
//               setSelectedSpace(""); // Reset Type when Floor changes
//               setSelectedName(""); // Reset Name when Floor changes
//               setSelectedStatus(""); // Reset Status when Floor changes
//               setSearchText("");
//               setUserInfo([])
//               setSelectedCabin([])
//               setNoDataFound(false)
//               onFloorChange(value);
//             }}
//             value={selectedFloor}
//           >
//             <option value="" disabled hidden>Choose Floor</option>
//             {console.log('level values :--->',spaceLevels)}
//             {spaceLevels?.map((level, index) => (
//               <option key={index} value={index}>
//                 {level.name}
//               </option>
//             ))}
//           </select>

//           <select
//             className="select"
//             onChange={ async (e) => {
//               const value = e.target.value;
//               setSelectedSpace(value);
//               setSelectedName(""); // Reset Name when Type changes
//               setSelectedStatus("")
//               setSearchText("");
//               setSelectedCabin([])
//               setNoDataFound(false)
//               await onFetch({
//                 building : selectedBuilding,
//                 floor: selectedFloor,
//                 space: value,
//                 cabin: null,
//               });
//               await onOfficeChange(value);
      
//             }}
//             value={selectedSpace} // Reset when Floor changes
//           >
//             <option value="" disabled hidden>Choose Space</option>
//             {spaceFilter?.map((spaceFilter, index) => (
//               <option key={index} value={spaceFilter}>
//                 {spaceFilter}
//               </option>
//             ))}
//           </select>

//           {(!isSearchDisabled || userInfo.length > 0) && (<div
//             className="rest-filters"
//             onClick={() => {
//               setSelectedFloor("");
//               setSelectedSpace("");
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
//           {spaceData.length == 0 && noDataFound && <p className="no-results-message">No matching data found.</p>}

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
//                   setSelectedSpace(""); // Reset Type when Floor changes
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
//                 <span>{spaceClickType !== '' ? 'Space info' : 'Occupant Info'}</span>
//                 <i
//                   className="fas fa-ellipsis-v"
//                   ref={iconRef}
//                   onClick={() => setShowUserOptions(prev => !prev)}
//                   style={{ cursor: 'pointer' }}
//                 ></i>
//               </div>

//               <div className="user-details">
//                 <p><strong>Space name:</strong> {userInfo[0]?.entity?.properties['Space Name'].val}</p>
//                 <p><strong>Level:</strong> {userInfo[0]?.entity?.properties['Level'].val}</p>
//                 {/* <p><strong>Customer Code:</strong> {userInfo[0]?.entity?.properties['Customer Code'].val}</p> */}
//                 <p><strong>Customer Name:</strong> {userInfo[0]?.entity?.properties['Customer Name'].val}</p>
//                 <p><strong>Contract:</strong> {userInfo[0]?.entity?.properties['Contract'].val}</p>
//                 <p><strong>Agreement Start Date:</strong> {userInfo[0]?.entity?.properties['Agreement Start Date'].val}</p>
//                 <p><strong>Agreement End Date:</strong> {userInfo[0]?.entity?.properties['Agreement End Date'].val}</p>
//                 <p><strong>Applicable Tariff in INR/Sqm:</strong> {userInfo[0]?.entity?.properties['Applicable Tariff'].val}</p>
//                 <p><strong>Rental Charges (Monthly):</strong> {userInfo[0]?.entity?.properties['Rental Charges'].val}</p>
//                 <p><strong>Security Deposit:</strong> {userInfo[0]?.entity?.properties['Security Deposit'].val}</p>
//               </div>

//               {showUserOptions && (
//                 <div className="dropdown-menu-style" ref={menuRef}>
//                   {spaceClickType === 'assigned' && (
//                     <>
//                       <div className="dropdown-item" onClick={() => { setIsMoveModalOpen(true); setShowUserOptions(false); }}>Move Team</div>
//                       <div className="dropdown-item" onClick={() => { setIsUnassignModalOpen(true); setShowUserOptions(false); }}>Unassign Sapce</div>
//                     </>
//                   )}
//                   {spaceClickType === 'unoccupied' && (
//                     <div className="dropdown-item" onClick={() => { setIsAssignModalOpen(true); setShowUserOptions(false); }}>Assign Sapce</div>
//                   )}
//                   {spaceClickType === '' && (
//                     <div className="dropdown-item" onClick={() => { setIsMoveModalOpen(true); setShowUserOptions(false); }}>Move Team</div>
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

// const ModelViewer = ({ selectedModel, onCreateViewerRef, isolatedEntities, selectedEntities, colorGroups, handleOnSelectedElementChangeCallback,mapboxToken }) => {
//   console.log('selectedModel:----->', selectedModel)
//   return (
//     <div className="model-viewer">
//       <div className="model-placeholder">
//         <EnhancedIafViewer
//           enable2DViewer={false}
//           colorGroups={colorGroups}
//           isolatedEntities={isolatedEntities}
//           selectedEntities={selectedEntities}
//           isolatedSpaces={isolatedEntities}
//           hiddenElementIds={[]}
//           onCreateViewerRef={onCreateViewerRef}
//           model={selectedModel}
//           onSelect={handleOnSelectedElementChangeCallback}
//           gis={{
//             enabled: true,
//             enabled: !!mapboxToken,
//             token: mapboxToken
//          }}
//         />
//       </div>
//     </div>
//   );
// };

const Space3dView = ({ selectedItems, ...props }) => {
  console.log('Props loading :--------->', props)
  console.log('entites loading  :--------->', Entities)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState()
  const [spaceLevels, setSpaceLevels] = useState([]);
  const [spaceData, setSpaceData] = useState([]);
  const [totalSpaceData, setTotalSpaceData] = useState([]);
  const [floorSpaces, setFloorSpaces] = useState([]);
  const [colorGroups, setColorGroups] = useState([]);
  const [selectedLeve, setSelectedLeve] = useState("");
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedNameOptions, setSelectedNameOptions] = useState([]);
  const [selectedCabin, setSelectedCabin] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [statusChartData, setStatusChartData] = useState([])
  const [spaceClickType, setSpaceClickType] = useState('')
  const [spaceFilter, setSpaceFilter] = useState([]);
  const [allFilters, setAllFilters] = useState({});
  const [spaceBiulding, setSpaceBiulding] = useState([]);
  const [spaceBiuldingAndLevels, setSpaceBiuldingAndLevels] = useState([]);
  const [selectedSpaceCollection, setSelectedSpaceCollection] = useState(false)
  const [mapboxToken, setMapboxToken] = useState()
  const [availableModel, setAvailableModel] = useState([])
  const [spaceMapWithModel, setSpaceMapWithModel] = useState([])
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
  const [hoveredPart, setHoveredPart] = useState(null);
  const viewerRef = useRef()
  const portalContainer = useRef()
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

  const dispatch = useDispatch();
  useEffect(() => {
    getMapboxToken()
    loadAllModels();
  }, []);


  useEffect(() => {
    const entitiesToTheme = spaceData.filter(({ shouldTheme }) => shouldTheme);
    console.log('entitiesToTheme :-------->',entitiesToTheme)
    const groupedEntities = Object.entries(_.groupBy(entitiesToTheme, e => e.color));
    console.log('groupedEntities :-------->',groupedEntities)
    function rgbToHex(r, g, b) {
      const componentToHex = (c) => {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }

      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    // setColorGroups([{
    //   groupName: "shouldThemeElements",
    //   colors: groupedEntities.map(([k, v]) => ({
    //     color: rgbToHex(...v[0].color),
    //     "opacity": 1000,
    //     elementIds: v.map(({ entity }) => entity.modelViewerIds[0])
    //   }))
    // }]);

    // dispatch(Entities.setEntities({ entities: entitiesToTheme.map(el => el.entity) }));
    
    // console.log('color group :----->',colorGroups)

    if (Array.isArray(groupedEntities)) {
      const colorGroupsData = [{
        groupName: "shouldThemeElements",
        colors: groupedEntities.map(([k, v]) => ({
          color: rgbToHex(...(v[0]?.color || [0, 0, 0])),
          opacity: 1,
          elementIds: v.map(({ entity }) => entity.modelViewerIds?.[0]).filter(Boolean)
        }))
      }];
    
      console.log('colorGroupsData :---->',colorGroupsData)
      setColorGroups(colorGroupsData);
    
      dispatch(Entities.setEntities({
        entities: entitiesToTheme.map(el => el.entity)
      }));
    }
    
    console.log('color group :----->',colorGroups)

    const viewer = viewerRef?.current?.iafviewerRef?.current?._viewer;
    if (!viewer) {
      return;
    }

    console.log('viewer data :---->',viewer)
    console.log('window.Communicator?.Operator?.OperatorBase data :---->',window.Communicator?.Operator?.OperatorBase)
    if (!viewer || !window.Communicator?.Operator?.OperatorBase) {
      console.warn("Viewer not ready for HoverTooltipOperator");
      return;
    }
  
    const hoverOperator = createHoverTooltipOperator(viewer, viewerRef, { setHoveredPart });
    console.log('hoverOperator :------->',hoverOperator)
    if (!hoverOperator) return;
  
    const operatorManager = viewer.operatorManager;
    const handle = operatorManager.registerCustomOperator(hoverOperator);
    operatorManager.push(handle);

   // console.log('Operatore base :------->',window.Communicator?.Operator?.OperatorBase)
    // const operatorManager = viewer.operatorManager;
    // const markupOperator = new HoverTooltipOperator(viewer,viewerRef, { setHoveredPart });
    // const markupOperatorHandle = operatorManager.registerCustomOperator(markupOperator);
    // operatorManager.push(markupOperatorHandle);


  }, [spaceData])

  const loadAllModels = async () => {
    try {
      let spaceMapModel = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.getSpacesMapModel.script, {});
      console.log('get space map with model:---->', spaceMapModel);
      setSpaceMapWithModel(spaceMapModel)
      let currentProject = await IafProj.getCurrent()
      let importedModelComposites = await IafProj.getModels(currentProject)
      console.log('All models :----->', importedModelComposites)
      let modelName = spaceMapModel.map(info=>{
        return info["Model Name"]
      })
      const spaceWithModel = importedModelComposites.filter(model => modelName.includes(model._name));
      //  importedModelComposites.filter(model=> model._name == info["Model Name"])
      console.log('spaceWithModel:------>',spaceWithModel)
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
    let headerStyle = document.getElementsByClassName("HeaderBar__container");
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

  const isSuccessOrFailMsg = (msg) => {
    console.log(msg, 'msg');
    if (msg.success === true) {
      setNotificationMsg(msg.modalForm + ' ' + msg.action + ' Successfully!')
      notify('success')
      // getAllSpaces()
      onFetch({
        floorValue: selectedLeve,
        type: 'assetClick'
      })
    } else {
      notify('error')
    }
  }

  const handleCloseMsg = () => {
    setState({ ...state, open: false });
  };

  const onBuildinChange = async (modelCompositeId) => {
    setIsLoading(true);
    setSelectedModel(undefined)

    // setTimeout(async () => {
    //   let selectedModel = availableModel.find(amc => amc._id === modelCompositeId)
    //   console.log('selected model:---->', selectedModel)
    //   setSelectedModel(selectedModel)
    //   //  setSelectedModelComposite(selectedModel)
    // }, 1000)

    let selectedModel = availableModel.find(amc => amc._id === modelCompositeId)
    console.log('selected model:---->', selectedModel)
    // setSelectedModel(selectedModel)

    const buildingData = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.getBuildingData.script, {});
    console.log('get Building & level data :---->', buildingData);
    // const uniqueLevels = [
    //   ...new Set(
    //     spaceBiuldingAndLevels.map(item => item?.properties?.["Level"]?.val).filter(Boolean)
    //   )
    // ];

    // const uniqueLevels = [
    //   ...new Set(
    //     buildingData
    //       .filter(item =>
    //         item?.properties?.["Model"]?.val === selectedModel?._name &&
    //         item?.properties?.["category"]?.val?.toLowerCase() === "lease"
    //       ) // name filter
    //       .map(item => item?.properties?.["Level"]?.val)
    //       .filter(Boolean)
    //   )
    // ];


    // console.log('uniqueLevels data :--->', uniqueLevels)
    // const LevelData = uniqueLevels.map((levelName) => {
    //   if (levelZvalue[levelName]) {
    //     return {
    //       name: levelName,
    //       zValue: levelZvalue[levelName]
    //     }
    //   }
    // })

    const uniqueLevels = [
      ...new Set(
        buildingData
          .filter(item =>
            item?.properties?.["Model"]?.val === selectedModel?._name &&
            item?.properties?.["category"]?.val?.toLowerCase() === "lease"
          )
          .map(item => ({
            level: item?.properties?.["Level"]?.val,
            zvalue: item?.properties?.["Zvalue"]?.val,
          }))
          .filter(v => v !== null && v !== undefined)
      )
    ];


    console.log('uniqueLevels data :--->', uniqueLevels)
    const LevelData = uniqueLevels.map((levelData) => {
      return {
        name: levelData.level,
        zValue: levelData.zvalue
      }
    })
    console.log('level data :--->', LevelData)

    setSpaceLevels(LevelData)
    setSelectedModel(selectedModel)
    setIsLoading(false);
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
      // let zvalue = spaceLevels[value].zValue
      setSelectedLeve(levelName)

      // setCuttingPlane(viewerRef, zvalue);
    }
    try {
      spaceMapWithModel
      const selectedSpaceMapWithModel = spaceMapWithModel.filter(model => model['Model Name'] == selectedModel._name);
      setSelectedSpaceCollection(selectedSpaceMapWithModel)
      console.log('selectedSpaceMapWithModel :------>',selectedSpaceMapWithModel)
      ScriptCache.clearCache();
      const floorSpaces = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.getFilterSpaces.script, { "floor":levelName,"model":selectedModel ,"collectionInfo":selectedSpaceMapWithModel[0] })
      console.log('space data:-->', floorSpaces);
      setTotalSpaceData(floorSpaces)
      setSpaceData(floorSpaces)
      setFloorSpaces(floorSpaces)

      let filterSpaceName = [...new Set(floorSpaces
        .filter(space => space.entity["Space Name"])
        .map(space => space.entity["Space Name"])
      )];
      console.log('filter sapce data:-->', filterSpaceName);
      setSpaceFilter(filterSpaceName)

      const chartData = {
        label:levelName,
        Available: 0,
        Assigned: 0,
      };

      chartData.Available = floorSpaces.filter(
        (asset) => asset.entity.properties?.["Rental Status"]?.val === "FALSE"
      ).length;
      chartData.Assigned = floorSpaces.filter(
        (asset) => asset.entity.properties?.["Rental Status"]?.val === "TRUE"
      ).length;

      console.log("Final Chart Data :---->", chartData)
      setStatusChartData([chartData]);

      if (value !== "assetClick") {
        let zvalue = spaceLevels[value].zValue
        setCuttingPlane(viewerRef, zvalue);
      }
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
      console.log('floorSpaces :-->',floorSpaces)
      // ScriptCache.clearCache();
      // const selectedSpace = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.getSpaceByName.script, filters)
      const selectedSpace = floorSpaces.filter(space => space.entity?.['Space Name'] === value)
      console.log('get spaces by name :-->', selectedSpace);
      await cameraOnTop(viewerRef, selectedSpace[0]?.entity?.modelViewerIds);
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
    setSpaceClickType('')
    setStatusChartData([])
    setIsLoading(true);
    const selectedSpaceMapWithModel = spaceMapWithModel.filter(model => model['Model Name'] == selectedModel._name);
    let filters = {
      floor:value?.floorValue || "",
      model:selectedModel ,
      collectionInfo :selectedSpaceMapWithModel[0]
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
        spaceName: value?.space || "",
        cabin: value?.cabin || "",
        model: selectedModel,
        collectionInfo: selectedSpaceMapWithModel[0]
      };
      setAllFilters(filters)
    }
    
    console.log("final Filters:---> ", filters);
    try {
      ScriptCache.clearCache();
      const floorSpaces = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.getFilterSpaces.script, filters)
      console.log('asset data on fetch  :-->', floorSpaces);
      setSpaceData(floorSpaces)
    
        const chartData = {
          label: value.space != null ? value.space : value.building,
          Available: 0,
          Assigned: 0,
        };
  
        chartData.Available = floorSpaces.filter(
          (asset) => asset.entity.properties?.["Rental Status"]?.val === "FALSE"
        ).length;
        chartData.Assigned = floorSpaces.filter(
          (asset) => asset.entity.properties?.["Rental Status"]?.val === "TRUE"
        ).length;
  
  
        console.log("Final Chart Data :---->", chartData)
      if (filters.spaceName && filters.spaceName.trim() !== '') {
       setStatusChartData([]);
      } else {
       setStatusChartData([chartData]);
      }
        // setStatusChartData([chartData]);
      // }

    }
    catch (error) {
      console.error('Error fetching assets on fetch--:', error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const onTextSearch = async (value) => {
    setStatusChartData([])
    setSpaceClickType('')
    setUserInfo([])
    setSpaceData([])
    if (!value || value.trim() === '') return;
    setIsLoading(true);
    console.log('on text search value:---->>>', value)
    try {
      const selectedSpaceMapWithModel = spaceMapWithModel.filter(model => model['Model Name'] == selectedModel._name);
      ScriptCache.clearCache();
      const floorAssets = await ScriptCache.runScript(props.handler.spaceOccupancy.config.entityData.getFilterSpaces.script, { "userName": value,"model":selectedModel ,"collectionInfo":selectedSpaceMapWithModel[0] })
      console.log('asset data on search  :-->', floorAssets);
      setSpaceData(floorAssets)
      setUserInfo(floorAssets)
      const occupancy = floorAssets[0].entity.properties['Rental Status']?.val?.toLowerCase();
      if (occupancy === 'false') {
        setSpaceClickType('unoccupied');
      }else if(occupancy === 'true'){
        setSpaceClickType('assigned');
      }
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
    console.log('click space id :---->',elementIds)
    if (!elementIds?.length || !spaceData?.length) return;

    const assetId = elementIds[0].id;
    const clickedAsset = spaceData.find(item =>
      item.entity.modelViewerIds?.includes(assetId)
    );
    console.log('Clicked Space :--->',clickedAsset)
    if (!clickedAsset) return;

    const occupancy = clickedAsset.entity.properties['Rental Status']?.val?.toLowerCase();
    if (occupancy === 'false') {
      setSpaceClickType('unoccupied');
    } else if (occupancy === 'true') {
      setSpaceClickType('assigned');
    }

    setUserInfo([clickedAsset]);
    dispatch(Entities.setSelectedEntities([clickedAsset.entity]));
  };

  const resetFilter = () => {
    dispatch(Entities.setEntities({ entities: [] }));
    setCuttingPlane(viewerRef, -12787.78);
    setSelectedLeve("")
    setSpaceData([])
    setFloorSpaces([])
    setStatusChartData([])
  }

  const getMapboxToken = async () => {
    let token = await getTemporaryMapBoxToken()

    console.log('Mapbox Token :------>',token)
    if (token) {
       setMapboxToken(token)
    }

 }

  return (
    <div ref={portalContainer} className="app">
      <Sidebar
        onFloorChange={onFloorChange}
        onBuildinChange={onBuildinChange}
        spaceBiulding = {spaceBiulding}
        spaceLevels={spaceLevels}
        spaceFilter={spaceFilter}
        onOfficeChange={onOfficeChange}
        statusFilter={statusFilter}
        selectedNameOptions={selectedNameOptions}
        spaceData={spaceData}
        onNameChange={onNameChange}
        onStatusChange={onStatusChange}
        onFetch={onFetch}
        floorSpaces={floorSpaces}
        onTextSearch={onTextSearch}
        setIsMoveModalOpen={setIsMoveModalOpen}
        setIsUnassignModalOpen={setIsUnassignModalOpen}
        setIsAssignModalOpen={setIsAssignModalOpen}
        statusChartData={statusChartData}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        spaceClickType={spaceClickType}
        resetFilter={resetFilter}
        selectedCabin={selectedCabin}
        setSelectedCabin={setSelectedCabin}
        availableModel ={availableModel}
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
            mapboxToken = {mapboxToken}
          />
        </>

      }
      {/*Move user  */}

      <MoveUser
        {...props}
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        isSuccessOrFailMsg={isSuccessOrFailMsg}
        userInfo={userInfo[0]?.entity}
        spaceInfo ={totalSpaceData}
        mode = {'3dView'}
        selectedModel={selectedModel}
        selectedSpaceCollection={selectedSpaceCollection}
      />
      <UnallocateSpace
        {...props}
        isOpen={isUnassignModalOpen}
        onClose={() => setIsUnassignModalOpen(false)}
        isSuccessOrFailMsg={isSuccessOrFailMsg}
        userInfo={userInfo[0]?.entity}
        selectedModel={selectedModel}
        selectedSpaceCollection={selectedSpaceCollection}
      />
      <AllocateSpace3d
        {...props}
        isOpen={isAssignModalOpen}
        isSuccessOrFailMsg={isSuccessOrFailMsg}
        onClose={() => setIsAssignModalOpen(false)}
        spaceInfo={userInfo[0]?.entity}
        mode = {'3dView'}
        selectedModel={selectedModel}
        selectedSpaceCollection={selectedSpaceCollection}
      />
      <Notification 
        open={state.openMsg}
        onClose={() => setState({openMsg: false, vertical:'top', horizontal: 'right'})}
        message={notificationMsg}
        successOrErr={successErrorMsg}
        />
      {/* {hoveredPart && (
        <div
          style={{
            position: "absolute",
            left: hoveredPart.screenPosition.x,
            top: hoveredPart.screenPosition.y,
            transform: "translate(-50%, -100%)",
            background: "#333",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          Part ID: {hoveredPart.partId}
        </div>
      )} */}

      {hoveredPart && portalContainer.current && createPortal(<HoverInfo markup={hoveredPart} spaceData={spaceData} prefersDarkMode={true}/>, portalContainer.current)}
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
export default Space3dView;

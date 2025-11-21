import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import './spaceManager3dView/spaceManager3dView.scss'
// import LeaseView from "./LeaseView";
// import SpaceView from "./SpaceView";
import Space3dView from "./spaceManager3dView/Space3dView";
import OccupancyManagement from "./assetManagert3dView/OccupancyManagement"
const ModelOccupancy3dView = ({ selectedItems, ...props }) => {
  console.log('props :---->', props)
  const [activeTab, setActiveTab] = useState("space");
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="space3dViewContainer">

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <div className="tabSideBar">
          <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs value={activeTab} onChange={handleChange} centered>
              <Tab label="OCCUPANCY" value="space" />
              <Tab label="LEASE" value="lease" />

            </Tabs>
          </Box>
        </div>
        <Box >
          {activeTab === "space" &&
            <Space3dView
              {...props}
              selectedItems={selectedItems}
            />}
          {activeTab === "lease" &&
            <OccupancyManagement
              {...props}
              selectedItems={selectedItems}
            />}
        </Box>
      </Box>
    </div>

  );
}

export default ModelOccupancy3dView;
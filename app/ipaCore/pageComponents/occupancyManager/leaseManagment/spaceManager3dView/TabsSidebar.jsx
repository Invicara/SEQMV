import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import spaceManager3dView from './spaceManager3dView';

const TabsSidebar = ({ onTabChange }) => {
const [activeTab, setActiveTab] = useState("lease");

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          width: 250,
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="fullWidth"
        >
          <Tab label="LEASE" value="lease" />
          <Tab label="SPACE" value="space" />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, p: 2 }}>
        {activeTab === "lease" && <spaceManager3dView />}
        {activeTab === "space" }
      </Box>
    </Box>
  )
};

export default TabsSidebar;

import React, { useEffect, useRef } from "react";
import { EnhancedIafViewer } from "./EnhancedIafViewer"

const ModelViewer = ({ selectedModel, onCreateViewerRef, isolatedEntities, selectedEntities, colorGroups, handleOnSelectedElementChangeCallback,mapboxToken }) => {
  console.log('selectedModel:----->', selectedModel)
  return (
    <div className="model-viewer">
      <div className="model-placeholder">
        <EnhancedIafViewer
          enable2DViewer={false}
          colorGroups={colorGroups}
          isolatedEntities={isolatedEntities}
          selectedEntities={selectedEntities}
          isolatedSpaces={isolatedEntities}
          hiddenElementIds={[]}
          onCreateViewerRef={onCreateViewerRef}
          model={selectedModel}
          onSelect={handleOnSelectedElementChangeCallback}
          gis={{
            enabled: true,
            enabled: !!mapboxToken,
            token: mapboxToken
         }}
        />
      </div>
    </div>
  );
};

export default ModelViewer;
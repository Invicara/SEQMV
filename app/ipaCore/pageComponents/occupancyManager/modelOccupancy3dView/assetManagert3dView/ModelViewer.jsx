import React, { useEffect, useRef } from "react";
import { EnhancedIafViewer } from "./EnhancedIafViewer"

const ModelViewer = ({ selectedModel, onCreateViewerRef, isolatedEntities, selectedEntities, colorGroups, handleOnSelectedElementChangeCallback }) => {
  console.log('selectedModel:----->', selectedModel)
  return (
    <div className="model-viewer">
      <div className="model-placeholder">
        <EnhancedIafViewer
          enable2DViewer={false}
          colorGroups={colorGroups}
          isolatedEntities={[]}
          selectedEntities={[]}
          isolatedSpaces={[]}
          hiddenElementIds={[]}
          onCreateViewerRef={onCreateViewerRef}
          model={selectedModel}
          onSelect={handleOnSelectedElementChangeCallback}
        />
      </div>
    </div>
  );
};

export default ModelViewer;
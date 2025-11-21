export const getNodeIdFromPkgId = (viewerRef, pkgId) => {
     viewerRef = viewerRef?.current?.iafviewerRef?.current
    return parseInt(viewerRef.props.idMapping[1][pkgId])
}


/**
* Map table between Hoops and Invicara internal elementID
* NodeID -> PkgID
*/
export const getPkgIdFromNodeId = (viewerRef,nodeId) => {
    let pkgId
    let currentNodeId = nodeId
    viewerRef = viewerRef?.current?.iafviewerRef?.current
    let i = 0
    while (!pkgId && i < 20) {
        i++
        let pkgFromNode = viewerRef.props.idMapping[0][currentNodeId]
        if (pkgFromNode) {
            return parseInt(pkgFromNode)
        }
        currentNodeId = viewerRef._viewer.model.getNodeParent(currentNodeId)
    }

    return
}

// class HoverTooltipOperator extends window.Communicator.Operator.OperatorBase {
//     _viewer;
//     _partId;
//     _markup;

//     constructor(viewer,viewerRef, props) {
//         super(viewer)
//         this._viewer = viewer;
//         this.props = props;
//         this.viewerRef = viewerRef
//         this._partId = null;
//         this._markup = null;
//     }

//     onMouseMove(event) {
//         console.log('in side onMouseMove :---->>>')
//         console.log('this.props :----->', this.props)
//         const pickConfig = new Communicator.PickConfig(Communicator.SelectionMask.All);
//         this._viewer.view.pickFromPoint(event.getPosition(), pickConfig).then(async (selection) => {
//             console.log('onMouseMove selection:---->>>', selection)
//             if (selection.getSelectionType() !== Communicator.SelectionType.None) {
//                 // this._partId = selection.getNodeId();
//                 // console.log('Part id :---->', this._partId)
//                 // this._viewer.model.setNodesOpacity([this._partId], 0.5);

//                 this._partId = selection.getNodeId();
//                 // console.log('Part id :---->',  this._partId)
//                 let modelId = getPkgIdFromNodeId(this.viewerRef,  this._partId)
//                 // console.log("nodeId:------->", modelId);
//                 const worldPosition = selection.getPosition();
//                 const screenPosition = this._viewer.view.projectPoint(worldPosition);
//                 if (this.props.setHoveredPart) {
//                     this.props.setHoveredPart({
//                         modelId,
//                         screenPosition,
//                     });
//                 }
//                 ///add markup on top of the selection and activate react tooltip

//             } else if (this._partId !== null) {
//                 // this._viewer.model.setNodesOpacity([this._partId], 1.0);
//                 this._partId = null;

//                 // PLUS destroy the SVG markup     
//                 //remove markup and React tooltip    

//                 this._markup = null; 
//                 if (this.props.setHoveredPart) {
//                     this.props.setHoveredPart(null); // Hide tooltip
//                 }
//             }
//         });
//     }

// }

// export default HoverTooltipOperator

export const createHoverTooltipOperator = (viewer, viewerRef, props) => {
    if (!window.Communicator?.Operator?.OperatorBase) {
      console.warn("Communicator not ready yet");
      return null;
    }
  
    class HoverTooltipOperator extends window.Communicator.Operator.OperatorBase {
      _viewer;
      _partId;
      _markup;
  
      constructor(viewer, viewerRef, props) {
        super(viewer);
        this._viewer = viewer;
        this.viewerRef = viewerRef;
        this.props = props;
        this._partId = null;
        this._markup = null;
      }
  
      onMouseMove(event) {
        const pickConfig = new Communicator.PickConfig(Communicator.SelectionMask.All);
        this._viewer.view.pickFromPoint(event.getPosition(), pickConfig).then(async (selection) => {
          if (selection.getSelectionType() !== Communicator.SelectionType.None) {
            this._partId = selection.getNodeId();
            const modelId = getPkgIdFromNodeId(this.viewerRef, this._partId);
            const worldPosition = selection.getPosition();
            const screenPosition = this._viewer.view.projectPoint(worldPosition);
            if (this.props.setHoveredPart) {
              this.props.setHoveredPart({ modelId, screenPosition });
            }
          } else if (this._partId !== null) {
            this._partId = null;
            this._markup = null;
            if (this.props.setHoveredPart) {
              this.props.setHoveredPart(null);
            }
          }
        });
      }
    }
  
    return new HoverTooltipOperator(viewer, viewerRef, props);
  };
  
// import CircleMarkup from "./CircleMarkup"
// export const COLORS = {
//     RED: [211, 47, 47],
//     GREEN: [71, 160, 69]
// }

// export const UNSELECTED_OPACITY = 0.4

// class CircleMarkup extends window.Communicator.Markup.MarkupItem {
//     _viewer
//     _position
//     _circle = new window.Communicator.Markup.Shape.Circle();
//     _circleElement

//     constructor(viewer, position, radius, color, opacity = 1) {
//         super();
//         this._viewer = viewer;
//         this._position = position;

//         this._circle.setRadius(radius);
//         this._circle.setFillColor(color);
//         this._circle.setStrokeColor(color)
//         this._circle.setFillOpacity(opacity)
//     }

//     draw() {
//         if (this._circle) {
//             console.log('in side drow function :----->',this._circle)
//             const center = this._viewer.view.projectPoint(this._position);
//             this._circle.setCenter(window.Communicator.Point2.fromPoint3(center));
//             this._circleElement = this._viewer.markupManager.getRenderer().drawCircle(this._circle);
//         }
//     }

    
//     // hit(relativePointInsideRootSvg/*: Point2*/) {
//     //     if(!this._circleElement){
//     //         return false;
//     //     }
//     //     const renderer = this._viewer.markupManager.getRenderer();
//     //     //const measurement = renderer.measureCircle(this._circleElement);

//     //     //getBBox is a SVG Element's native method as equivalent to find the offset/clientwidth of HTML DOM element
//     //     //in this case the parent is the root <SVG> element
//     //     const viewerSvgBox = this._circleElement.ownerSVGElement.getBBox();

//     //     const parentOffset = {
//     //         top: viewerSvgBox.y,
//     //         left: viewerSvgBox.x,
//     //     }


//     //     let pt = this._circleElement.ownerSVGElement.createSVGPoint();
//     //     pt.x = relativePointInsideRootSvg.x + viewerSvgBox.x;
//     //     pt.y = relativePointInsideRootSvg.y + viewerSvgBox.y;
//     //     //position point absolute to the viewport
//     //     pt = pt.matrixTransform(this._circleElement.getScreenCTM());

//     //     const point = relativePointInsideRootSvg

//     //     //position relative to the viewport .
//     //     const box = this._circleElement.getBoundingClientRect()//this._circleElement.getPosition();
//     //     const circleSvgBox = this._circleElement.getBBox();

//     //     //console.log("CircleMarkup hit", {point, box})

//     //     let hit = true;

//     //     if(point.x < parseInt(circleSvgBox.x)) { hit = false}
//     //     if(point.x > parseInt(circleSvgBox.x + circleSvgBox.width)) { hit = false }

//     //     if(point.y > parseInt(circleSvgBox.y + circleSvgBox.height)) { hit = false }
//     //     if(point.y < parseInt(circleSvgBox.y)) { hit = false}


//     //     if(this._isHit && !hit){
//     //         this._context && this._context.onMouseLeave && this._context.onMouseLeave({markup: this})
//     //     }
//     //     this._isHit = hit
//     //     this._circleElement.setAttribute("isHit",hit)
//     //     //console.log("CircleMarkup hit true", {context:  this._context})

//     //     if(hit){
//     //         this._circleElement.style.stroke = "#000";
//     //     } else {
//     //         this._circleElement.style.stroke = this.rgbToHex(this._options.strokeColor || this._options.color);
//     //     }

//     //     return hit;
//     // }

//     // numberToHex(c) {
//     //     const hex = c.toString(16);
//     //     return hex.length == 1 ? "0" + hex : hex;
//     // }

//     // rgbToHex({r, g, b}) {
//     //     return "#" + this.numberToHex(r) + this.numberToHex(g) + this.numberToHex(b);
//     // }

// }

// class TextMarkup extends window.Communicator.Markup.MarkupItem {
//     _viewer
//     _position
//     _radius
//     _text = new window.Communicator.Markup.Shape.Text();
//     _textElement
//     _textValue;

//     constructor(viewer, position, radius, text, textColor, textSize = 16) {
//         super();
//         this._viewer = viewer;
//         this._position = position;
//         this._radius = radius;
//         this._textSize = textSize;
//         this._textValue = text

//         this._text.setText(text);
//         this._text.setFontSize(textSize);
//         this._text.setFillOpacity(1);
//         this._text.setFillColor(textColor)
//         this._text.setStrokeColor(textColor)
//         this._text.setStrokeWidth(1.4)
//     }

//     draw() {
//         if (this._text) {
//             const center = this._viewer.view.projectPoint(this._position);
//             const textSize = this._viewer.markupManager.getRenderer().measureText(this._text._text, this._text)
//             center.x -= (textSize.x / 2)
//             center.y -= (this._radius - (textSize.y * 0.25))
//             this._text.setPosition(window.Communicator.Point2.fromPoint3(center));
//             this._textElement = this._viewer.markupManager.getRenderer().drawText(this._text);
//         }
//     }
// }

// class CircleMarkupOperator extends window.Communicator.Operator.OperatorBase {
//     _viewer;

//     constructor(viewer) {
//         super(viewer)
//         this._viewer = viewer;
//     }

//     onMouseDown(event/*: Communicator.Event.MouseInputEvent*/) {
//         const markup = this._viewer.markupManager.pickMarkupItem(event.getPosition());
//         if(markup instanceof CircleMarkup){
//             if(markup?._context?.onMouseDown){
//                 markup._context.onMouseDown({markup, event})
//             }
//         }
//     }

//     onMouseMove(event/*: Communicator.Event.MouseInputEvent*/) {
//         const markup = this._viewer.markupManager.pickMarkupItem(event.getPosition());
//         if(markup instanceof CircleMarkup){
//             if(markup?._context?.onMouseMove){
//                 markup._context.onMouseMove({markup, event})
//             }
//         }
//     }

//     onMouseUp(event/*: Communicator.Event.MouseInputEvent*/) {
//         //console.log("CircleMarkup onMouseUp")
//     }

// }

// export const displayDefaultCircleWithText = async (args) => {
//     const {
//         viewerRef,
//         pkgId,
//         text,
//         color
//     } = args

//     return await displayCircleWithText({
//         viewerRef,
//         pkgId,
//         text,
//         circleRadius: "15",
//         circleColor: new window.Communicator.Color(...color),
//         textColor: new window.Communicator.Color(0, 0, 0),
//         textSize: 12,
//         textUnder: "hello test",
//         textUnderColor: new window.Communicator.Color(255, 255, 255),
//         textUnderSize: 0,
//         coordinates: undefined

//     })
// }

// export const getNodeIdFromPkgId = (viewerRef, pkgId) => {
//     return parseInt(viewerRef.props.idMapping[1][pkgId])
// }

// export const displayCircleWithText = async (args) => {
//     let {
//         viewerRef,
//         pkgId,
//         circleRadius,
//         circleColor,
//         text,
//         textColor,
//         textSize,
//         textUnder,
//         textUnderColor,
//         textUnderSize,
//         coordinates
//     } = args
//     // if (!isSceneReady) {
//     //     beforeInitCMD.push(() => displayCircleWithText(args))
//     //     return
//     // }
//     let nodeBoundingNode
//     viewerRef = viewerRef?.current?.iafviewerRef?.current

//     if (pkgId) {
//         let nodeId = getNodeIdFromPkgId(viewerRef, pkgId)
//         nodeBoundingNode = await viewerRef._viewer.model.getNodeRealBounding(nodeId)
//         nodeBoundingNode = nodeBoundingNode.center()
//     }
//     nodeBoundingNode = { ...nodeBoundingNode, ...(coordinates || {}) }

//     let markupIds = []

//     const circleGraphic = new CircleMarkup(
//         viewerRef._viewer,
//         new window.Communicator.Point3(nodeBoundingNode.x, nodeBoundingNode.y, nodeBoundingNode.z + 2000),
//         circleRadius,
//         circleColor
//     )
//     console.log('viewerRef:------>',viewerRef)
//     let circleId = viewerRef._viewer.markupManager.registerMarkup(circleGraphic);
//     markupIds.push(circleId)

//     if (text) {
//         const textGraphic = new TextMarkup(
//             viewerRef._viewer,
//             new window.Communicator.Point3(nodeBoundingNode.x, nodeBoundingNode.y, nodeBoundingNode.z + 2001),
//             circleRadius,
//             text,
//             textColor,
//             textSize
//         )
//         let textId = viewerRef._viewer.markupManager.registerMarkup(textGraphic);
//         markupIds.push(textId)
//     }

//     if (textUnder) {
//         const textUnderGraphic = new TextMarkup(
//             viewerRef._viewer,
//             new window.Communicator.Point3(nodeBoundingNode.x - 1000, nodeBoundingNode.y - 2500, nodeBoundingNode.z + 2001),
//             circleRadius,
//             textUnder,
//             textUnderColor,
//             textUnderSize
//         )
//         let textUnderId = viewerRef._viewer.markupManager.registerMarkup(textUnderGraphic);
//         markupIds.push(textUnderId)
//     }

//     return markupIds
// }

// export const setCuttingPlane = async (viewerRef, zLevel = 0) => {
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     const boundingBox = viewer.getModelBoundingBox()
//     await viewer.iafCuttingPlanesUtils.updateCuttingPlanes(
//         zLevel,
//         boundingBox.min.z,
//         boundingBox.min.x,
//         boundingBox.min.x,
//         boundingBox.min.y,
//         boundingBox.min.y,
//     )
//     await viewer.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false)
//     await viewer.iafCuttingPlanesUtils.enableCuttingPlanes(true)
//     await enableCuttingPlanes(viewerRef, true)
// }

// export const enableCuttingPlanes = async (viewerRef, enable = true) => {
//     viewerRef.current.iafviewerRef.current
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     await viewer.iafCuttingPlanesUtils.enableCuttingPlanes(enable)
// }

// export const cameraOnTop = (viewerRef) => {
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     // const viewer = _.get(viewerRef.current, "current.iafviewerRef.current")
//     // viewer?._viewer?.view?.setCamera(window.Communicator.Camera.fromJson({
//     //     height: 17418.63761403443,
//     //     nearLimit: 0.001,
//     //     position: {x: 3337.5053956288984, y: 8439.42078783748, z: 7842.522147738604},
//     //     projection: 0,
//     //     target: {x: 2837.510732840059, y: 10643.659021385203, z: -631.7620610272497},
//     //     up: {x: -0.21082547571443722, y: 0.9429421106667105, z: 0.2577067999125954},
//     //     width: 25516.916708563193
//     // }))
// }

// export const initialCamera = (viewerRef) => {
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     // const viewer = _.get(viewerRef.current, "current.iafviewerRef.current")
//     // viewer?._viewer?.view?.setCamera(window.Communicator.Camera.fromJson({
//     //     height: 39525.275996049335,
//     //     nearLimit: 0.001,
//     //     position: {x: 6176.723495162213, y: 12269.417177823008, z: 26802.3038547765},
//     //     projection: 0,
//     //     target: {x: 10806.909929300367, y: 29123.852513473226, z: 17285.989355900016},
//     //     up: {x: 0.1275139696535452, y: 0.4608550171722633, z: 0.8782669529763417},
//     //     width: 57901.38114254983
//     // }))
// }

// export const addMarker = ({ viewerRef, markerTrackerRef, coords, asset = {}, color = [71, 160, 69], opacity, strokeWidth, strokeColor }) => {
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     // const viewer = _.get(viewerRef.current, "current.iafviewerRef.current")
//     if (viewer) {
//         const circleGraphic = new CircleMarkup({
//             viewer: viewer._viewer,
//             position: new window.Communicator.Point3(coords.x, coords.y, coords.z),
//             radius: '9',
//             color: new window.Communicator.Color(color[0], color[1], color[2]),
//             opacity,
//             strokeWidth,
//             strokeColor
//         })
//         let circleId = viewer._viewer.markupManager.registerMarkup(circleGraphic)
//         markerTrackerRef.current.push({ id: circleId, ...asset })
//     }
// }

// export const clearMarkers = (viewerRef, markerTrackerRef) => {
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     if (viewer) {
//         for (const marker of markerTrackerRef.current) {
//             viewer._viewer.markupManager.unregisterMarkup(marker)
//         }
//     }
//     markerTrackerRef.current = []
// }

// export const addTooltip = ({ viewerRef, tooltipTrackerRef, coords, color = [71, 160, 69], opacity, strokeWidth, strokeColor }) => {
//     const viewer = _.get(viewerRef.current, "current.iafviewerRef.current")
//     if (viewer) {
//         const circleGraphic = new CircleMarkup({
//             viewer: viewer._viewer,
//             position: new window.Communicator.Point3(coords.x, coords.y, coords.z),
//             radius: '15',
//             color: new window.Communicator.Color(color[0], color[1], color[2]),
//             opacity,
//             strokeWidth,
//             strokeColor
//         })
//         let circleId = viewer._viewer.markupManager.registerMarkup(circleGraphic);
//         tooltipTrackerRef.current.push({ id: circleId })
//     }
// }


//////////////////new code//////////////


// export const COLORS = {
//     RED: [211, 47, 47],
//     GREEN: [71, 160, 69]
// }

// export const UNSELECTED_OPACITY = 0.4

// class CircleMarkup extends window.Communicator.Markup.MarkupItem {
//     _viewer
//     _position
//     _circle = new window.Communicator.Markup.Shape.Circle();
//     _circleElement

//     constructor(viewer, position, radius, color,context, opacity = 1, ) {
//         super();
//         this._viewer = viewer;
//         this._position = position;
//         this._options = {color}
//         this._context = context

//         this._circle.setRadius(radius);
//         this._circle.setFillColor(color);
//         this._circle.setStrokeColor(color)
//         this._circle.setFillOpacity(opacity)
//     }

//     draw() {
//         if (this._circle) {
//             console.log('in side drow function :----->',this._circle)
//             const center = this._viewer.view.projectPoint(this._position);
//             this._circle.setCenter(window.Communicator.Point2.fromPoint3(center));
//             this._circleElement = this._viewer.markupManager.getRenderer().drawCircle(this._circle);
//         }
//     }

    
//     hit(relativePointInsideRootSvg/*: Point2*/) {
//         if(!this._circleElement){
//             return false;
//         }
//         const renderer = this._viewer.markupManager.getRenderer();
//         //const measurement = renderer.measureCircle(this._circleElement);

//         //getBBox is a SVG Element's native method as equivalent to find the offset/clientwidth of HTML DOM element
//         //in this case the parent is the root <SVG> element
//         const viewerSvgBox = this._circleElement.ownerSVGElement.getBBox();

//         const parentOffset = {
//             top: viewerSvgBox.y,
//             left: viewerSvgBox.x,
//         }


//         let pt = this._circleElement.ownerSVGElement.createSVGPoint();
//         pt.x = relativePointInsideRootSvg.x + viewerSvgBox.x;
//         pt.y = relativePointInsideRootSvg.y + viewerSvgBox.y;
//         //position point absolute to the viewport
//         pt = pt.matrixTransform(this._circleElement.getScreenCTM());

//         const point = relativePointInsideRootSvg

//         //position relative to the viewport .
//         const box = this._circleElement.getBoundingClientRect()//this._circleElement.getPosition();
//         const circleSvgBox = this._circleElement.getBBox();

//         //console.log("CircleMarkup hit", {point, box})

//         let hit = true;

//         if(point.x < parseInt(circleSvgBox.x)) { hit = false}
//         if(point.x > parseInt(circleSvgBox.x + circleSvgBox.width)) { hit = false }

//         if(point.y > parseInt(circleSvgBox.y + circleSvgBox.height)) { hit = false }
//         if(point.y < parseInt(circleSvgBox.y)) { hit = false}


//         if(this._isHit && !hit){
//             this._context && this._context.onMouseLeave && this._context.onMouseLeave({markup: this})
//         }
//         this._isHit = hit
//         this._circleElement.setAttribute("isHit",hit)
//         //console.log("CircleMarkup hit true", {context:  this._context})

//         if(hit){
//             this._circleElement.style.stroke = "#000";
//         } else {
//             this._circleElement.style.stroke = this.rgbToHex(this._options.strokeColor || this._options.color);
//         }

//         return hit;
//     }

//     numberToHex(c) {
//         const hex = c.toString(16);
//         return hex.length == 1 ? "0" + hex : hex;
//     }

//     rgbToHex({r, g, b}) {
//         return "#" + this.numberToHex(r) + this.numberToHex(g) + this.numberToHex(b);
//     }

// }

// class TextMarkup extends window.Communicator.Markup.MarkupItem {
//     _viewer
//     _position
//     _radius
//     _text = new window.Communicator.Markup.Shape.Text();
//     _textElement
//     _textValue;

//     constructor(viewer, position, radius, text, textColor, textSize = 16) {
//         super();
//         this._viewer = viewer;
//         this._position = position;
//         this._radius = radius;
//         this._textSize = textSize;
//         this._textValue = text

//         this._text.setText(text);
//         this._text.setFontSize(textSize);
//         this._text.setFillOpacity(1);
//         this._text.setFillColor(textColor)
//         this._text.setStrokeColor(textColor)
//         this._text.setStrokeWidth(1.4)
//     }

//     draw() {
//         if (this._text) {
//             const center = this._viewer.view.projectPoint(this._position);
//             // console.log('center before --->',center)
//             const textSize = this._viewer.markupManager.getRenderer().measureText(this._text._text, this._text)
//             // console.log('textSize  --->',textSize)
//             center.x -= (textSize.x / 2)
//             center.y -= (this._radius - (textSize.y * 0.25))
//             this._text.setPosition(window.Communicator.Point2.fromPoint3(center));
//             // console.log('textElement before --->')
//             this._textElement = this._viewer.markupManager.getRenderer().drawText(this._text);
//             // console.log('this._textElement:--->',this._textElement)
//         }
//     }
// }

// class CircleMarkupOperator extends window.Communicator.Operator.OperatorBase {
//     _viewer;

//     constructor(viewer) {
//         super(viewer)
//         this._viewer = viewer;
//     }

//     onMouseDown(event/*: Communicator.Event.MouseInputEvent*/) {
//         const markup = this._viewer.markupManager.pickMarkupItem(event.getPosition());
//         if(markup instanceof CircleMarkup){
//             if(markup?._context?.onMouseDown){
//                 markup._context.onMouseDown({markup, event})
//             }
//         }
//     }

//     onMouseMove(event/*: Communicator.Event.MouseInputEvent*/) {
//         const markup = this._viewer.markupManager.pickMarkupItem(event.getPosition());
//         if(markup instanceof CircleMarkup){
//             if(markup?._context?.onMouseMove){
//                 markup._context.onMouseMove({markup, event})
//             }
//         }
//     }

//     onMouseUp(event/*: Communicator.Event.MouseInputEvent*/) {
//         //console.log("CircleMarkup onMouseUp")
//     }

// }

// export const markupOperator = CircleMarkupOperator;
// export const displayDefaultCircleWithText = async (args) => {
//     const {
//         viewerRef,
//         pkgId,
//         text,
//         color,
//         index = 0,
//         circleCoordinates,
//         circleRadius,
//         circleColor,
//         circleStrokeColor,
//         circleStrokeWidth,
//         textColor,
//         textSize,
//         textUnder,
//         textUnderColor,
//         textUnderSize,
//         coordinates,
//         context
//     } = args

//     return await displayCircleWithText({
//         viewerRef,
//         pkgId,
//         text,
//         circleRadius: "15",
//         circleColor: new window.Communicator.Color(...color),
//         textColor: new window.Communicator.Color(0, 0, 0),
//         textSize: 12,
//         textUnder: "hello test",
//         textUnderColor: new window.Communicator.Color(255, 255, 255),
//         textUnderSize: 0,
//         coordinates: undefined,
//         context

//     })
// }

export const getNodeIdFromPkgId = (viewerRef, pkgId) => {
    viewerRef = viewerRef?.current?.iafviewerRef?.current
    return parseInt(viewerRef.props.idMapping[1][pkgId])
}

// export const displayCircleWithText = async (args) => {
//     let {
//         viewerRef,
//         pkgId,
//         circleRadius,
//         circleColor,
//         text,
//         textColor,
//         textSize,
//         textUnder,
//         textUnderColor,
//         textUnderSize,
//         coordinates,
//         context
//     } = args
//     // if (!isSceneReady) {
//     //     beforeInitCMD.push(() => displayCircleWithText(args))
//     //     return
//     // }
//     let nodeBoundingNode
//     viewerRef = viewerRef?.current?.iafviewerRef?.current

//     if (pkgId) {
//         let nodeId = getNodeIdFromPkgId(viewerRef, pkgId)
//         nodeBoundingNode = await viewerRef._viewer.model.getNodeRealBounding(nodeId)
//         nodeBoundingNode = nodeBoundingNode.center()
//     }
//     nodeBoundingNode = { ...nodeBoundingNode, ...(coordinates || {}) }

//     let markupIds = []

//     const circleGraphic = new CircleMarkup(
//         viewerRef._viewer,
//         new window.Communicator.Point3(nodeBoundingNode.x, nodeBoundingNode.y, nodeBoundingNode.z + 2000),
//         circleRadius,
//         circleColor,
//         context
//     )
//     console.log('viewerRef:------>',viewerRef)
//     let circleId = viewerRef._viewer.markupManager.registerMarkup(circleGraphic);
//     markupIds.push(circleId)

//     if (text) {
//         const textGraphic = new TextMarkup(
//             viewerRef._viewer,
//             new window.Communicator.Point3(nodeBoundingNode.x, nodeBoundingNode.y, nodeBoundingNode.z + 2001),
//             circleRadius,
//             text,
//             textColor,
//             textSize
//         )
//         let textId = viewerRef._viewer.markupManager.registerMarkup(textGraphic);
//         markupIds.push(textId)


//     }

//     if (textUnder) {
//         const textUnderGraphic = new TextMarkup(
//             viewerRef._viewer,
//             new window.Communicator.Point3(nodeBoundingNode.x - 1000, nodeBoundingNode.y - 2500, nodeBoundingNode.z + 2001),
//             circleRadius,
//             textUnder,
//             textUnderColor,
//             textUnderSize
//         )
//         let textUnderId = viewerRef._viewer.markupManager.registerMarkup(textUnderGraphic);
//         markupIds.push(textUnderId)
//     }

//     return markupIds
// }

export const setCuttingPlane = async (viewerRef, zLevel = 0) => {
    console.log('zLevel value :----------------->',zLevel)
    let viewer = viewerRef?.current?.iafviewerRef?.current
    const boundingBox = viewer.getModelBoundingBox()
    await viewer.iafCuttingPlanesUtils.updateCuttingPlanes(
        zLevel,
        boundingBox.min.z,
        boundingBox.min.x,
        boundingBox.min.x,
        boundingBox.min.y,
        boundingBox.min.y,
    )
    await viewer.iafCuttingPlanesUtils.showCuttingPlaneGeometry(false)
    await viewer.iafCuttingPlanesUtils.enableCuttingPlanes(true)
    await enableCuttingPlanes(viewerRef, true)
}

export const enableCuttingPlanes = async (viewerRef, enable = true) => {
    viewerRef.current.iafviewerRef.current
    let viewer = viewerRef?.current?.iafviewerRef?.current
    await viewer.iafCuttingPlanesUtils.enableCuttingPlanes(enable)
}


export const cameraOnTop = async (viewerRef, nodeIds) => {
    console.log('parms nodeIds :----->',nodeIds)
    const viewer = viewerRef?.current?.iafviewerRef?.current._viewer;
    // const viewer = viewerRef?.current?.iafviewerRef?.current;
  
    if (!viewer || !nodeIds.length) {
      console.warn("Viewer or nodeIds are not available.");
      return;
    }
    let nodeId = getNodeIdFromPkgId(viewerRef, nodeIds)
    console.log('Node id from package id :---->>',nodeId)
    try {
    //   This will zoom/focus the view on the provided node(s)
    await viewer.view.fitNodes([nodeId], {
        // Optional: animation duration (ms)
        animation: true,
        durationMs: 200,
      });

    } catch (error) {
      console.error("Error focusing on specified nodes:", error);
    }
  };

  

// export const cameraOnTop = (viewerRef) => {
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     // const viewer = _.get(viewerRef.current, "current.iafviewerRef.current")
//     viewer?._viewer?.view?.setCamera(window.Communicator.Camera.fromJson({
//         height: 17418.63761403443,
//         nearLimit: 0.001,
//         position: {x: 3337.5053956288984, y: 8439.42078783748, z: 7842.522147738604},
//         projection: 0,
//         target: {x: 2837.510732840059, y: 10643.659021385203, z: -631.7620610272497},
//         up: {x: -0.21082547571443722, y: 0.9429421106667105, z: 0.2577067999125954},
//         width: 25516.916708563193
//     }))
// }

// export const initialCamera = (viewerRef) => {
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     // const viewer = _.get(viewerRef.current, "current.iafviewerRef.current")
//     // viewer?._viewer?.view?.setCamera(window.Communicator.Camera.fromJson({
//     //     height: 39525.275996049335,
//     //     nearLimit: 0.001,
//     //     position: {x: 6176.723495162213, y: 12269.417177823008, z: 26802.3038547765},
//     //     projection: 0,
//     //     target: {x: 10806.909929300367, y: 29123.852513473226, z: 17285.989355900016},
//     //     up: {x: 0.1275139696535452, y: 0.4608550171722633, z: 0.8782669529763417},
//     //     width: 57901.38114254983
//     // }))
// }

// export const addMarker = ({ viewerRef, markerTrackerRef, coords, asset = {}, color = [71, 160, 69], opacity, strokeWidth, strokeColor }) => {
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     // const viewer = _.get(viewerRef.current, "current.iafviewerRef.current")
//     if (viewer) {
//         const circleGraphic = new CircleMarkup({
//             viewer: viewer._viewer,
//             position: new window.Communicator.Point3(coords.x, coords.y, coords.z),
//             radius: '9',
//             color: new window.Communicator.Color(color[0], color[1], color[2]),
//             opacity,
//             strokeWidth,
//             strokeColor
//         })
//         let circleId = viewer._viewer.markupManager.registerMarkup(circleGraphic)
//         markerTrackerRef.current.push({ id: circleId, ...asset })
//     }
// }

// export const clearMarkers = (viewerRef, markerTrackerRef) => {
//     let viewer = viewerRef?.current?.iafviewerRef?.current
//     if (viewer) {
//         for (const marker of markerTrackerRef.current) {
//             viewer._viewer.markupManager.unregisterMarkup(marker)
//         }
//     }
//     markerTrackerRef.current = []
// }

// export const addTooltip = ({ viewerRef, tooltipTrackerRef, coords, color = [71, 160, 69], opacity, strokeWidth, strokeColor }) => {
//     const viewer = _.get(viewerRef.current, "current.iafviewerRef.current")
//     if (viewer) {
//         const circleGraphic = new CircleMarkup({
//             viewer: viewer._viewer,
//             position: new window.Communicator.Point3(coords.x, coords.y, coords.z),
//             radius: '15',
//             color: new window.Communicator.Color(color[0], color[1], color[2]),
//             opacity,
//             strokeWidth,
//             strokeColor
//         })
//         let circleId = viewer._viewer.markupManager.registerMarkup(circleGraphic);
//         tooltipTrackerRef.current.push({ id: circleId })
//     }
// }

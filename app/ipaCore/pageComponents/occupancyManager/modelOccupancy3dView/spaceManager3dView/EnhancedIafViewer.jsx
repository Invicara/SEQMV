import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';

import { IafViewerDBM } from "@dtplatform/iaf-viewer";
import { listIncludes, usePrevious } from "@invicara/ipa-core/modules/IpaUtils";

const RefObserver = ({ refValue, cb, model, refCb }) => {

    const [modelHasLoaded, setModelHasLoaded] = useState(false);
    const previousdModel = usePrevious(model);
    // const dispatch = useDispatch();

    const intervalRef = useRef();

    useEffect(() => {
        if (!modelHasLoaded) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(cb, 400);
        }

        if (refValue?.iafviewerRef?.current?._viewer?.model) {
            refCb(refValue)
            // storeRef(refValue, refValue?.iafviewerRef?.current?._viewer?.model);
            Object.defineProperty(refValue?.iafviewerRef?.current, 'glassModeFromToolbar', {
                get: function () {
                    return this.value
                },
                set: function (val) {
                    this.value = val;
                    //   dispatch(setGanttDrawMode(val ? {mode: 'glass'} : {}))
                }
            });

            setModelHasLoaded(true);
            clearInterval(intervalRef.current);
        }

        if (model !== previousdModel) {
            setModelHasLoaded(false);
        }

    }, [refValue, refValue?.iafviewerRef?.current?._viewer?.model, modelHasLoaded, model, previousdModel])

    return <></>

}

export const extractSpacesFromEntities = (entities) => {
    let isolatedSpaces = []
    let isolatedRemainingEntities = []

    entities.forEach(entity => {
        if (entity.hasOwnProperty(['Space Name'])) {
            isolatedSpaces.push(entity)
        } else {
            isolatedRemainingEntities.push(entity)
        }
    })

    return { isolatedSpaces, isolatedRemainingEntities }
}

class ViewerWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previouslyClickedModelIds: [],
            count: 0
        };
        this.iafViewerDBMRef = React.createRef();
        this.props.onCreateViewerRef(this.iafViewerDBMRef)
    }

    highlightedElementIds = _.memoize((_selectedEntities) => (_selectedEntities || []).map(e => e.modelViewerIds[0]));
    extractSpacesFromEntitiesMemo = _.memoize((_isolatedEntities) => (extractSpacesFromEntities || [])(_isolatedEntities));
    isolatedElementIds = _.memoize((_isolatedRemainingEntities) => (_isolatedRemainingEntities || []).map(e => e.modelViewerIds[0]).filter(e => e !== undefined));
    sliceElementIds = _.memoize((_isolatedRemainingEntities) => (_isolatedRemainingEntities || []).map(e => e.modelViewerIds[0]).filter(e => e !== undefined));
    spaceElementIds = _.memoize((_isolatedSpaces) => (_isolatedSpaces || []).map(e => e.modelViewerIds[0]).filter(e => e !== undefined));
    

    resetGlassMode = async () => {
        let commands = _.get(this.iafViewerDBMRef, "current.iafviewerRef.current.commands");
        if (commands && commands.setDrawMode) {
            //reset glass mode
            await commands.setDrawMode(false /*glassMode*/, false /*glassModeFromToolbar*/, undefined /*newDrawMode*/);
        }
        if (commands && commands.resetAll) {
            //reset glass mode
            //await commands.resetAll(); not desired
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('in side viwers :----->',this.props.isolatedEntities)
        console.log('in prevProps.isolatedEntities :----->',prevProps.isolatedEntities)
        // if (this.props.isolatedEntities !== prevProps.isolatedEntities && _.isEmpty(this.props.isolatedEntities)) {
        //     console.log('in side reset data :-->')
        //     this.resetGlassMode();
        // }
        this.resetGlassMode();
        /* leaving it here, might be useful for debugging later on
        Object.keys(prevProps)
            .filter(key => {
                return prevProps[key] !== this.props[key];
            }).map(key => {
                console.log('changed property:',key,'from',this.props[key],'to',prevProps[key]);
            });
         */
    }

    getModelEntities = async () => {
        let commands = _.get(this.iafViewerDBMRef, "current.iafviewerRef.current.commands");
        if (commands && commands.getSelectedEntities) {
            let pkgIds = await commands.getSelectedEntities();
            if (pkgIds && pkgIds.length > 0) {
                let result = [];
                for (const pkgId of pkgIds) {
                    if (isNaN(pkgId)) {
                        result.push({ id: pkgId })
                    } else {
                        result.push({ id: parseInt(pkgId) })
                    }
                }
                return result;
            } else {
                return [];
            }
        }
    };


    selectEntities = async () => {
        console.log('in side select Entity :------>')
        const modelSelectedEntities = await this.getModelEntities();
        const modelSelectedEntitiesIds = !modelSelectedEntities ? [] : modelSelectedEntities.map(({ id }) => id);

        if (modelSelectedEntities && modelSelectedEntities.length > 0) {
            //sync UI => take the model as single source of truth, and sync UI
            const highlightedElementIdsOutOfSync = !listIncludes(
                _.sortBy(this.highlightedElementIds(this.props.selectedEntities)),
                _.sortBy(modelSelectedEntitiesIds)
            );
            const previouslyClickedModelIdsOutOfSync = !listIncludes(
                _.sortBy(this.state.previouslyClickedModelIds),
                _.sortBy(modelSelectedEntitiesIds)
            );
            if (previouslyClickedModelIdsOutOfSync || highlightedElementIdsOutOfSync) {
                this.props.onSelect(modelSelectedEntities);
                this.setState({ previouslyClickedModelIds: modelSelectedEntitiesIds })
            }
        } else {
            //clear UI => if we are in assets view
            const { isolatedRemainingEntities } = this.extractSpacesFromEntitiesMemo(this.props.isolatedEntities);
            if (this.sliceElementIds(isolatedRemainingEntities).length > 0 && this.state.previouslyClickedModelIds && this.state.previouslyClickedModelIds.length > 0) {
                this.props.onSelect(modelSelectedEntities);
                this.setState({ previouslyClickedModelIds: modelSelectedEntitiesIds })
            }
        }
    }

    getCuttingPlane = async () => {
        let commands = _.get(this.iafViewerDBMRef, "current.iafviewerRef.current.commands");
        console.log("CuttingPlanes:", commands.getCuttingPlanes())
    }

    render() {


        const { isolatedSpaces, isolatedRemainingEntities } = this.extractSpacesFromEntitiesMemo(this.props.isolatedEntities);


        //remove keepalive container details from passed props to avoid re-render
        const props = { ...this.props, _container: undefined }

        return (<div onClick={this.selectEntities}>
            <RefObserver model={this.props.model} refValue={this.iafViewerDBMRef.current} count={this.state.count} refCb={this.props.onCreateViewerRef} cb={() => this.setState({ count: this.state.count + 1 })} />
            <IafViewerDBM ref={this.iafViewerDBMRef} {...props}
                enableFocusMode={false}
                isShowNavCube={false}
                sliceElementIds={this.sliceElementIds(this.props.isolatedEntities)}
                highlightedElementIds={this.highlightedElementIds(this.props.selectedEntities)}
                isolatedElementIds={this.isolatedElementIds(isolatedRemainingEntities)}
                spaceElementIds={this.spaceElementIds(isolatedSpaces)}
                selection={this.highlightedElementIds(this.props.selectedEntities)}
            />
        </div>
        );
    }
}

//TODO Remove repetition with SystemsViewer, try to make KeepAplive's 'name' work or else at least extract shared logic to a HOC
export const EnhancedIafViewer = ({
    model,
    isolatedEntities,
    selectedEntities,
    viewerResizeCanvas,
    onSelect,
    hiddenElementIds,
    colorGroups,
    coloredElementIds,
    selectedLevel,
    markerTrackerRef,
    onCreateViewerRef,
    enable2DViewer,
    florEntites,
    gis
}) => {

    const saveSettingsCallback = useCallback((settings) => { localStorage.iafviewer_settings = JSON.stringify(settings) }, []);
    const emptyArray = useMemo(() => [], []);
    const viewerSettings = useMemo(() => localStorage.iafviewer_settings ? JSON.parse(localStorage.iafviewer_settings) : undefined, [localStorage.iafviewer_settings]);

 console.log("colorGroups in side view :--------->",colorGroups)
    return (
        <ViewerWrapper
            model={model}
            serverUri={endPointConfig.graphicsServiceOrigin}
            hiddenElementIds={hiddenElementIds}//TODO
            viewerResizeCanvas={viewerResizeCanvas}
            settings={viewerSettings}
            saveSettings={saveSettingsCallback}
            colorGroups={colorGroups}
            onSelect={onSelect}
            isolatedEntities={isolatedEntities}
            selectedEntities={selectedEntities || []} //trying to avoid re-render here
            selectedLevel={selectedLevel}
            markerTrackerRef={markerTrackerRef}
            onCreateViewerRef={onCreateViewerRef}
            enable2DViewer={enable2DViewer}
            gis={gis}
        />
    );
};
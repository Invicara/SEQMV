import React from 'react'
import InfoInteractiveClosableCard from "./InfoInteractiveClosableCard";
// import {calculateRange} from "../common/calculations";
import MetricInfoType2 from "./MetricInfoType2";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './HoverInfo.scss'
// import {darkTheme} from "../../../../styles/materialDesign/darkTheme";
import {defaultTheme} from "./defaultTheme";
import { darkTheme } from './darkTheme';

const formatRawVal = (val, places) => {
    return typeof val === 'number' && isFinite(val) ? val.toFixed(places) : val;
}

export default function HoverInfo({markup, spaceData, prefersDarkMode}) {

    const positionStyle = markup
        ? {
            position: 'fixed',
            left: (markup.screenPosition.x || 0) + 250,
            top: (markup.screenPosition.y || 0) + 150
        }
        : {}
         
    const hoverSpace = spaceData.find(item =>
        item?.entity?.modelViewerIds?.includes(markup.modelId)
    );

    const theme = React.useMemo(
        () =>
            createTheme(prefersDarkMode ? darkTheme : defaultTheme),
        [prefersDarkMode],
    );


    return (
        <div style={{ position: 'fixed', ...positionStyle }} >
            <div style={{ position: 'fixed' }} className="observability-markup-anchor"></div>
            <div className="observability-markup-tooltip">
                {hoverSpace?.entity['Space Name']}
            </div>
        </div>
    )
}
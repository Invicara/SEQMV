import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

/**
 * BarChartComponent - A reusable bar chart component using @nivo/bar.
 *
 * @param {Array} data - The data to be displayed in the bar chart.
 * @param {string} height - The height of the chart.
 * @param {Object} config - Additional configuration for the bar chart (optional).
 */
const BarChart = ({ data, height = '400px', config = {} }) => {
    // Default configuration
    const defaultConfig = {
        margin: { top: 50, right: 130, bottom: 50, left: 60 },
        padding: 0.3,
        layout: 'vertical',
        colors: { scheme: 'nivo' },
        borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
        axisBottom: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Category',
            legendPosition: 'middle',
            legendOffset: 32,
        },
        axisLeft: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Value',
            legendPosition: 'middle',
            legendOffset: -40,
        },
        labelSkipWidth: 12,
        labelSkipHeight: 12,
        labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
        animate: true,
        motionStiffness: 90,
        motionDamping: 15,
    };

    // Merge defaultConfig with the config passed via props
    const mergedConfig = { ...defaultConfig, ...config };

    return (
        <div className='pie-chart-custom'>
            <h2>{mergedConfig.title || 'Bar Chart'}</h2>
            <ResponsiveBar
                data={data}
                keys={['value']}
                {...mergedConfig}
            />
        </div>
    );
};

export default BarChart;

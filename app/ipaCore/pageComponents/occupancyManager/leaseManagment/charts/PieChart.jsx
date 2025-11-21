import React, { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';

/**
 * PieChart - A reusable pie chart component built with @nivo/pie.
 *
 * @param {Array} data - The data to be displayed in the pie chart. Each object must contain `id`, `label`, and `value` properties.
 * @param {string} height - The height of the chart.
 * @param {Object} config - Additional configuration for the pie chart (optional).
 */
const PieChart = ({
  data,
  height = '400px',
  config = {}, // Pass config as prop
}) => {
  // Default configuration
  const defaultConfig = {
    colors: { datum: 'data.color' },
    margin: { top: 20, right: 40, bottom: 40, left: 40 },
    innerRadius: 0.5,
    arcLinkLabelsSkipAngle: 10,
    arcLinkLabelsThickness: 2,
    arcLabelsSkipAngle: 10,
    enableArcLabels: false,
    enableArcLinkLabels: false,
  };

  // Merge defaultConfig with the config passed via props
  const mergedConfig = { ...defaultConfig, ...config };

  return (
    <>
      <div className="chart-container">
        <ResponsivePie
          data={data}
          {...mergedConfig}
        />
      </div>
      <div className="legend-list">
        {data.map((item, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: item.color }}></span>
            {item.id}: {item.value}%
          </div>
        ))}
      </div>
    </>

  );


  PieChart
};

export default PieChart;

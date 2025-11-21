import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

// Default configuration for the bar chart
const defaultConfig = {
  keys: ['space'],
  indexBy: 'company',
  margin: { top: 20, right: 30, bottom: 60, left: 70 },
  padding: 0.3,
  enableGridY:false,
  colors: () => '#48A045',
  axisBottom: {
    tickRotation: -15,
    tickPadding: 5,
    tickSize: 0,
    truncateTickAt: 19
  },
  axisLeft: {
    format: value => `${value.toLocaleString()} m²`,
    tickSize: 0,
    tickPadding: 10,
  },
  enableLabel: false,
};

const TopOccupantsBarChart = ({ data = [], customConfig = {} }) => {
  const mergedConfig = {
    ...defaultConfig,
    ...customConfig,
    axisBottom: {
      ...defaultConfig.axisBottom,
      ...customConfig.axisBottom,
    },
    axisLeft: {
      ...defaultConfig.axisLeft,
      ...customConfig.axisLeft,
    },
    margin: {
      ...defaultConfig.margin,
      ...customConfig.margin,
    },
  };

  return <ResponsiveBar data={data} {...mergedConfig} />;
};

export default TopOccupantsBarChart;

import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const defaultConfig = {
  colors: { datum: 'data.color' },
  margin: { top: 20, right: 40, bottom: 40, left: 40 },
  innerRadius: 0.7,
  startAngle: -90,
  endAngle: 90,
  enableArcLabels:false,
  enableArcLinkLabels:false,
  legends: [],
};

const LeasesExpiringChart = ({ data, config = {} }) => {
  const chartConfig = { ...defaultConfig, ...config };

  return (
    <div style={{ height: '250px', width: '100%' }}>
      <ResponsivePie data={data} {...chartConfig} />
    </div>
  );
};

export default LeasesExpiringChart;

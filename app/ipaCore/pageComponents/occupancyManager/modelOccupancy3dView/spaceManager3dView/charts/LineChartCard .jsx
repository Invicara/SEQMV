import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const LineChartCard = ({ title, data, color, unit, comparisonText }) => (
  <div className="lease-chart-box">
    <h4>{title}</h4>
    <div className="chart-summary">
      <p>
        {data[0].data.reduce((acc, cur) => acc + cur.y, 0).toLocaleString()} {unit}
        <span style={{ color }}>{comparisonText}</span>
      </p>
    </div>
    <div style={{ height: '200px' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0 }}
        colors={[color]}
        axisBottom={{ 
          tickRotation: 0,
          tickSize: 0}}
        axisLeft={{
          legend: '',
          legendOffset: -40,
          format: value => `${value.toLocaleString()} ${unit}`,
        }}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        useMesh={true}
        areaOpacity={0.1}
        areaBaselineValue={0}
        enableArea={true}
       
      />
    </div>
    {/* <div className="chart-summary">
      <p>
        {data[0].data.reduce((acc, cur) => acc + cur.y, 0).toLocaleString()} {unit}
        <span style={{ color }}>{comparisonText}</span>
      </p>
    </div> */}
  </div>
);

export default LineChartCard;

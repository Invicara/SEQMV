import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const StatusBarChart = ({ data }) => {
  return (
    <div style={{ height: '300px' }}>
      <ResponsiveBar
        data={data}
        keys={['Available', 'Assigned']}
        indexBy="label"
        margin={{ top: 30, right: 20, bottom: 40, left: 40 }}
        padding={0.4}
        layout="vertical"
        colors={({ id }) => (id === 'Available' ? '#228B22' : '#D32F2F')}
        axisBottom={null}
        axisLeft={{
          tickPadding: 5,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#fff"
        enableGridX={false}
        enableGridY={true}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateY: 30,
            itemWidth: 80,
            itemHeight: 20,
            itemsSpacing: 10,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
      />
    </div>
  );
};

export default StatusBarChart;

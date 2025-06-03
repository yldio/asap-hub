import { ReactElement } from 'react';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

type TreemapContentProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  title: string;
  percentage: number;
};

const PADDING = 4;
const Content = (props: TreemapContentProps) => {
  const { x, y, width, height, index, title, percentage } = props;
  const color = COLORS[index % COLORS.length];

  const padding = PADDING;
  const rectX = x + padding / 2;
  const rectY = y + padding / 2;
  const rectWidth = Math.max(0, width - padding);
  const rectHeight = Math.max(0, height - padding);

  const maxCharsPerLine = Math.floor(width / 8);
  const words = title?.split(' ');
  const lines = [];
  let currentLine = '';

  (words || []).forEach((word) => {
    if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }

  return (
    <g>
      <rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        style={{
          fill: color,
          stroke: '#fff',
          strokeWidth: PADDING,
        }}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={rectX + 6 + PADDING}
          y={rectY + 30}
          fontSize={14}
          fontWeight={600}
          fontFamily="Roboto"
          fill="#FFF"
          style={{ stroke: 'none' }}
          pointerEvents="none"
        >
          {line}
        </text>
      ))}
      <text
        x={rectX + 6 + PADDING}
        y={rectY + 50}
        fontSize={12}
        fontWeight={400}
        fill="#FFF"
        style={{ stroke: 'none' }}
        pointerEvents="none"
      >
        {percentage}%
      </text>
    </g>
  );
};

const data = [
  { title: 'Elucidating Known PD Pathways', percentage: 34.88 },
  { title: 'New Method to Explore PD Mechanism', percentage: 28.11 },
  {
    title: 'New Mechanism Linked to Previously Etablished PD Pathway',
    percentage: 17.32,
  },
  {
    title: 'Other Research Areas',
    percentage: 19.69,
  },
];

const TreemapComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={data}
        dataKey="percentage"
        nameKey="title"
        stroke="#fff"
        isAnimationActive={false}
        content={Content as unknown as ReactElement}
      >
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            color: '#000',
            padding: 4,
            border: 'none',
            boxShadow: 'none',
            fontSize: 14,
            fontWeight: 400,
            fontFamily: 'Roboto',
            textAlign: 'center',
            borderRadius: 4,
          }}
          formatter={(value, name) => `${name}: ${value}%`}
          cursor={{ stroke: '#fff', strokeWidth: 2 }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default TreemapComponent;

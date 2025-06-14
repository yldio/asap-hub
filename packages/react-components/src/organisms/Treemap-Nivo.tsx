import { ResponsiveTreeMap } from '@nivo/treemap';

const data = {
  name: 'root',
  children: [
    { name: 'Elucidating Known PD Pathways', value: 34.88 },
    { name: 'New Method to Explore PD Mechanism', value: 28.11 },
    {
      name: 'New Mechanism Linked to Previously Etablished PD Pathway',
      value: 17.32,
    },
    { name: 'Other Research Areas', value: 19.69 },
  ],
};

// const CustomNode = ({ node }: any) => {
//   const padding = 10;
//   const maxWidth = node.width - padding * 2;
//   const maxHeight = node.height - padding * 2;

//   return (
//     <g transform={`translate(${node.x},${node.y})`}>
//       <rect
//         width={node.width}
//         height={node.height}
//         fill={node.color}
//         stroke={node.borderColor}
//         strokeWidth={0}
//       />
//       <foreignObject
//         x={padding}
//         y={padding}
//         width={maxWidth}
//         height={maxHeight}
//       >
//         <div
//           style={{
//             backgroundColor: node.color,
//             padding: '10px',
//             borderRadius: '10px',
//             fontFamily: 'Inter, sans-serif',
//             fontSize: '18px',
//             fontWeight: 600,
//             color: '#fff',
//             width: '100%',
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'flex-start',
//             alignItems: 'flex-start',
//           }}
//         >
//           <p style={{ margin: 0 }}>{node.id}</p>
//           <p style={{ fontSize: '16px', fontWeight: 400, margin: 0 }}>
//             {node.value.toFixed(2)}%
//           </p>
//         </div>
//       </foreignObject>
//     </g>
//   );
// };

const PADDING = 4;
const CustomNode = (props: any) => {
  console.log(props);
  const { node } = props;
  const { x, y, width, height, id: title, value: percentage, color } = node;

  const padding = PADDING;
  const rectX = x + padding / 2;
  const rectY = y + padding / 2;
  const rectWidth = Math.max(0, width - padding);
  const rectHeight = Math.max(0, height - padding);

  const maxCharsPerLine = Math.floor(width / 8);
  const words = title?.split(' ');
  const lines = [];
  let currentLine = '';

  (words || []).forEach((word: string) => {
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

const PDResearchTreemap: React.FC<{ custom?: boolean }> = ({ custom }) => (
  <div style={{ height: 400 }}>
    <ResponsiveTreeMap
      data={data}
      identity="name"
      value="value"
      colors={{ scheme: 'nivo' }}
      label={({ id, value }) => `${id}\n${value.toFixed(2)}%`}
      nodeComponent={custom ? CustomNode : undefined}
      orientLabel={false}
      enableParentLabel={false}
      borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
      innerPadding={0}
      labelSkipSize={24}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
      theme={{
        labels: {
          text: {
            fontSize: 16,
            whiteSpace: 'pre-line',
          },
        },
      }}
    />
  </div>
);

export default PDResearchTreemap;

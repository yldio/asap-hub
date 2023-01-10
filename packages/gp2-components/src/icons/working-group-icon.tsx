/* istanbul ignore file */
interface WorkingGroupIconProps {
  readonly color?: string;
}

const workingGroupIcon: React.FC<WorkingGroupIconProps> = ({
  color = '#4D646B',
}) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>Working Groups</title>
    <path
      d="M10.85 13.5a.65.65 0 0 1 .65-.65h5a.65.65 0 0 1 0 1.3h-5a.65.65 0 0 1-.65-.65ZM10.85 9.5a.65.65 0 0 1 .65-.65h5a.65.65 0 0 1 0 1.3h-5a.65.65 0 0 1-.65-.65ZM10.85 5.5a.65.65 0 0 1 .65-.65h5a.65.65 0 0 1 0 1.3h-5a.65.65 0 0 1-.65-.65ZM7.25 5.5a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0ZM7.25 9.5a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0ZM7.25 13.5a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Z"
      fill={color}
    />
    <path fillRule="evenodd" clipRule="evenodd" d={color} />
  </svg>
);

export default workingGroupIcon;

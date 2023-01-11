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
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 1.65A1.35 1.35 0 0 0 5.65 3v13a.65.65 0 1 1-1.3 0V3A2.65 2.65 0 0 1 7 .35h10A2.65 2.65 0 0 1 19.65 3v13a.65.65 0 1 1-1.3 0V3A1.35 1.35 0 0 0 17 1.65H7ZM5.2 18a2.35 2.35 0 1 0 2.26 3H9.64a2.351 2.351 0 0 0 4.518 0h2.382a2.351 2.351 0 1 0 0-1.3H14.16a2.35 2.35 0 0 0-4.518 0H7.46A2.351 2.351 0 0 0 5.2 18Zm0 1.3a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Zm5.65 1.05a1.05 1.05 0 1 1 2.1 0 1.05 1.05 0 0 1-2.1 0Zm7.95-1.05a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z"
      fill={color}
    />
  </svg>
);

export default workingGroupIcon;

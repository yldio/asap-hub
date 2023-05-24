/* istanbul ignore file */
import { FC } from 'react';

interface InterestGroupsIconProps {
  readonly color?: string;
}

const InterestGroupsIcon: FC<InterestGroupsIconProps> = ({
  color = '#4D646B',
}) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.35 18.035a2.35 2.35 0 1 0 2.259 3h2.182a2.351 2.351 0 0 0 4.518 0h2.382a2.35 2.35 0 1 0 0-1.3H14.31a2.35 2.35 0 0 0-4.518 0H7.609a2.35 2.35 0 0 0-2.259-1.7Zm0 1.3a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Zm5.65 1.05a1.05 1.05 0 1 1 2.1 0 1.05 1.05 0 0 1-2.1 0Zm7.95-1.05a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z"
      fill={color}
    />
    <title>Interest Group</title>
    <rect
      width={1.6}
      height={2.2}
      rx={0.8}
      transform="matrix(1 0 0 -1 11.2 2.2)"
      fill={color}
    />
    <rect
      x={3.2}
      y={9.6}
      width={1.6}
      height={2.2}
      rx={0.8}
      transform="rotate(-90 3.2 9.6)"
      fill={color}
    />
    <path
      d="M14.857 12.971c.662-.453 1.202-1.245 1.576-1.95A4.869 4.869 0 0 0 17 8.74c0-1.31-.527-2.566-1.464-3.492A5.032 5.032 0 0 0 12 3.801c-1.326 0-2.598.52-3.536 1.446A4.907 4.907 0 0 0 7 8.74c0 .796.194 1.58.567 2.286.373.706.914 1.492 1.576 1.946m5.714 0H9.143m5.714 0-.279 1.842-.108.789a1.407 1.407 0 0 1-.481.858c-.26.22-.59.34-.931.34h-2.116a1.44 1.44 0 0 1-.931-.34c-.26-.22-.43-.525-.481-.858l-.109-.789-.278-1.842"
      stroke={color}
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 14.965h4"
      stroke={color}
      strokeWidth={0.65}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x={18.6}
      y={9.6}
      width={1.6}
      height={2.2}
      rx={0.8}
      transform="rotate(-90 18.6 9.6)"
      fill={color}
    />
    <rect
      width={1.6}
      height={2.2}
      rx={0.8}
      transform="scale(1 -1) rotate(45 8.457 5.373)"
      fill={color}
    />
    <rect
      x={17.725}
      y={4.406}
      width={1.6}
      height={2.2}
      rx={0.8}
      transform="rotate(-135 17.725 4.406)"
      fill={color}
    />
  </svg>
);

export default InterestGroupsIcon;

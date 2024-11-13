/* istanbul ignore file */

import { charcoal } from '../colors';
import type { OpaqueColor } from '../colors';

type ExternalLinkIconProps = {
  size?: number;
  color?: OpaqueColor;
};

const ExternalLinkIcon: React.FC<ExternalLinkIconProps> = ({
  size = 24,
  color = charcoal,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color.rgba}
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>External Link</title>
    <path
      d="M18.133 9.467V6h-3.466M12.067 12.067L18.133 6M18.133 11.817v6.316H6V6h6.248"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ExternalLinkIcon;

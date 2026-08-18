/** @jsxImportSource @emotion/react */
import { FC } from 'react';

type IconProps = { readonly size?: number };

const svgProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
});

export const HomeIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20h13V9.5" />
  </svg>
);

export const FolderIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5h7A1.5 1.5 0 0 1 19 9v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 18Z" />
  </svg>
);

export const PlusIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SearchIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <circle cx="11" cy="11" r="6" />
    <path d="m15.5 15.5 4 4" />
  </svg>
);

export const GridIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
  </svg>
);

export const ListIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
  </svg>
);

export const CameraIcon: FC<IconProps> = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <rect x="3" y="6.5" width="12" height="11" rx="2" />
    <path d="m15 11 6-3.5v9L15 13Z" />
  </svg>
);

export const TrashIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M4 7h16M10 7V5h4v2M6 7l1 13h10l1-13" />
  </svg>
);

export const DragHandleIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <circle cx="9" cy="6" r="1.2" fill="currentColor" />
    <circle cx="15" cy="6" r="1.2" fill="currentColor" />
    <circle cx="9" cy="12" r="1.2" fill="currentColor" />
    <circle cx="15" cy="12" r="1.2" fill="currentColor" />
    <circle cx="9" cy="18" r="1.2" fill="currentColor" />
    <circle cx="15" cy="18" r="1.2" fill="currentColor" />
  </svg>
);

export const FilterIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M4 6h16l-6 7v5l-4 2v-7Z" />
  </svg>
);

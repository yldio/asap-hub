import regionAfricaIcon from '../icons/region-africa-icon';
import regionAsia from '../icons/region-asia-icon';
import regionAustralasiaIcon from '../icons/region-australasia-icon';
import regionEuropeIcon from '../icons/region-europe-icon';
import regionLatinAmericaIcon from '../icons/region-latin-america-icon';
import regionNorthAmericaIcon from '../icons/region-north-america-icon';
import regionSouthAmericaIcon from '../icons/region-south-america-icon';
import IconWithLabel from './IconWithLabel';

export const regions = [
  'Africa',
  'Asia',
  'Australasia',
  'Europe',
  'North America',
  'Latin America',
  'South America',
] as const;

export type Region = typeof regions[number];

const getRegionIcon = (region: Region): JSX.Element => {
  switch (region) {
    case 'Africa':
      return regionAfricaIcon;
    case 'Asia':
      return regionAsia;
    case 'Australasia':
      return regionAustralasiaIcon;
    case 'Europe':
      return regionEuropeIcon;
    case 'North America':
      return regionNorthAmericaIcon;
    case 'Latin America':
      return regionLatinAmericaIcon;
    case 'South America':
      return regionSouthAmericaIcon;
  }
};

type UserRegionProps = {
  region: Region;
};

const UserRegion: React.FC<UserRegionProps> = ({ region }) => (
  <IconWithLabel icon={getRegionIcon(region)}>
    <span>{region}</span>
  </IconWithLabel>
);

export default UserRegion;

import { gp2 } from '@asap-hub/model';
import regionAfricaIcon from '../icons/region-africa-icon';
import regionAsia from '../icons/region-asia-icon';
import regionAustralasiaIcon from '../icons/region-australasia-icon';
import regionEuropeIcon from '../icons/region-europe-icon';
import regionLatinAmericaIcon from '../icons/region-latin-america-icon';
import regionNorthAmericaIcon from '../icons/region-north-america-icon';
import regionSouthAmericaIcon from '../icons/region-south-america-icon';
import IconWithLabel from './IconWithLabel';

const regionIcons: { [key in gp2.UserRegion]: JSX.Element } = {
  Africa: regionAfricaIcon,
  Asia: regionAsia,
  'Australia/Australiasia': regionAustralasiaIcon,
  Europe: regionEuropeIcon,
  'North America': regionNorthAmericaIcon,
  'Latin America': regionLatinAmericaIcon,
  'South America': regionSouthAmericaIcon,
};

type UserRegionProps = {
  region: gp2.UserRegion;
};

const UserRegion: React.FC<UserRegionProps> = ({ region }) => (
  <IconWithLabel icon={regionIcons[region]}>
    <span>{region}</span>
  </IconWithLabel>
);

export default UserRegion;

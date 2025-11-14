import { ComponentProps } from 'react';
import ResearchOutputsSearch from './ResearchOutputsSearch';

const UserProfileSearchAndFilter: React.FC<
  ComponentProps<typeof ResearchOutputsSearch>
> = ({ ...props }) => <ResearchOutputsSearch {...props} />;
export default UserProfileSearchAndFilter;

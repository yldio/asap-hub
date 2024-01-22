import {
  Association,
  ItemType,
  SharedOutputDropdownBase,
} from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import type { gp2 as gp2Auth } from '@asap-hub/auth';
import { gp2 as gp2Validation } from '@asap-hub/validation';
import {
  outputArticle,
  outputCode,
  outputDataset,
  outputForm,
  outputMaterial,
  outputReport,
} from '../icons';

type OutputDropdownWrapperProps = {
  children?: never;
  user: gp2Auth.User | null;
};

export const OutputDropdownWrapper: React.FC<OutputDropdownWrapperProps> = ({
  user,
}) => {
  const associations = [
    ...(user?.projects ?? [])
      .concat()
      .filter((project) => {
        const userRole = gp2Validation.getUserRole(
          user,
          'Projects',
          project.id,
        );
        return user?.role === 'Administrator' || userRole === 'Project manager';
      })
      .sort((a, b) => a.title.localeCompare(b.title)),
    ...(user?.workingGroups ?? [])
      .concat()
      .filter(() => user?.role === 'Administrator')
      .sort((a, b) => a.title.localeCompare(b.title)),
  ];

  const routeLink = (
    association: Association,
    outputDocumentType: gp2Routing.OutputDocumentTypeParameter,
  ) =>
    (association as gp2Model.UserProject).status !== undefined
      ? gp2Routing
          .projects({})
          .project({ projectId: association.id })
          .createOutput({ outputDocumentType }).$
      : gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId: association.id })
          .createOutput({ outputDocumentType }).$;

  const dropdownOptions = (selectedAssociation: Association) => [
    {
      item: <>{outputArticle} Article</>,
      type: 'inner' as ItemType,
      href: routeLink(selectedAssociation, 'article'),
    },
    {
      item: <>{outputCode} Code/Software</>,
      type: 'inner' as ItemType,
      href: routeLink(selectedAssociation, 'code-software'),
    },
    {
      item: <>{outputDataset} Dataset</>,
      type: 'inner' as ItemType,
      href: routeLink(selectedAssociation, 'dataset'),
    },
    {
      item: <>{outputForm} Form</>,
      type: 'inner' as ItemType,
      href: routeLink(selectedAssociation, 'procedural-form'),
    },
    {
      item: <>{outputReport} GP2 Reports</>,
      type: 'inner' as ItemType,
      href: routeLink(selectedAssociation, 'gp2-reports'),
    },
    {
      item: <>{outputMaterial} Training Materials</>,
      type: 'inner' as ItemType,
      href: routeLink(selectedAssociation, 'training-materials'),
    },
  ];

  return (
    <SharedOutputDropdownBase
      associations={associations}
      dropdownOptions={dropdownOptions}
    />
  );
};

const OutputDropdown = () => {
  const user = useCurrentUserGP2();
  return <OutputDropdownWrapper user={user} />;
};
export default OutputDropdown;

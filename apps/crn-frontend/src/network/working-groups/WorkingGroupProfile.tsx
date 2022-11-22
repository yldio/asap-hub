import {
  NotFoundPage,
  WorkingGroupAbout,
  WorkingGroupPage,
} from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';
import { ComponentProps, FC } from 'react';
import { useWorkingGroupById } from './state';

const WorkingGroupProfile: FC = () => {
  const route = network({}).workingGroups({}).workingGroup;
  const { workingGroupId } = useRouteParams(route);
  const workingGroup = useWorkingGroupById(workingGroupId);

  if (workingGroup) {
    const props: ComponentProps<typeof WorkingGroupPage> = {
      id: workingGroup.id,
      name: workingGroup.title,
      members: [],
      complete: false,
      description: workingGroup.description,
      externalLink: workingGroup.externalLink,
      externalLinkText: workingGroup.externalLinkText,
      lastUpdated: new Date(workingGroup.lastModifiedDate).toISOString(),
    };

    return (
      <WorkingGroupPage {...props}>
        <WorkingGroupAbout
          members={props.members}
          description={props.description}
          pointOfContact={props.pointOfContact}
        />
      </WorkingGroupPage>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;

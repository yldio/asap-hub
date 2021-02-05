import React from 'react';
import { number, text } from '@storybook/addon-knobs';

import { TeamGroupCard } from '@asap-hub/react-components';
import {
  createTeamResponse,
  createGroupResponseItem,
} from '@asap-hub/fixtures';
import { ListGroupResponse } from '@asap-hub/model';

export default {
  title: 'Organisms / Team Profile / Group Card',
  component: TeamGroupCard,
};

const props = (): ListGroupResponse => {
  const numberOfGroups = number('Number of groups', 5);
  return {
    total: numberOfGroups,
    items: Array.from({ length: numberOfGroups }, (_, index) => {
      const groupResponseItem = createGroupResponseItem({}, index);
      if (index === 0) {
        return {
          ...groupResponseItem,
          name: text('Group 0 Name', 'Sci 1 - GWAS Functional'),
          description: text(
            'Group 0 Description',
            'Neurology Discussion Group is a space to share thoughts and files on the subject of Neurology.  Neurology is a medical specialty dealing with disorders of the nervous system',
          ),
          teams: Array.from(
            { length: number('Group 0 Team Count', 5) },
            (__, i) => ({
              ...createTeamResponse({}, i),
            }),
          ),
        };
      }
      return groupResponseItem;
    }),
  };
};

export const Normal = () => <TeamGroupCard {...props()} />;

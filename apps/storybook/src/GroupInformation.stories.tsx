import React from 'react';
import { GroupInformation } from '@asap-hub/react-components';
import { text, array } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Group Profile / Information',
};

export const Normal = () => (
  <GroupInformation
    description={text(
      'Description',
      `Neurology Discussion Group is a space to share thoughts and files on the subject of Neurology.  Neurology is a medical specialty dealing with disorders of the nervous system.

To be specific, it deals with the diagnosis and treatment of all categories of disease involving the central, peripheral, and autonomic nervous systems, including their coverings, blood vessels, and all effector tissue, such as muscle.`,
    )}
    tags={array('Tags', ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'])}
  />
);

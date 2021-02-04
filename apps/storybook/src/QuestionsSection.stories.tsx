import React from 'react';
import { array, text } from '@storybook/addon-knobs';
import { QuestionsSection } from '@asap-hub/react-components';

export default {
  title: 'Organisms / User Profile / Questions',
};

export const Normal = () => (
  <QuestionsSection
    firstName={text('Name', 'John')}
    questions={array('Questions', [
      'What is the meaning of life?',
      'Are alpha-synuclein deposits the cause or consequence of somethign deeper wrong with neurons?',
      'How much do we have to knock down extracellular alpha-synuclein to measurably slow cell to cell transmission?',
    ])}
  />
);

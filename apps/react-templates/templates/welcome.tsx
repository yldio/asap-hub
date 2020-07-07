import React from 'react';
import { messages } from '@asap-hub/react-components';

export default () => (
  <messages.Welcome firstName="{{ firstName }}" link="{{ link }}" />
);

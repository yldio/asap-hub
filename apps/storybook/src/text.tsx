import { select } from './knobs';

import { text as componentText } from '@asap-hub/react-components';

export const accentColor = () =>
  select<componentText.AccentColorName | undefined>(
    'Accent Color',
    {
      None: undefined,
      Lead: 'lead',
      Ember: 'ember',
      Pepper: 'pepper',
      Sandstone: 'sandstone',
      Clay: 'clay',
      Pine: 'pine',
      Fern: 'fern',
      Cerulean: 'cerulean',
      Denim: 'denim',
      Prussian: 'prussian',
      Space: 'space',
      Berry: 'berry',
      Magenta: 'magenta',
      Iris: 'iris',
      Mauve: 'mauve',
    },
    undefined,
  );

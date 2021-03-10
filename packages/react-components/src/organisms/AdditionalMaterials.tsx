import React from 'react';
import css from '@emotion/css';

import { EventResponse } from '@asap-hub/model';
import { Card, Headline3, Headline4 } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { steel } from '../colors';
import { ExternalLink } from '../molecules';

const orderList = css({
  listStyle: 'none',
  paddingLeft: 0,
  marginBottom: 0,
  '&> li + li': {
    borderTop: `1px solid ${steel.rgb}`,
    marginTop: `${12 / perRem}em`,
    paddingTop: `${6 / perRem}em`,
    [`@media (min-width: ${tabletScreen.min}px)`]: {
      marginTop: '0',
      paddingTop: '0',
    },
  },
});

const listElement = css({
  width: '100%',
  display: 'block',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inline-flex',
    justifyContent: 'space-between',
  },
});

type AdditionalMaterialsProps = {
  meetingMaterials: EventResponse['meetingMaterials'];
};
const AdditionalMaterials: React.FC<AdditionalMaterialsProps> = ({
  meetingMaterials,
}) =>
  meetingMaterials && meetingMaterials.length ? (
    <Card>
      <Headline3 styleAsHeading={4}>Additional meeting materials</Headline3>
      <ul css={orderList}>
        {meetingMaterials.map(({ title, url }, index) => (
          <li key={`material-${index}`} css={listElement}>
            <Headline4 styleAsHeading={5}>{title}</Headline4>
            <ExternalLink href={url} />
          </li>
        ))}
      </ul>
    </Card>
  ) : null;

export default AdditionalMaterials;

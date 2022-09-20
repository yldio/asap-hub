import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { Card, Headline4, Link } from '../atoms';
import { formatDateToTimezone } from '../date';
import { perRem, tabletScreen } from '../pixels';
import { lead, steel } from '../colors';
import { protocol } from '../icons';

const gridMixin = {
  display: 'grid',
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    gridTemplateColumns: '2fr 1fr 0.8fr',
    gridAutoFlow: 'column',
    alignItems: 'start',
    gridAutoRows: `${66 / perRem}em`,
  },
};

const gridStyles = css({
  display: 'grid',
  flexFlow: 'column',
});

const labelStyle = css({
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridAutoFlow: 'column',
    alignItems: 'start',
    display: 'inline-block',
    fontWeight: 'bold',
  },
  display: 'none',
});

const groupStyle = css({
  display: 'flex',
  flexFlow: 'column',
});

const headerStyle = css({
  display: 'grid',
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    gridTemplateColumns: '2fr 1fr 0.8fr',
    gridAutoFlow: 'column',
    alignItems: 'start',
  },
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    display: 'none',
  },
});

const speakerListStyles = css({
  ...gridMixin,
  paddingTop: `${21 / perRem}em`,
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    ...gridMixin,
    ':nth-child(1)': {
      paddingTop: `${3 / perRem}em`,
    },
    ':nth-last-child(1)': {
      gridAutoRows: `${48 / perRem}em`,
    },
  },
  ':nth-last-child(n+2)': {
    borderBottom: `1px solid ${steel.rgb}`,
  },
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    gridAutoFlow: 'row',
    alignItems: 'start',
  },
});

const paragraphStyle = css({
  marginTop: 0,
  marginBottom: 0,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: `${6 / perRem}em`,
  color: lead.rgb,
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    marginTop: `${15 / perRem}em`,
    marginBottom: `${21 / perRem}em`,
  },
});

type RecentSharedOutputProp = {
  outputs?: ResearchOutputResponse[];
};

const RecentSharedOutputs: React.FC<RecentSharedOutputProp> = ({ outputs }) => (
  <Card>
    <div css={headerStyle}>
      <Headline4 styleAsHeading={4}>Shared Output</Headline4>
      <Headline4 styleAsHeading={4}>Type of Output</Headline4>
      <Headline4 styleAsHeading={4}>Date</Headline4>
    </div>
    <div css={gridStyles}>
      {outputs &&
        outputs.map((output) => (
          <div key={output.id} css={speakerListStyles}>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Shared Output</span>
              </div>
              <div css={paragraphStyle}>
                <Link
                  href={
                    sharedResearch({}).researchOutput({
                      researchOutputId: output.id,
                    }).$
                  }
                  ellipsed
                >
                  {output.title}
                </Link>
              </div>
            </div>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Type of Output</span>
              </div>
              <p css={paragraphStyle}>
                {protocol} {output.documentType}
              </p>
            </div>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Date</span>
              </div>
              <p css={paragraphStyle}>
                {formatDateToTimezone(
                  output.addedDate,
                  'E, d MMM y',
                ).toUpperCase()}
              </p>
            </div>
          </div>
        ))}
    </div>
  </Card>
);

export default RecentSharedOutputs;

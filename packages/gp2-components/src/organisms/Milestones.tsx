import { gp2 } from '@asap-hub/model';
import {
  Button,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
  Headline3,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useState } from 'react';
import colors from '../templates/colors';
import Milestone from './Milestone';

const { rem } = pixels;

type MilestonesProps = {
  milestones: gp2.Milestone[];
  title: string;
  description: string;
};

const contentStyles = css({
  padding: `${rem(16)} 0`,
});
const rowStyles = css({
  display: 'grid',
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  marginBottom: rem(12),
  padding: `${rem(16)} 0 ${rem(12)}`,
  overflowX: 'scroll',
});

const buttonWrapperStyles = css({
  paddingTop: rem(8),
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  borderBottom: `transparent`,
});
const hideStyles = css({
  [`:nth-of-type(n+5)`]: { display: 'none' },
});

const Milestones: React.FC<MilestonesProps> = ({
  milestones,
  title,
  description,
}) => {
  const minimumMilestonesToDisplay = 3;
  const [expanded, setExpanded] = useState(false);
  const getMilestoneListStyles = () => {
    if (milestones.length < minimumMilestonesToDisplay + 1 || expanded) {
      return rowStyles;
    }

    return [rowStyles, hideStyles];
  };
  return (
    <>
      <Headline3 noMargin>
        {title} ({milestones.length})
      </Headline3>
      <div css={[contentStyles]}>
        <Paragraph noMargin accent="lead">
          {description}
        </Paragraph>
      </div>
      {milestones.map((milestone, index) => (
        <div key={`milestone-${index}`} css={getMilestoneListStyles()}>
          <Milestone milestone={milestone} />
        </div>
      ))}
      {milestones.length > minimumMilestonesToDisplay && (
        <div css={buttonWrapperStyles}>
          <Button linkStyle onClick={() => setExpanded(!expanded)}>
            <span
              css={{
                display: 'inline-grid',
                verticalAlign: 'middle',
                paddingRight: rem(12),
              }}
            >
              {expanded ? chevronCircleUpIcon : chevronCircleDownIcon}
            </span>
            Show {expanded ? 'less' : 'more'}
          </Button>
        </div>
      )}
    </>
  );
};

export default Milestones;

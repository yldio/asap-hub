import { gp2 } from '@asap-hub/model';
import {
  Button,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
  ExternalLink,
  Headline4,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useState } from 'react';
import { nonMobileQuery } from '../layout';
import colors from '../templates/colors';

const { rem } = pixels;

const contentStyles = css({
  padding: `${rem(16)} 0 ${rem(20)}`,
});
const rowStyles = css({
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  marginBottom: rem(12),
  padding: `${rem(16)} 0 ${rem(12)}`,
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
  [nonMobileQuery]: {
    display: 'flex',
  },
});
const hideStyles = css({
  [`:nth-of-type(n+6)`]: { display: 'none' },
});
const headingTopStyles = css({
  display: 'none',
  [nonMobileQuery]: {
    display: 'flex',
  },
  '*:first-of-type': {
    flex: '40% 0 0',
  },
  '& > *': {
    flex: '30% 0 0',
  },
});
const listElementStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(32),
  marginBottom: rem(8),
});
const listElementMainStyles = css({
  [nonMobileQuery]: {
    flex: '40% 0 0',
  },
});
const listElementSecondaryStyles = css({
  [nonMobileQuery]: {
    flex: '30% 0 0',
  },
});
const headingListStyles = css({
  margin: '0',
  flex: '30% 0 0',
  [nonMobileQuery]: {
    display: 'none',
  },
});
const buttonWrapperStyles = css({
  paddingTop: rem(8),
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  borderBottom: `transparent`,
});

type UserContributingCohortsProps = Pick<
  gp2.UserResponse,
  'contributingCohorts' | 'firstName'
>;
const UserContributingCohorts: React.FC<UserContributingCohortsProps> = ({
  contributingCohorts,
  firstName,
}) => {
  const minimumToDisplay = 3;
  const [expanded, setExpanded] = useState(false);

  const getListStyles = () =>
    contributingCohorts.length < minimumToDisplay + 1 || expanded
      ? rowStyles
      : [rowStyles, hideStyles];

  return (
    <>
      <div css={[contentStyles]}>
        <Paragraph hasMargin={false} accent="lead">
          {firstName} has contributed to the following cohort studies:
        </Paragraph>
      </div>
      <div css={headingTopStyles}>
        <Headline4>Name</Headline4>
        <Headline4>Role</Headline4>
        <Headline4>Link</Headline4>
      </div>
      {contributingCohorts.map(
        ({ contributingCohortId, name, study, role }) => (
          <div
            key={`user-cohort-${contributingCohortId}`}
            css={getListStyles()}
          >
            <div css={[listElementStyles, listElementMainStyles]}>
              <h4 css={headingListStyles}>Name:</h4>
              {name}
            </div>
            <div css={[listElementStyles, listElementSecondaryStyles]}>
              <h4 css={headingListStyles}>Role:</h4>
              {role}
            </div>
            <div css={[listElementStyles, listElementSecondaryStyles]}>
              {study && (
                <>
                  <h4 css={headingListStyles}>Link:</h4>
                  <ExternalLink href={study} label="View study" noMargin />
                </>
              )}
            </div>
          </div>
        ),
      )}
      {contributingCohorts.length > minimumToDisplay && (
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

export default UserContributingCohorts;

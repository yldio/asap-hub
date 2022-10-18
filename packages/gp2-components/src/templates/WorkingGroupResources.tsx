import { gp2 } from '@asap-hub/model';
import {
  Anchor,
  Button,
  Card,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
  externalLinkIcon,
  Headline3,
  Link,
  Paragraph,
  Pill,
  pixels,
  Subtitle,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useState } from 'react';
import { addIcon, editIcon } from '../icons';

type WorkingGroupResourcesProps = Pick<gp2.WorkingGroupResponse, 'resources'>;

const { rem, tabletScreen } = pixels;
const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: `${rem(32)} 0 ${rem(48)}`,
});
const rowStyles = css({
  display: 'flex',
  paddingBottom: rem(16),
  flexDirection: 'row',
});
const buttonWrapperStyles = css({
  paddingTop: rem(8),
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  borderBottom: `transparent`,
});
const buttonStyles = css({
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    flexDirection: 'column-reverse',
    gap: rem(24),
  },
});
const editButtonStyles = css({
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    marginLeft: 'auto',
  },
});
const hideStyles = css({
  [`:nth-of-type(n+4)`]: { display: 'none' },
});

const WorkingGroupResources: React.FC<WorkingGroupResourcesProps> = ({
  resources,
}) => {
  const minimumResourcesToDisplay = 3;
  const [expanded, setExpanded] = useState(false);
  const getResourcesListStyles = () => {
    if (resources.length < minimumResourcesToDisplay + 1 || expanded) {
      return [];
    }

    return [hideStyles];
  };
  return (
    <div css={containerStyles}>
      <Card>
        Please note, this is a private space for this working group on the
        network. Nobody outside of this working group can see anything that you
        upload here.
      </Card>
      <Card>
        <div css={[rowStyles, buttonStyles]}>
          <Headline3 noMargin>Resource List</Headline3>
          <div css={editButtonStyles}>
            <Link href={''} buttonStyle noMargin small>
              Add {addIcon}
            </Link>
          </div>
        </div>
        <div css={css({ paddingBottom: rem(32) })}>
          View and share resources that others may find helpful.
        </div>
        <div
          css={css({ display: 'flex', flexDirection: 'column', gap: rem(32) })}
        >
          {resources.map((resource, index) => (
            <div
              key={`working-group-resource-${index}`}
              css={getResourcesListStyles()}
            >
              <Card>
                <div css={[rowStyles, buttonStyles]}>
                  <Pill
                    small={false}
                    overrideStyles={css({
                      margin: 0,
                      fontSize: rem(14),
                      padding: '4px 8px',
                      lineHeight: rem(16),
                      maxWidth: 'fit-content',
                    })}
                  >
                    {resource.type === 'Link' ? 'Link' : 'Note'}
                  </Pill>
                  <div css={editButtonStyles}>
                    <Link href={''} buttonStyle noMargin small>
                      Edit {editIcon}
                    </Link>
                  </div>
                </div>
                <div
                  css={css({
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: rem(8),
                  })}
                >
                  <Subtitle styleAsHeading={4} hasMargin={false}>
                    {resource.title}
                  </Subtitle>
                  {resource.type === 'Link' && (
                    <div css={css({ padding: '4px 8px' })}>
                      <Anchor href={resource.externalLink}>
                        {externalLinkIcon}
                      </Anchor>
                    </div>
                  )}
                </div>
                <Paragraph hasMargin={false} accent="lead">
                  {resource.description}
                </Paragraph>
              </Card>
            </div>
          ))}
        </div>
        {resources.length > minimumResourcesToDisplay && (
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
      </Card>
    </div>
  );
};

export default WorkingGroupResources;

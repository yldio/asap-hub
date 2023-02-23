import { gp2 } from '@asap-hub/model';
import {
  Anchor,
  Button,
  Card,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
  externalLinkIcon,
  Headline3,
  infoCircleYellowIcon,
  Link,
  Paragraph,
  Pill,
  pixels,
  Subtitle,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { useState } from 'react';
import { addIcon, editIcon } from '../icons';
import { mobileQuery, nonMobileQuery } from '../layout';
import colors from '../templates/colors';

export type ResourcesProps = {
  resources?: gp2.Resource[];
  headline: EmotionJSX.Element;
  add?: string;
  edit?: string;
};

const { rem } = pixels;
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
  [mobileQuery]: {
    flexDirection: 'column-reverse',
    gap: rem(24),
  },
});
const editButtonStyles = css({
  [nonMobileQuery]: {
    marginLeft: 'auto',
  },
});
const hideStyles = css({
  [`:nth-of-type(n+4)`]: { display: 'none' },
});

const Resources: React.FC<ResourcesProps> = ({
  resources,
  headline,
  add,
  edit,
}) => {
  const minimumResourcesToDisplay = 3;
  const [expanded, setExpanded] = useState(false);
  const getResourcesListStyles = () => {
    if ((resources || []).length < minimumResourcesToDisplay + 1 || expanded) {
      return [];
    }

    return [hideStyles];
  };

  return (
    <div css={containerStyles}>
      <Card padding={false} accent={'warning100'}>
        <div
          css={{
            display: 'flex',
            gap: rem(16),
            padding: `${rem(32)} ${rem(24)}`,
          }}
        >
          {infoCircleYellowIcon}
          {headline}
        </div>
      </Card>
      <Card>
        <div css={[rowStyles, buttonStyles]}>
          <Headline3 noMargin>Resource List</Headline3>
          {add && (
            <div css={editButtonStyles}>
              <Link href={add} fullWidth buttonStyle noMargin small>
                <span
                  css={{
                    display: 'inline-flex',
                    gap: rem(8),
                    padding: `0 ${rem(3)}`,
                  }}
                >
                  Add {addIcon}
                </span>
              </Link>
            </div>
          )}
        </div>
        <div css={css({ paddingBottom: rem(32) })}>
          View and share resources that others may find helpful.
        </div>
        <div
          css={css({ display: 'flex', flexDirection: 'column', gap: rem(32) })}
        >
          {resources?.map((resource, index) => (
            <div key={`resource-${index}`} css={getResourcesListStyles()}>
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
                  {edit && (
                    <div css={editButtonStyles}>
                      <Link
                        href={`${edit}/${index}`}
                        buttonStyle
                        noMargin
                        small
                      >
                        <span
                          css={{
                            display: 'inline-flex',
                            gap: rem(8),
                            margin: `0 ${rem(3)}`,
                          }}
                        >
                          Edit {editIcon}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
                <div
                  css={css([
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      paddingTop: rem(8),
                    },
                    resource.type === 'Link'
                      ? {
                          color: colors.primary500.rgb,
                        }
                      : {},
                  ])}
                >
                  <Subtitle styleAsHeading={4} noMargin>
                    {resource.title}
                  </Subtitle>
                  {resource.type === 'Link' && (
                    <div
                      css={css({
                        padding: '4px 8px',
                        svg: {
                          stroke: colors.primary500.rgb,
                        },
                      })}
                    >
                      <Anchor href={resource.externalLink}>
                        {externalLinkIcon}
                      </Anchor>
                    </div>
                  )}
                </div>
                <Paragraph noMargin accent="lead">
                  {resource.description}
                </Paragraph>
              </Card>
            </div>
          ))}
        </div>
        {resources && resources.length > minimumResourcesToDisplay && (
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

export default Resources;

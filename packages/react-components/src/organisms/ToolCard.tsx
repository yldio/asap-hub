import { useState } from 'react';
import { css } from '@emotion/react';
import { TeamTool } from '@asap-hub/model';

import { Card, Headline3, Paragraph, Anchor, Link, Button } from '../atoms';
import { placeholderIcon } from '../icons';
import { perRem, tabletScreen } from '../pixels';
import { getIconFromUrl } from '../utils';
import { fern } from '../colors';
import { useIsMounted } from '../hooks';

type ToolCardProps = Pick<TeamTool, 'description' | 'name' | 'url'> & {
  readonly editHref: string;
  readonly onDelete?: () => Promise<void>;
};

const containerStyle = css({
  alignItems: 'top',
  display: 'flex',
  flexDirection: 'column',

  [`@media (min-width: ${tabletScreen.width}px)`]: {
    flexDirection: 'row',
  },

  gridColumnGap: `${24 / perRem}em`,
});

const logoIconStyle = css({
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    marginTop: '10px',
  },
});

const linksStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,

  display: 'flex',
  '> *:not(:last-of-type)': {
    paddingRight: `${24 / perRem}em`,
  },
});

const ToolCard: React.FC<ToolCardProps> = ({
  name,
  description,
  url,
  editHref,
  onDelete,
}) => {
  const [deleting, setDeleting] = useState(false);
  const isMounted = useIsMounted();
  return (
    <Card>
      <div css={containerStyle}>
        <div css={logoIconStyle}>{getIconFromUrl(url) ?? placeholderIcon}</div>
        <div css={{ flex: 1 }}>
          <Anchor href={url}>
            <Headline3 styleAsHeading={4}>{name}</Headline3>
            <Paragraph accent="lead">{description}</Paragraph>
          </Anchor>
          <ol css={linksStyles}>
            <li>
              <Link href={editHref}>Edit Link</Link>
            </li>
            <li>
              {deleting ? (
                <span css={{ color: fern.rgb }}>Deleting…</span>
              ) : onDelete ? (
                <Button
                  linkStyle
                  onClick={async () => {
                    setDeleting(true);
                    await onDelete();
                    if (isMounted.current) {
                      setDeleting(false);
                    }
                  }}
                >
                  Delete
                </Button>
              ) : (
                'Delete'
              )}
            </li>
          </ol>
        </div>
      </div>
    </Card>
  );
};

export default ToolCard;

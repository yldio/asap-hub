import React, { useState, useEffect } from 'react';
import css from '@emotion/css';
import { serializeError } from 'serialize-error';

import { Card, Paragraph, Caption } from '../atoms';
import { crossIcon } from '../icons';
import { perRem, lineHeight } from '../pixels';
import { ember } from '../colors';

const styles = css({
  boxSizing: 'border-box',
  maxHeight: '100%',
  padding: `${12 / perRem}em`,

  overflowY: 'auto',
});
const iconStyles = css({
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,
  paddingRight: `${6 / perRem}em`,
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',

  svg: {
    stroke: ember.rgb,
  },
});
const errorInfoStyles = css({
  fontSize: 'smaller',

  overflowX: 'hidden',
  wordBreak: 'break-all',

  userSelect: 'all',
  // inline (without -block) allows clicking between lines, bypassing user-select
  display: 'inline-block',
});

interface ErrorCardProps {
  children?: React.ReactNode;
  error?: Error;
}
const ErrorCard: React.FC<ErrorCardProps> = ({
  children = 'Unknown Error',
  error,
}) => {
  const [headHtml, setHeadHtml] = useState<string>();
  useEffect(() => setHeadHtml(document.head.innerHTML), [error]);

  const [time, setTime] = useState<Date>();
  useEffect(() => setTime(new Date()), [error]);

  return (
    <Card padding={false} accent="red">
      <div css={styles}>
        <Paragraph primary>
          <span css={{ display: 'flex' }}>
            <span css={iconStyles}>{crossIcon}</span>
            {error?.message ?? children}
          </span>
        </Paragraph>
        {error && (
          <>
            <Paragraph>
              Should you ask for support via the menu, we would be glad if you
              could paste the following info to help us track down the problem:
            </Paragraph>
            <figure css={{ margin: 0 }}>
              <Caption>Error info for nerds</Caption>
              <code css={errorInfoStyles}>
                {btoa(
                  JSON.stringify(
                    {
                      error: serializeError(error),
                      time,
                      headHtml,
                    },
                    null,
                    2,
                  ),
                )}
              </code>
            </figure>
          </>
        )}
      </div>
    </Card>
  );
};

export default ErrorCard;

import React from 'react';
import css from '@emotion/css';
import { serializeError } from 'serialize-error';

import { Card, Link, Button } from '../atoms';
import { alertIcon } from '../icons';
import { perRem } from '../pixels';
import { useHistory } from 'react-router-dom';
import { mailToSupport } from '../mail';

const styles = css({
  boxSizing: 'border-box',
  maxHeight: '100%',
  padding: `${24 / perRem}em`,
  display: 'grid',
  gridColumnGap: `${12 / perRem}em`,
  gridTemplateColumns: 'min-content auto',

  overflowY: 'auto',
});

interface ErrorProps {
  readonly error: Error;

  readonly description?: string;
}

interface TitleDescriptionProps {
  readonly error?: Error;
  readonly title?: string;
  readonly description: string;
}

const mailto = (error: Error) =>
  mailToSupport({
    subject: 'Error message on the ASAP Hub',
    body: `Dear ASAP Support,
I've come across this error and it would be great if you could address it. Thank you!

Details about the issue (please don't delete, this will help our engineers solve the issue)
${btoa(
  JSON.stringify(
    {
      error: serializeError(error),
    },
    null,
    2,
  ),
)}`,
  });

type ErrorCardProps = (
  | ErrorProps
  | TitleDescriptionProps
  | (ErrorProps & TitleDescriptionProps)
) & {
  readonly title?: string;
  readonly refreshLink?: boolean;
};

const ErrorCard: React.FC<ErrorCardProps> = ({
  error,
  title,
  description,
  refreshLink = false,
}) => {
  const history = useHistory();
  return (
    <Card padding={false} accent="red">
      <div css={styles}>
        {alertIcon}
        <span>
          <b>{title ?? 'Something went wrong!'}</b> <br />
          {description ?? error?.message}
          {refreshLink && (
            <>
              {' '}
              <Button linkStyle onClick={() => history.go(0)}>
                Please reload the page
              </Button>
              .{' '}
            </>
          )}
          {error && (
            <span>
              <br /> If the issue persists, you can{' '}
              <Link href={mailto(error)}>contact support</Link>.
            </span>
          )}
        </span>
      </div>
    </Card>
  );
};

export default ErrorCard;

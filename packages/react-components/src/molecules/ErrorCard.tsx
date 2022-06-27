import { css } from '@emotion/react';
import { serializeError } from 'serialize-error';

import { Card, Anchor, Button } from '../atoms';
import { AlertIcon } from '../icons';
import { perRem } from '../pixels';
import { mailToSupport } from '../mail';
import { clay } from '../colors';

const styles = css({
  boxSizing: 'border-box',
  maxHeight: '100%',
  padding: `${24 / perRem}em`,
  display: 'grid',
  gridColumnGap: `${12 / perRem}em`,
  gridTemplateColumns: 'min-content auto',
});

const underlineStyles = css({
  textDecoration: 'underline',
  ':hover': {
    textDecoration: 'unset',
  },
});

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

type ErrorCardProps = {
  readonly error?: Error;
  readonly description?: string;
  readonly title?: string;
  readonly refreshLink?: boolean;
};

const ErrorCard: React.FC<ErrorCardProps> = ({
  error,
  title,
  description,
  refreshLink = false,
}) => (
  <Card padding={false} accent="red">
    <div css={styles}>
      <AlertIcon color={clay.rgb} />
      <span>
        <b>{title ?? 'Something went wrong!'}</b> <br />
        {description ?? error?.message ?? 'We have encountered an error.'}
        {refreshLink && (
          <>
            {' '}
            <Button
              linkStyle
              theme={null}
              onClick={() => window.location.reload()}
            >
              Please reload the page
            </Button>
            .{' '}
          </>
        )}
        {error && (
          <span>
            <br /> If the issue persists, you can{' '}
            <Anchor href={mailto(error)}>
              <span css={underlineStyles}>contact support</span>
            </Anchor>
            .
          </span>
        )}
      </span>
    </div>
  </Card>
);

export default ErrorCard;

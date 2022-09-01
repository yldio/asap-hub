import { Button, lead, Link, mail, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import copyIcon from '../icons/copy-icon';

type EmailSectionProps = {
  readonly contactEmails: {
    email?: string;
    contact: string;
  }[];
};

const { createMailTo } = mail;
const { rem } = pixels;

const EmailSection: React.FC<EmailSectionProps> = ({ contactEmails }) => (
  <div css={css({ display: 'flex', gap: rem(24), flexDirection: 'column' })}>
    {contactEmails.map(
      ({ email, contact }) =>
        email && (
          <div
            css={css({
              display: 'grid',
              columnGap: rem(16),
              gridTemplateColumns: `${rem(40)} auto`,
            })}
            key={contact}
          >
            <Button
              overrideStyles={css({
                padding: rem(8),
                margin: 0,
                alignItems: 'center',
                boxSizing: 'border-box',
                height: rem(40),
                width: rem(40),
              })}
              onClick={() => navigator.clipboard.writeText(email)}
            >
              {copyIcon}
            </Button>
            <div>
              <h6
                css={css({
                  margin: `0 0 ${rem(8)}`,
                  fontSize: rem(14),
                  lineHeight: rem(16),

                  color: lead.rgb,
                })}
              >
                {contact}
              </h6>
              <Link href={createMailTo(email)}>{email}</Link>
            </div>
          </div>
        ),
    )}
  </div>
);

export default EmailSection;

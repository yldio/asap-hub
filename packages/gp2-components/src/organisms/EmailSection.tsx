import {
  Link,
  mail,
  pixels,
  Subtitle,
  Tooltip,
  secondaryStyles,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import copyIcon from '../icons/copy-icon';

type EmailSectionProps = {
  readonly contactEmails: {
    email?: string;
    contact: string;
  }[];
};

const { createMailTo } = mail;
const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  gap: rem(24),
  flexDirection: 'column',
});

const itemStyles = css({
  display: 'grid',
  columnGap: rem(16),
  gridTemplateColumns: `1fr ${rem(32)} 1fr`,
  alignItems: 'center',
});
const copyButtonStyles = css({
  padding: rem(8),
  margin: 0,
  outline: 'none',
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderWidth: rem(1),
  borderRadius: rem(4),
  cursor: 'pointer',
});

const EmailItem: React.FC<{ email: string; contact: string }> = ({
  email,
  contact,
}) => {
  const [tooltipShown, setTooltipShown] = useState<boolean>(false);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (tooltipShown) {
      timer = setTimeout(() => {
        setTooltipShown(false);
      }, 1000);
    }
    return () => timer && clearTimeout(timer);
  }, [tooltipShown, setTooltipShown]);
  return (
    <div
      css={css({
        display: 'flex',
        gap: rem(8),
        flexDirection: 'column',
      })}
    >
      <Subtitle noMargin accent="lead">
        {contact}
      </Subtitle>
      <div css={itemStyles} key={contact}>
        <Link href={createMailTo(email)}>{email}</Link>
        <button
          css={[secondaryStyles, copyButtonStyles]}
          onClick={() => {
            navigator.clipboard.writeText(email);
            setTooltipShown(true);
          }}
        >
          <Tooltip maxContent bottom={rem(24)} shown={tooltipShown}>
            Email copied
          </Tooltip>
          <div
            css={css({
              width: rem(16),
              height: rem(16),
            })}
          >
            {copyIcon}
          </div>
        </button>
      </div>
    </div>
  );
};

const EmailSection: React.FC<EmailSectionProps> = ({ contactEmails }) => (
  <div css={containerStyles}>
    {contactEmails.map(
      ({ email, contact }) =>
        email && <EmailItem email={email} contact={contact} key={email} />,
    )}
  </div>
);

export default EmailSection;

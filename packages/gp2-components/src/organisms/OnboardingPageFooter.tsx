import { css } from '@emotion/react';
import { logout } from '@asap-hub/routing';
import {
  Button,
  Link,
  pixels,
  usePushFromHere,
} from '@asap-hub/react-components';
import { useState } from 'react';
import { mobileQuery, nonMobileQuery } from '../layout';

const { rem } = pixels;

const footerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column-reverse',
  [nonMobileQuery]: {
    flexDirection: 'row',
  },
});
const footerEditStyles = css({
  display: 'flex',
  gap: rem(32),
  [mobileQuery]: {
    flexDirection: 'column-reverse',
    gap: rem(24),
  },
});
const signOutStyles = css({
  [mobileQuery]: {
    paddingTop: rem(24),
  },
});
const buttonWrapperStyle = css({
  width: 'fit-content',
  [mobileQuery]: {
    width: '100%',
  },
});

type OnboardingPageFooterProps = {
  isContinueEnabled: boolean;
  publishUser: () => Promise<void>;
  previousHref?: string;
  continueHref?: string;
};

const OnboardingPageFooter: React.FC<OnboardingPageFooterProps> = ({
  previousHref,
  continueHref,
  isContinueEnabled,
  publishUser,
}) => {
  const [status, setStatus] = useState<
    'initial' | 'isSaving' | 'hasError' | 'hasSaved'
  >('initial');
  const historyPush = usePushFromHere();

  // we don't have an error state design yet, so we can't test for it
  /* istanbul ignore next */
  const onPublish = async () => {
    setStatus('isSaving');
    try {
      await publishUser();
      setStatus('hasSaved');
      historyPush('/');
    } catch (e) {
      setStatus('hasError');
    }
  };
  return (
    <footer css={footerStyles}>
      <div css={signOutStyles}>
        <Link fullWidth buttonStyle noMargin href={logout({}).$}>
          Sign Out
        </Link>
      </div>
      <div css={css(footerEditStyles)}>
        <div css={buttonWrapperStyle}>
          <Link
            enabled={!!previousHref}
            fullWidth
            buttonStyle
            noMargin
            href={previousHref}
          >
            Previous
          </Link>
        </div>
        <div css={buttonWrapperStyle}>
          {continueHref ? (
            <Link
              fullWidth
              buttonStyle
              enabled={isContinueEnabled}
              noMargin
              href={continueHref}
              primary
            >
              Continue
            </Link>
          ) : (
            <Button
              noMargin
              fullWidth
              primary
              enabled={status !== 'isSaving'}
              onClick={onPublish}
            >
              Publish
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default OnboardingPageFooter;

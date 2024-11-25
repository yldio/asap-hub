import { css } from '@emotion/react';
import { useState } from 'react';
import { colors } from '..';

import {
  Button,
  CookieButton,
  Headline3,
  Link,
  Paragraph,
  Pill,
  Switch,
  useLogo,
} from '../atoms';
import { ExternalLinkIcon } from '../icons';
import { Modal } from '../molecules';
import { mobileScreen, rem } from '../pixels';

const modalStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const headerStyles = css({
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
});

const buttonMediaQuery = `@media (min-width: ${mobileScreen.max - 100}px)`;

const buttonContainerStyles = css({
  marginTop: rem(32),
  display: 'grid',
  gridTemplateRows: 'max-content',
  [buttonMediaQuery]: {
    gridTemplateColumns: 'max-content max-content',
    gridTemplateRows: 'auto',
    justifyContent: 'flex-end',
  },
});

const modalContentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(56),
  marginTop: rem(24),
});

const sectionStyles = css({
  paddingTop: 0,
  paddingBottom: 0,
});

const paragraphStyles = css({
  paddingTop: 0,
  paddingBottom: 0,
  marginTop: rem(24),
});

const consentCategoryStyles = css({
  marginTop: rem(32),
});

const essentialCategoryStyles = css({
  width: '100%',
  display: 'inline-flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const dividerStyles = css({
  paddingTop: rem(4),
  borderBottom: `1px solid ${colors.steel.rgb}`,
});

const thirdPartyCookieLinkStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(8),
});

const pillStyles = css({
  display: 'inline-flex',
  gap: rem(4),
  alignItems: 'center',
});

type ThirdPartyCookieLinkProps = {
  link: string;
  label: string;
};

const ThirdPartyCookieLink = ({ link, label }: ThirdPartyCookieLinkProps) => (
  <Link href={link}>
    <Pill>
      <span css={pillStyles}>
        {label} <ExternalLinkIcon size={16} color={colors.lead} />
      </span>
    </Pill>
  </Link>
);

type CookiesModalProps = {
  readonly cookieData?: {
    cookieId?: string;
    preferences: { essential?: boolean; analytics?: boolean };
  } | null;
  readonly onSaveCookiePreferences: (analytics: boolean) => void;
  readonly toggleCookieModal?: () => void;
  readonly isOnboardable?: boolean;
  readonly showCookieModal?: boolean;
};

const CookiesModal: React.FC<CookiesModalProps> = ({
  cookieData,
  isOnboardable,
  showCookieModal = true,
  onSaveCookiePreferences,
  toggleCookieModal,
}) => {
  const logo = useLogo();
  const [isAnalyticsConsentGiven, setIsAnalyticsConsentGiven] = useState(
    Boolean(cookieData?.preferences?.analytics),
  );

  const handleCookiePreferencesSaving = () => {
    onSaveCookiePreferences(isAnalyticsConsentGiven);
  };

  return (
    <>
      {!showCookieModal && toggleCookieModal && (
        <CookieButton
          toggleCookieModal={toggleCookieModal}
          isOnboardable={isOnboardable}
        />
      )}
      {showCookieModal && (
        <Modal padding={false}>
          <div css={modalStyles}>
            <header css={headerStyles}>{logo}</header>
            <div css={modalContentStyles}>
              <div css={sectionStyles}>
                <Headline3 noMargin>Privacy Preference Center</Headline3>

                <Paragraph noMargin accent="lead" styles={paragraphStyles}>
                  When you visit our website, it may store or retrieve data in
                  your browser. This storage is often necessary for the basic
                  functionality of the website and also for analytics. Privacy
                  is important to us, so you have the option of enabling certain
                  types of storage that may not be necessary for the basic
                  functioning of the website.
                </Paragraph>
              </div>
              <div css={sectionStyles}>
                <Headline3 noMargin>
                  Manage Consent Preferences by Category
                </Headline3>
                <div css={consentCategoryStyles}>
                  <div>
                    <Paragraph noMargin>
                      <span css={essentialCategoryStyles}>
                        <strong>Essential</strong>
                        <span css={css({ color: colors.lead.rgb })}>
                          <strong>Always Active</strong>
                        </span>
                      </span>
                    </Paragraph>
                    <Paragraph accent="lead">
                      These items are required to enable basic website
                      functionality.
                    </Paragraph>
                  </div>

                  <div css={dividerStyles} />
                  <div>
                    <Paragraph>
                      <span css={essentialCategoryStyles}>
                        <strong>Analytics</strong>
                        <Switch
                          checked={isAnalyticsConsentGiven}
                          onClick={() =>
                            setIsAnalyticsConsentGiven(
                              (prevValue) => !prevValue,
                            )
                          }
                        />
                      </span>
                    </Paragraph>
                    <Paragraph accent="lead">
                      These items help the website operator understand how its
                      website performs, how visitors interact with the site, and
                      whether there may be technical issues. This storage type
                      usually doesn’t collect information that identifies a
                      visitor.
                    </Paragraph>
                    <div css={thirdPartyCookieLinkStyles}>
                      <ThirdPartyCookieLink
                        link="https://business.safety.google/privacy/"
                        label="Google Advertising Products"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div css={buttonContainerStyles}>
              <Button
                primary
                enabled
                noMargin
                onClick={handleCookiePreferencesSaving}
                overrideStyles={css({ width: 'fit-content' })}
              >
                Save and close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CookiesModal;

import { useState } from 'react';
import { css } from '@emotion/react';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';
import {
  UrlExpression,
  USER_SOCIAL_RESEARCHER_ID,
  USER_SOCIAL_NOT_URL,
} from '@asap-hub/validation';

import { LabeledTextField } from '../molecules';
import { noop } from '../utils';
import { charcoal } from '../colors';
import { EditModal } from '../organisms';
import { perRem, smallDesktopScreen, tabletScreen } from '../pixels';
import { globeIcon } from '../icons';
import { Headline4, Link } from '../atoms';
import { mailToSupport } from '../mail';

const fieldsContainerStyles = css({
  display: 'grid',
  columnGap: `${24 / perRem}em`,
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr',
    rowGap: `${12 / perRem}em`,
  },
});
const paddingStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    paddingBottom: `${12 / perRem}em`,
  },
});

type ContactInfoModalProps = {
  readonly email?: string;

  readonly fallbackEmail: string;

  readonly backHref: string;
  readonly onSave?: (data: UserPatchRequest) => void | Promise<void>;
} & Pick<UserResponse, 'social'>;
const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  email = '',
  fallbackEmail,
  social: {
    website1 = '',
    website2 = '',
    orcid = '',
    github = '',
    linkedIn = '',
    googleScholar = '',
    researchGate = '',
    researcherId = '',
    twitter = '',
  } = {},

  backHref,
  onSave = noop,
}) => {
  const [newEmail, setNewEmail] = useState(email);
  const [newWebsite1, setNewWebsite1] = useState(website1);
  const [newWebsite2, setNewWebsite2] = useState(website2);
  const [newOrcid, setNewOrcid] = useState(orcid);
  const [newGithub, setNewGithub] = useState(github);
  const [newLinkedIn, setNewLinkedIn] = useState(linkedIn);
  const [newGoogleScholar, setNewGoogleScholar] = useState(googleScholar);
  const [newResearchGate, setNewResearchGate] = useState(researchGate);
  const [newResearcherId, setNewResearcherId] = useState(researcherId);
  const [newTwitter, setNewTwitter] = useState(twitter);

  return (
    <EditModal
      backHref={backHref}
      title="Your contact details"
      dirty={newEmail !== email}
      onSave={() =>
        onSave({
          contactEmail: newEmail || undefined,
          social: {
            twitter: newTwitter || undefined,
            researcherId: newResearcherId || undefined,
            researchGate: newResearchGate || undefined,
            github: newGithub || undefined,
            googleScholar: newGoogleScholar || undefined,
            linkedIn: newLinkedIn || undefined,
            website1: newWebsite1 || undefined,
            website2: newWebsite2 || undefined,
          },
        })
      }
    >
      {({ isSaving }) => (
        <>
          <div css={paddingStyles}>
            <LabeledTextField
              type="email"
              value={newEmail}
              onChange={setNewEmail}
              enabled={!isSaving}
              title="Contact email"
              subtitle="(Optional)"
              description={
                <>
                  People in the ASAP Network will contact you using{' '}
                  <strong css={{ color: charcoal.rgb }}>{fallbackEmail}</strong>
                  . To use a different correspondence email address, please add
                  it below.
                </>
              }
              hint="Note: This will not affect the way you login into the Hub."
            />
          </div>
          <div css={[fieldsContainerStyles, paddingStyles]}>
            <LabeledTextField
              title="Website 1"
              subtitle="(Optional)"
              pattern={UrlExpression}
              getValidationMessage={() =>
                'Please enter a valid URL, starting with http://'
              }
              onChange={setNewWebsite1}
              value={newWebsite1}
              enabled={!isSaving}
              labelIndicator={globeIcon}
              placeholder="https://example.com"
            />
            <LabeledTextField
              title="Website 2"
              subtitle="(Optional)"
              pattern={UrlExpression}
              getValidationMessage={() =>
                'Please enter a valid URL, starting with http://'
              }
              onChange={setNewWebsite2}
              value={newWebsite2}
              enabled={!isSaving}
              labelIndicator={globeIcon}
              placeholder="https://example.com"
            />
          </div>
          <Headline4 styleAsHeading={3}>Social Networks</Headline4>
          <div css={fieldsContainerStyles}>
            <LabeledTextField
              hint={
                <>
                  To change your ORCID please{' '}
                  <Link
                    href={mailToSupport({
                      subject: `Orcid change for "${orcid}"`,
                    })}
                  >
                    contact ASAP
                  </Link>
                </>
              }
              title="ORCID"
              onChange={setNewOrcid}
              value={newOrcid}
              enabled={false}
              labelIndicator="orcid.org/"
              placeholder="xxxx-xxxx-xxxx-xxxx"
            />
            <LabeledTextField
              title="ResearcherID"
              subtitle="(Optional)"
              pattern={USER_SOCIAL_RESEARCHER_ID.source}
              getValidationMessage={() => 'Please enter a valid ResearcherID'}
              onChange={setNewResearcherId}
              value={newResearcherId}
              enabled={!isSaving}
              labelIndicator="researchid.com/rid/"
              placeholder="x-xxxx-xxxx"
            />
            <LabeledTextField
              title="Twitter"
              subtitle="(Optional)"
              pattern={USER_SOCIAL_NOT_URL.source}
              getValidationMessage={() => 'Please enter a valid Twitter handle'}
              onChange={setNewTwitter}
              value={newTwitter}
              enabled={!isSaving}
              labelIndicator="@"
              placeholder="twitterhandle"
            />
            <LabeledTextField
              title="Github"
              subtitle="(Optional)"
              pattern={USER_SOCIAL_NOT_URL.source}
              getValidationMessage={() =>
                'Please enter a valid Github username'
              }
              onChange={setNewGithub}
              value={newGithub}
              enabled={!isSaving}
              labelIndicator="github.com/"
              placeholder="username"
            />
            <LabeledTextField
              title="LinkedIn"
              subtitle="(Optional)"
              pattern={USER_SOCIAL_NOT_URL.source}
              getValidationMessage={() =>
                'Please enter a valid LinkedIn username'
              }
              onChange={setNewLinkedIn}
              value={newLinkedIn}
              enabled={!isSaving}
              labelIndicator="linkedin.com/in/"
              placeholder="username"
            />
            <LabeledTextField
              title="Researchgate"
              subtitle="(Optional)"
              pattern={USER_SOCIAL_NOT_URL.source}
              getValidationMessage={() =>
                'Please enter a valid Research Gate Profile ID'
              }
              onChange={setNewResearchGate}
              value={newResearchGate}
              enabled={!isSaving}
              labelIndicator="researchgate.net/profile/"
              placeholder="profileID"
            />
          </div>
          <LabeledTextField
            title="Google Scholar"
            subtitle="(Optional)"
            pattern={USER_SOCIAL_NOT_URL.source}
            getValidationMessage={() =>
              'Please enter a valid Google Scholar Profile ID'
            }
            onChange={setNewGoogleScholar}
            value={newGoogleScholar}
            enabled={!isSaving}
            labelIndicator="scholar.google.com/citations?user="
            placeholder="profileID"
          />
        </>
      )}
    </EditModal>
  );
};

export default ContactInfoModal;

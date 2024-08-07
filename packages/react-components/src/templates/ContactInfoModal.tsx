import { UserPatchRequest, UserResponse } from '@asap-hub/model';
import { urlExpression, USER_SOCIAL_RESEARCHER_ID } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { FunctionComponent, useState } from 'react';

import { Headline4, Link } from '../atoms';
import { charcoal, lead } from '../colors';
import {
  GithubIcon,
  GlobeIcon,
  GoogleScholarIcon,
  LinkedInIcon,
  OrcidSocialIcon,
  ResearcherIdIcon,
  ResearchGateIcon,
  XIcon,
} from '../icons';
import { mailToSupport } from '../mail';
import { LabeledTextField } from '../molecules';
import { EditUserModal } from '../organisms';
import { rem } from '../pixels';
import { formatUserSocial, noop } from '../utils';

const iconStyles = css({
  width: 24,
  display: 'inline-flex',
  textAlign: 'center',
  alignItems: 'center',
});

const socialsHeadlineStyles = css({ padding: `${rem(34)} 0 ${rem(8)}` });

const iconCSS = css({
  '& > svg > path:first-of-type': { fill: 'transparent' },
});

const wrapIcon = (
  Icon: FunctionComponent<{ color?: string }>,
  adjustBackground?: boolean,
) => (
  <span css={[iconStyles, adjustBackground ? iconCSS : {}]}>
    <Icon color={lead.hex} />
  </span>
);

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
    <EditUserModal
      backHref={backHref}
      title="Contact Details"
      dirty={newEmail !== email}
      onSave={() =>
        onSave({
          contactEmail: newEmail || undefined,
          social: {
            twitter: formatUserSocial(newTwitter, 'twitter') || undefined,
            researcherId: newResearcherId || undefined,
            researchGate:
              formatUserSocial(newResearchGate, 'researchGate') || undefined,
            github: formatUserSocial(newGithub, 'github') || undefined,
            googleScholar:
              formatUserSocial(newGoogleScholar, 'googleScholar') || undefined,
            linkedIn: formatUserSocial(newLinkedIn, 'linkedIn') || undefined,
            website1: newWebsite1 || undefined,
            website2: newWebsite2 || undefined,
          },
        })
      }
    >
      {({ isSaving }) => (
        <div>
          <LabeledTextField
            type="email"
            value={newEmail}
            onChange={setNewEmail}
            enabled={!isSaving}
            title="Contact email"
            subtitle="(optional)"
            description={
              <>
                People in the ASAP Network will contact you using{' '}
                <strong css={{ color: charcoal.rgb }}>{fallbackEmail}</strong>.
                To use a different correspondence email address, please add it
                below.
              </>
            }
            hint="Note: This will not affect the way you login into the Hub."
          />
          <LabeledTextField
            title="Website 1"
            subtitle="(optional)"
            pattern={urlExpression}
            getValidationMessage={() =>
              'Please enter a valid URL, starting with http://'
            }
            onChange={setNewWebsite1}
            value={newWebsite1}
            enabled={!isSaving}
            labelIndicator={<GlobeIcon />}
            placeholder="https://example.com"
          />
          <LabeledTextField
            title="Website 2"
            subtitle="(optional)"
            pattern={urlExpression}
            getValidationMessage={() =>
              'Please enter a valid URL, starting with http://'
            }
            onChange={setNewWebsite2}
            value={newWebsite2}
            enabled={!isSaving}
            labelIndicator={<GlobeIcon />}
            placeholder="https://example.com"
          />
          <div css={socialsHeadlineStyles}>
            <Headline4 styleAsHeading={3}>Social Networks</Headline4>
          </div>
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
            labelIndicator={wrapIcon(OrcidSocialIcon)}
            placeholder="0000-0000-0000-0000"
          />
          <LabeledTextField
            title="Researcher ID"
            subtitle="(optional)"
            description="Type your Researcher ID."
            pattern={USER_SOCIAL_RESEARCHER_ID.source}
            getValidationMessage={() => 'Please enter a valid Researcher ID'}
            onChange={setNewResearcherId}
            value={newResearcherId}
            enabled={!isSaving}
            labelIndicator={wrapIcon(ResearcherIdIcon, true)}
            placeholder="0-0000-0000"
          />
          <LabeledTextField
            title="X"
            subtitle="(optional)"
            description="Type your X (formerly Twitter) profile URL."
            onChange={setNewTwitter}
            value={newTwitter}
            enabled={!isSaving}
            labelIndicator={wrapIcon(XIcon)}
            placeholder="https://twitter.com/yourprofilename"
          />
          <LabeledTextField
            title="Github"
            subtitle="(optional)"
            description="Type your Github profile URL."
            onChange={setNewGithub}
            value={newGithub}
            enabled={!isSaving}
            labelIndicator={wrapIcon(GithubIcon, true)}
            placeholder="https://github.com/yourprofilename"
          />
          <LabeledTextField
            title="LinkedIn"
            subtitle="(optional)"
            description="Type your LinkedIn profile URL."
            onChange={setNewLinkedIn}
            value={newLinkedIn}
            enabled={!isSaving}
            labelIndicator={wrapIcon(LinkedInIcon, true)}
            placeholder="https://www.linkedin.com/in/yourprofilename"
          />
          <LabeledTextField
            title="Research Gate"
            subtitle="(optional)"
            description="Type your Research Gate profile URL."
            onChange={setNewResearchGate}
            value={newResearchGate}
            enabled={!isSaving}
            labelIndicator={wrapIcon(ResearchGateIcon, true)}
            placeholder="https://www.researchgate.net/profile/profileID"
          />
          <LabeledTextField
            title="Google Scholar"
            subtitle="(optional)"
            description="Type your Google Scholar profile URL."
            onChange={setNewGoogleScholar}
            value={newGoogleScholar}
            enabled={!isSaving}
            labelIndicator={wrapIcon(GoogleScholarIcon, true)}
            placeholder="https://scholar.google.com/citations?user=profileID"
          />
        </div>
      )}
    </EditUserModal>
  );
};

export default ContactInfoModal;

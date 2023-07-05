import { gp2 } from '@asap-hub/model';
import {
  GlobeIcon,
  Headline4,
  LabeledTextField,
  OrcidIcon,
  Paragraph,
  ResearcherIdIcon,
} from '@asap-hub/react-components';
import { urlExpression, USER_SOCIAL_NOT_URL } from '@asap-hub/validation';
import { ComponentProps, useState } from 'react';
import colors from '../templates/colors';
import EditUserModal from './EditUserModal';

type ExternalProfilesModalProps = Pick<gp2.UserResponse, 'social'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
  };

const baseUrls = {
  orcid: 'https://orcid.org/',
  researcherId: 'https://researcherid.com/rid/',
};

const isPropDirty = (
  initialValue: string | undefined,
  inputValue: string,
  baseUrl = '',
) =>
  (!initialValue && inputValue !== '') ||
  (!!initialValue && initialValue !== `${baseUrl}${inputValue}`);

const ExternalProfilesModal: React.FC<ExternalProfilesModalProps> = ({
  onSave,
  backHref,
  social,
}) => {
  const [newGoogleScholar, setGoogleScholar] = useState<string>(
    social?.googleScholar || '',
  );
  const [newOrcid, setOrcid] = useState<string>(
    social?.orcid?.split(baseUrls.orcid)[1] || '',
  );
  const [newResearchGate, setResearchGate] = useState<string>(
    social?.researchGate || '',
  );
  const [newResearcherId, setResearcherId] = useState<string>(
    social?.researcherId?.split(baseUrls.researcherId)[1] || '',
  );
  const [newBlog, setBlog] = useState<string>(social?.blog || '');
  const [newTwitter, setTwitter] = useState<string>(social?.twitter || '');
  const [newLinkedIn, setLinkedIn] = useState<string>(social?.linkedIn || '');
  const [newGithub, setGithub] = useState<string>(social?.github || '');

  const checkDirty = () =>
    isPropDirty(social?.googleScholar, newGoogleScholar) ||
    isPropDirty(social?.orcid, newOrcid, baseUrls.orcid) ||
    isPropDirty(social?.researchGate, newResearchGate) ||
    isPropDirty(social?.researcherId, newResearcherId, baseUrls.researcherId) ||
    isPropDirty(social?.blog, newBlog) ||
    isPropDirty(social?.twitter, newTwitter) ||
    isPropDirty(social?.linkedIn, newLinkedIn) ||
    isPropDirty(social?.github, newGithub);

  return (
    <EditUserModal
      title="External Profiles"
      description=""
      onSave={() =>
        onSave({
          social: {
            ...(newGoogleScholar ? { googleScholar: newGoogleScholar } : {}),
            ...(newOrcid ? { orcid: `${baseUrls.orcid}${newOrcid}` } : {}),
            ...(newResearchGate ? { researchGate: newResearchGate } : {}),
            ...(newResearcherId
              ? { researcherId: `${baseUrls.researcherId}${newResearcherId}` }
              : {}),
            ...(newBlog ? { blog: newBlog } : {}),
            ...(newTwitter ? { twitter: newTwitter } : {}),
            ...(newLinkedIn ? { linkedIn: newLinkedIn } : {}),
            ...(newGithub ? { github: newGithub } : {}),
          },
        })
      }
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <>
          <header>
            <Headline4 styleAsHeading={3}>Research Networks</Headline4>
            <Paragraph accent="lead">
              Share external profiles that are relevant to your work.
            </Paragraph>
          </header>
          <LabeledTextField
            title="Google Scholar"
            subtitle="(optional)"
            description="Type your Google Scholar profile URL."
            pattern={urlExpression}
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newGoogleScholar}
            onChange={setGoogleScholar}
          />
          <LabeledTextField
            title="ORCID"
            subtitle="(optional)"
            description="Type your ORCID ID."
            labelIndicator={
              <span css={{ width: 24, display: 'inline-flex' }}>
                <OrcidIcon color={colors.neutral900.rgba} />
              </span>
            }
            pattern={USER_SOCIAL_NOT_URL.source}
            placeholder="0000-0000-0000-0000"
            enabled={!isSaving}
            value={newOrcid}
            onChange={setOrcid}
          />
          <LabeledTextField
            title="Research Gate"
            subtitle="(optional)"
            description="Type your Research Gate profile URL."
            pattern={urlExpression}
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newResearchGate}
            onChange={setResearchGate}
          />
          <LabeledTextField
            title="ResearcherID"
            subtitle="(optional)"
            description="Type your Researcher ID."
            pattern={USER_SOCIAL_NOT_URL.source}
            labelIndicator={
              <span
                css={{
                  display: 'inline-flex',
                  height: 24,
                  '& > svg > path:first-of-type': { fill: 'transparent' },
                }}
              >
                <ResearcherIdIcon color={colors.neutral900.rgba} />
              </span>
            }
            placeholder="0-0000-0000"
            enabled={!isSaving}
            value={newResearcherId}
            onChange={setResearcherId}
          />
          <header>
            <Headline4 styleAsHeading={3}>Social Networks</Headline4>
            <Paragraph accent="lead">
              Share external profiles that are relevant to your profession.
            </Paragraph>
          </header>
          <LabeledTextField
            title="Blog"
            subtitle="(optional)"
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            pattern={urlExpression}
            enabled={!isSaving}
            value={newBlog}
            onChange={setBlog}
          />
          <LabeledTextField
            title="Twitter"
            subtitle="(optional)"
            description="Type your Twitter profile URL."
            pattern={urlExpression}
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newTwitter}
            onChange={setTwitter}
          />
          <LabeledTextField
            title="LinkedIn"
            subtitle="(optional)"
            description="Type your LinkedIn profile URL."
            pattern={urlExpression}
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newLinkedIn}
            onChange={setLinkedIn}
          />
          <LabeledTextField
            title="Github"
            subtitle="(optional)"
            description="Type your Github profile URL."
            pattern={urlExpression}
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newGithub}
            onChange={setGithub}
          />
        </>
      )}
    </EditUserModal>
  );
};

export default ExternalProfilesModal;

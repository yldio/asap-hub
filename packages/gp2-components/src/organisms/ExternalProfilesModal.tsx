import { gp2 } from '@asap-hub/model';
import {
  GlobeIcon,
  Headline4,
  LabeledTextField,
  OrcidIcon,
  Paragraph,
  ResearcherIdIcon,
} from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import colors from '../templates/colors';
import EditUserModal from './EditUserModal';

type ExternalProfilesModalProps = Pick<gp2.UserResponse, 'social'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
  };

const baseUrl = {
  orcid: 'https://orcid.com/rid',
  researcherId: 'https://researcherid.com/rid/',
};

const ExternalProfilesModal: React.FC<ExternalProfilesModalProps> = ({
  onSave,
  backHref,
  social,
}) => {
  const [newGoogleScholar, setGoogleScholar] = useState<string>(
    social?.googleScholar || '',
  );
  const [newOrcid, setOrcid] = useState<string>(social?.orcid || '');
  const [newResearchGate, setResearchGate] = useState<string>(
    social?.researchGate || '',
  );
  const [newResearcherId, setResearcherId] = useState<string>(
    social?.researcherId || '',
  );
  const [newBlog, setBlog] = useState<string>(social?.blog || '');
  const [newTwitter, setTwitter] = useState<string>(social?.twitter || '');
  const [newLinkedIn, setLinkedIn] = useState<string>(social?.linkedIn || '');
  const [newGithub, setGithub] = useState<string>(social?.github || '');

  const checkDirty = () =>
    (!social?.googleScholar && newGoogleScholar !== '') ||
    social?.googleScholar !== newGoogleScholar ||
    (!social?.orcid && newOrcid !== '') ||
    social?.orcid !== newOrcid ||
    (!social?.researchGate && newResearchGate !== '') ||
    social?.researchGate !== newResearchGate ||
    (!social?.researcherId && newResearcherId !== '') ||
    social?.researcherId !== newResearcherId ||
    (!social?.blog && newBlog !== '') ||
    social?.blog !== newBlog ||
    (!social?.twitter && newTwitter !== '') ||
    social?.twitter !== newTwitter ||
    (!social?.linkedIn && newLinkedIn !== '') ||
    social?.linkedIn !== newLinkedIn ||
    (!social?.github && newGithub !== '') ||
    social?.github !== newGithub;

  return (
    <EditUserModal
      title="External Profiles"
      description=""
      onSave={() =>
        onSave({
          social: {
            googleScholar: newGoogleScholar,
            orcid: newOrcid || undefined,
            researchGate: newResearchGate || undefined,
            researcherId: newResearcherId || undefined,
            blog: newBlog || undefined,
            twitter: newTwitter || undefined,
            linkedIn: newLinkedIn || undefined,
            github: newGithub || undefined,
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
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newGoogleScholar}
            onChange={(val) => setGoogleScholar(val)}
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
            placeholder="0000-0000-0000-0000"
            enabled={!isSaving}
            value={newOrcid ? newOrcid.split(baseUrl.orcid)[1] : ''}
            onChange={(val) => setOrcid(`${baseUrl.orcid}${val}`)}
          />
          <LabeledTextField
            title="Research Gate"
            subtitle="(optional)"
            description="Type your Research Gate profile URL."
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newResearchGate}
            onChange={(val) => setResearchGate(val)}
          />
          <LabeledTextField
            title="ResearcherID"
            subtitle="(optional)"
            description="Type your Researcher ID."
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
            value={
              newResearcherId
                ? newResearcherId.split(baseUrl.researcherId)[1]
                : ''
            }
            onChange={(val) => setResearcherId(`${baseUrl.researcherId}${val}`)}
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
            enabled={!isSaving}
            value={newBlog}
            onChange={setBlog}
          />
          <LabeledTextField
            title="Twitter"
            subtitle="(optional)"
            description="Type your Twitter profile URL."
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newTwitter}
            onChange={(val) => setTwitter(val)}
          />
          <LabeledTextField
            title="LinkedIn"
            subtitle="(optional)"
            description="Type your LinkedIn profile URL."
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newLinkedIn}
            onChange={(val) => setLinkedIn(val)}
          />
          <LabeledTextField
            title="Github"
            subtitle="(optional)"
            description="Type your Github profile URL."
            labelIndicator={<GlobeIcon />}
            placeholder="https://www.example.com"
            enabled={!isSaving}
            value={newGithub}
            onChange={(val) => setGithub(val)}
          />
        </>
      )}
    </EditUserModal>
  );
};

export default ExternalProfilesModal;

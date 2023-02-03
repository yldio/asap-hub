import { gp2 } from '@asap-hub/model';
import {
  GlobeIcon,
  Headline4,
  LabeledTextField,
  Paragraph,
} from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import EditUserModal from './EditUserModal';

type ExternalProfilesModalProps = Pick<gp2.UserResponse, 'social'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
  };

const prefixes = {
  googleScholar: 'scholar.google.com/citations?user=',
  orcid: 'orcid.com/rid',
  researchGate: 'researchid.com/rid/',
  researcherId: 'researchid.com/rid/',
  blog: 'globeIcon',
  twitter: '@',
  linkedIn: 'linkedin.com/in/',
  github: 'github.com/',
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
    social?.googleScholar !== newGoogleScholar ||
    social?.orcid !== newOrcid ||
    social?.researchGate !== newResearchGate ||
    social?.researcherId !== newResearcherId ||
    social?.blog !== newBlog ||
    social?.twitter !== newTwitter ||
    social?.linkedIn !== newLinkedIn ||
    social?.github !== newGithub;

  return (
    <EditUserModal
      title="External Profiles"
      description=""
      onSave={() =>
        onSave({
          social: {
            googleScholar: newGoogleScholar,
            orcid: newOrcid,
            researchGate: newResearchGate,
            researcherId: newResearcherId,
            blog: newBlog,
            twitter: newTwitter,
            linkedIn: newLinkedIn,
            github: newGithub,
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
            labelIndicator={prefixes.googleScholar}
            placeholder="profileID"
            enabled={!isSaving}
            value={
              newGoogleScholar
                ? newGoogleScholar.split(prefixes.googleScholar)[1]
                : ''
            }
            onChange={(val) =>
              setGoogleScholar(`https://${prefixes.googleScholar}${val}`)
            }
          />
          <LabeledTextField
            title="ORCID"
            subtitle="(optional)"
            labelIndicator={prefixes.orcid}
            placeholder="xxxx-xxxx-xxxx-xxxx"
            enabled={!isSaving}
            value={newOrcid ? newOrcid.split(prefixes.orcid)[1] : ''}
            onChange={(val) => setOrcid(`https://${prefixes.orcid}${val}`)}
          />
          <LabeledTextField
            title="Research Gate"
            subtitle="(optional)"
            labelIndicator={prefixes.researchGate}
            placeholder="xxxx-xxxx-xxxx"
            enabled={!isSaving}
            value={
              newResearchGate
                ? newResearchGate.split(prefixes.researchGate)[1]
                : ''
            }
            onChange={(val) =>
              setResearchGate(`https://${prefixes.researchGate}${val}`)
            }
          />
          <LabeledTextField
            title="ResearcherID"
            subtitle="(optional)"
            labelIndicator={prefixes.researcherId}
            placeholder="xxxx-xxxx-xxxx"
            enabled={!isSaving}
            value={
              newResearcherId
                ? newResearcherId.split(prefixes.researcherId)[1]
                : ''
            }
            onChange={(val) =>
              setResearcherId(`https://${prefixes.researcherId}${val}`)
            }
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
            value={newBlog ? newBlog : ''}
            onChange={setBlog}
          />
          <LabeledTextField
            title="Twitter"
            subtitle="(optional)"
            labelIndicator="@"
            placeholder="twitterhandle"
            enabled={!isSaving}
            value={newTwitter ? newTwitter.split(prefixes.twitter)[1] : ''}
            onChange={(val) => setTwitter(`https://${prefixes.twitter}${val}`)}
          />
          <LabeledTextField
            title="LinkedIn"
            subtitle="(optional)"
            labelIndicator={prefixes.linkedIn}
            placeholder="username"
            enabled={!isSaving}
            value={newLinkedIn ? newLinkedIn.split(prefixes.linkedIn)[1] : ''}
            onChange={(val) =>
              setLinkedIn(`https://${prefixes.linkedIn}${val}`)
            }
          />
          <LabeledTextField
            title="Github"
            subtitle="(optional)"
            labelIndicator={prefixes.github}
            placeholder="username"
            enabled={!isSaving}
            value={newGithub ? newGithub.split(prefixes.github)[1] : ''}
            onChange={(val) => setGithub(`https://${prefixes.github}${val}`)}
          />
        </>
      )}
    </EditUserModal>
  );
};

export default ExternalProfilesModal;

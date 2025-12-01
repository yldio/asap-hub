import { ProjectDetailOverview } from '@asap-hub/react-components';
import { OriginalGrantInfo, SupplementGrantInfo } from '@asap-hub/model';

export default {
  title: 'Organisms / Project Detail Overview',
  component: ProjectDetailOverview,
};

const originalGrantData: OriginalGrantInfo = {
  originalGrant: "Understanding the Genetic Basis of Parkinson's Disease",
  proposalId: 'https://example.com/proposal-original.pdf',
};

const supplementGrantData: SupplementGrantInfo = {
  grantTitle: "Expanded Analysis of Parkinson's Disease Genetic Markers",
  grantDescription:
    'Building upon our initial findings, this supplement grant extends our research to include additional cohorts from underrepresented populations. We will conduct deep sequencing analysis on 2,000 new samples and perform functional validation of candidate genes identified in the original study. This expansion enables us to better understand genetic diversity in disease susceptibility and progression.',
  grantProposalId: 'https://example.com/proposal-supplement.pdf',
};

export const WithOriginalGrantOnly = () => (
  <ProjectDetailOverview originalGrant={originalGrantData} />
);

export const WithSupplementGrant = () => (
  <ProjectDetailOverview
    originalGrant={originalGrantData}
    supplementGrant={supplementGrantData}
  />
);

export const WithoutProposalLinks = () => (
  <ProjectDetailOverview
    originalGrant={{
      originalGrant: originalGrantData.originalGrant,
      proposalId: originalGrantData.proposalId,
    }}
  />
);

export const WithSupplementGrantNoProposalLinks = () => (
  <ProjectDetailOverview
    originalGrant={{
      originalGrant: originalGrantData.originalGrant,
    }}
    supplementGrant={{
      grantTitle: supplementGrantData.grantTitle,
      grantDescription: supplementGrantData.grantDescription,
    }}
  />
);

export const ShortDescription = () => (
  <ProjectDetailOverview
    originalGrant={{
      originalGrant: 'Brief Research Study',
      proposalId: 'https://example.com/proposal.pdf',
    }}
  />
);

export const LongDescription = () => (
  <ProjectDetailOverview
    originalGrant={{
      originalGrant:
        'Comprehensive Multi-Year Research Initiative, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
      proposalId: 'https://example.com/proposal-long.pdf',
    }}
  />
);

export const RealWorldExample = () => (
  <ProjectDetailOverview
    originalGrant={{
      originalGrant:
        'Molecular Mechanisms of Alpha-Synuclein Aggregation in PD',
      proposalId: 'https://example.com/proposals/alpha-synuclein-study.pdf',
    }}
    supplementGrant={{
      grantTitle: 'Extension: Cell-to-Cell Transmission of Alpha-Synuclein',
      grantDescription:
        'Recent evidence suggests that misfolded alpha-synuclein can spread between cells in a prion-like manner, contributing to disease progression. This supplement extends our original research to investigate the mechanisms of protein transmission and develop strategies to block this process. We will establish novel cellular models, conduct live-cell imaging studies, and test candidate therapeutic compounds that may prevent protein spreading.',
      grantProposalId:
        'https://example.com/proposals/alpha-synuclein-extension.pdf',
    }}
  />
);

export const SupplementGrantOnlyHasProposal = () => (
  <ProjectDetailOverview
    originalGrant={{
      originalGrant: originalGrantData.originalGrant,
    }}
    supplementGrant={{
      grantTitle: supplementGrantData.grantTitle,
      grantDescription: supplementGrantData.grantDescription,
      grantProposalId: supplementGrantData.grantProposalId,
    }}
  />
);

export const OriginalGrantOnlyHasProposal = () => (
  <ProjectDetailOverview
    originalGrant={{
      originalGrant: originalGrantData.originalGrant,
      proposalId: 'https://example.com/proposal-original-only.pdf',
    }}
    supplementGrant={{
      grantTitle: supplementGrantData.grantTitle,
      grantDescription: supplementGrantData.grantDescription,
    }}
  />
);

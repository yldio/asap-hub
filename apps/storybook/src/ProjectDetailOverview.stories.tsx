import { ProjectDetailOverview } from '@asap-hub/react-components';
import { GrantInfo } from '@asap-hub/model';

export default {
  title: 'Organisms / Project Detail Overview',
  component: ProjectDetailOverview,
};

const originalGrantData: GrantInfo = {
  title: "Understanding the Genetic Basis of Parkinson's Disease",
  description:
    "This comprehensive research project aims to identify novel genetic markers associated with Parkinson's disease through whole-genome sequencing of diverse patient populations. The study will analyze samples from over 5,000 participants across multiple demographic groups to understand disease progression patterns and potential therapeutic targets. Our multidisciplinary team will employ cutting-edge bioinformatics tools and collaborate with leading research institutions worldwide.",
  proposalURL: 'https://example.com/proposal-original.pdf',
};

const supplementGrantData: GrantInfo = {
  title: "Expanded Analysis of Parkinson's Disease Genetic Markers",
  description:
    'Building upon our initial findings, this supplement grant extends our research to include additional cohorts from underrepresented populations. We will conduct deep sequencing analysis on 2,000 new samples and perform functional validation of candidate genes identified in the original study. This expansion enables us to better understand genetic diversity in disease susceptibility and progression.',
  proposalURL: 'https://example.com/proposal-supplement.pdf',
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
      title: originalGrantData.title,
      description: originalGrantData.description,
    }}
  />
);

export const WithSupplementGrantNoProposalLinks = () => (
  <ProjectDetailOverview
    originalGrant={{
      title: originalGrantData.title,
      description: originalGrantData.description,
    }}
    supplementGrant={{
      title: supplementGrantData.title,
      description: supplementGrantData.description,
    }}
  />
);

export const ShortDescription = () => (
  <ProjectDetailOverview
    originalGrant={{
      title: 'Brief Research Study',
      description:
        'A short and concise description of the research project objectives.',
      proposalURL: 'https://example.com/proposal.pdf',
    }}
  />
);

export const LongDescription = () => (
  <ProjectDetailOverview
    originalGrant={{
      title: 'Comprehensive Multi-Year Research Initiative',
      description:
        'This extensive research initiative represents a groundbreaking effort to understand the complex interplay between genetic, environmental, and lifestyle factors in neurodegenerative diseases. Over the course of five years, our international consortium will leverage advanced genomic technologies, including single-cell RNA sequencing, CRISPR-based functional screens, and artificial intelligence-driven pattern recognition to identify novel therapeutic targets. The study encompasses multiple work packages: (1) Large-scale genomic analysis of patient cohorts, (2) Functional validation in cellular and animal models, (3) Development of predictive biomarkers, (4) Translation of findings into clinical trial design, and (5) Community engagement and patient advocacy integration. Our multidisciplinary team brings together expertise from genetics, neurology, bioinformatics, clinical research, and patient advocacy to ensure comprehensive and impactful outcomes.',
      proposalURL: 'https://example.com/proposal-long.pdf',
    }}
  />
);

export const RealWorldExample = () => (
  <ProjectDetailOverview
    originalGrant={{
      title: 'Molecular Mechanisms of Alpha-Synuclein Aggregation in PD',
      description:
        "Parkinson's disease (PD) is characterized by the accumulation of misfolded alpha-synuclein protein in dopaminergic neurons. This project investigates the molecular mechanisms underlying alpha-synuclein aggregation and its role in neurodegeneration. We will use advanced imaging techniques, biochemical assays, and patient-derived induced pluripotent stem cells (iPSCs) to understand how specific mutations affect protein folding and cellular toxicity. Expected outcomes include identification of therapeutic intervention points and development of novel biomarkers for early disease detection.",
      proposalURL: 'https://example.com/proposals/alpha-synuclein-study.pdf',
    }}
    supplementGrant={{
      title: 'Extension: Cell-to-Cell Transmission of Alpha-Synuclein',
      description:
        'Recent evidence suggests that misfolded alpha-synuclein can spread between cells in a prion-like manner, contributing to disease progression. This supplement extends our original research to investigate the mechanisms of protein transmission and develop strategies to block this process. We will establish novel cellular models, conduct live-cell imaging studies, and test candidate therapeutic compounds that may prevent protein spreading.',
      proposalURL:
        'https://example.com/proposals/alpha-synuclein-extension.pdf',
    }}
  />
);

export const SupplementGrantOnlyHasProposal = () => (
  <ProjectDetailOverview
    originalGrant={{
      title: originalGrantData.title,
      description: originalGrantData.description,
    }}
    supplementGrant={{
      title: supplementGrantData.title,
      description: supplementGrantData.description,
      proposalURL: 'https://example.com/proposal-supplement-only.pdf',
    }}
  />
);

export const OriginalGrantOnlyHasProposal = () => (
  <ProjectDetailOverview
    originalGrant={{
      title: originalGrantData.title,
      description: originalGrantData.description,
      proposalURL: 'https://example.com/proposal-original-only.pdf',
    }}
    supplementGrant={{
      title: supplementGrantData.title,
      description: supplementGrantData.description,
    }}
  />
);

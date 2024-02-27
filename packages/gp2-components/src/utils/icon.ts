import { gp2 as gp2Model } from '@asap-hub/model';
import {
  BlueSkyIcon,
  ThreadsIcon,
  LinkedInIcon,
  GithubIcon,
  XIcon,
  ResearchGateIcon,
  ResearcherIdIcon,
  OrcidSocialIcon,
  GoogleScholarIcon,
  GlobeIcon,
} from '@asap-hub/react-components';
import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { FunctionComponent } from 'react';
import {
  outputArticle,
  outputCode,
  outputDataset,
  outputForm,
  outputMaterial,
  outputReport,
  projectIcon,
  workingGroupIcon,
} from '../icons';

const icons: Record<gp2Model.OutputDocumentType, EmotionJSX.Element> = {
  Article: outputArticle,
  'Code/Software': outputCode,
  Dataset: outputDataset,
  'GP2 Reports': outputReport,
  'Procedural Form': outputForm,
  'Training Materials': outputMaterial,
};

export const getIconForDocumentType = (
  documentType: gp2Model.OutputDocumentType,
): EmotionJSX.Element => icons[documentType];

export const getSourceIcon = (source: gp2Model.OutputOwner['type']) =>
  source === 'Projects' ? projectIcon : workingGroupIcon;

export const socialIconsMap: Record<
  keyof gp2Model.UserSocial,
  FunctionComponent
> = {
  orcid: OrcidSocialIcon,
  blueSky: BlueSkyIcon,
  threads: ThreadsIcon,
  twitter: XIcon,
  linkedIn: LinkedInIcon,
  github: GithubIcon,
  researcherId: ResearcherIdIcon,
  googleScholar: GoogleScholarIcon,
  researchGate: ResearchGateIcon,
  blog: GlobeIcon,
};

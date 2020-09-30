import { OrcidWork } from '@asap-hub/model';
import { CMSUser } from '../../../src/entities/user';

export const fetchUsersResponse: CMSUser[] = [
  {
    id: '57d80949-7a75-462d-b3b0-34173423c490',
    data: {
      email: { iv: 'panog@ep.bv' },
      displayName: { iv: 'Peter Sharp' },
      skills: { iv: [] },
      lastModifiedDate: {
        iv: '2020-09-02T10:34:13.259Z',
      },
      orcid: { iv: '0000-0001-9884-1913' },
      orcidWorks: { iv: [] },
      teams: { iv: [] },
      connections: {
        iv: [{ code: '22f012ba-a059-4673-b052-c097cddff13f' }],
      },
    },
    created: '2020-08-27T13:20:57Z',
    lastModified: '2020-08-31T13:57:51Z',
  },
  {
    id: '62d80950-1a81-446d-b5b0-34173394c505',
    data: {
      email: { iv: 'ola@ep.bv' },
      displayName: { iv: 'Peter Blunt' },
      skills: { iv: [] },
      lastModifiedDate: {
        iv: '2020-09-02T10:34:13.259Z',
      },
      orcid: { iv: '0000-0001-9884-1913' },
      orcidWorks: { iv: [] },
      orcidLastSyncDate: { iv: 'CHANGE_ME' },
      teams: { iv: [] },
      connections: {
        iv: [{ code: '22f012ba-a059-4673-b052-c097cddff13f' }],
      },
    },
    created: '2020-08-27T13:20:57Z',
    lastModified: '2020-08-31T13:57:51Z',
  },
];

export const ORCIDWorksDeserialisedExpectation: OrcidWork[] = [
  {
    doi: 'https://doi.org/10.1101/2020.06.24.169219',
    id: '76241838',
    title:
      'JIP3 links lysosome transport to regulation of multiple components of the axonal cytoskeleton',
    type: 'OTHER',
    publicationDate: { year: '2020', month: '06', day: '24' },
    lastModifiedDate: '1593270649404',
  },
  {
    doi: 'https://doi.org/10.1101/2020.06.13.149443',
    id: '75609144',
    title:
      'Overlapping roles of JIP3 and JIP4 in promoting axonal transport of lysosomes in human iPSC-derived neurons',
    type: 'OTHER',
    publicationDate: { year: '2020', month: '06', day: '13' },
    lastModifiedDate: '1592357714205',
  },
  {
    doi: 'https://doi.org/10.1073/pnas.2004335117',
    id: '74196352',
    title:
      'Absence of Sac2/INPP5F enhances the phenotype of a Parkinson’s disease mutation of synaptojanin 1',
    type: 'JOURNAL_ARTICLE',
    publicationDate: { year: '2020', month: '06', day: '02' },
    lastModifiedDate: '1594690575911',
  },
  {
    doi: 'https://doi.org/10.1101/2020.01.21.914317',
    id: '67686683',
    title:
      'Absence of Sac2/INPP5F enhances the phenotype of a Parkinson’s disease mutation of synaptojanin 1',
    type: 'OTHER',
    publicationDate: { year: '2020', month: '01', day: '21' },
    lastModifiedDate: '1579805417514',
  },
  {
    doi: 'https://doi.org/10.1083/jcb.201804136',
    id: '60935242',
    title:
      'Dynamic instability of clathrin assembly provides proofreading control for endocytosis',
    type: 'JOURNAL_ARTICLE',
    publicationDate: { year: '2019', month: '10', day: '07' },
    lastModifiedDate: '1584127382910',
  },
  {
    doi: 'https://doi.org/10.1038/s41589-019-0325-3',
    id: '59628065',
    title:
      'A programmable DNA-origami platform for studying lipid transfer between bilayers',
    type: 'JOURNAL_ARTICLE',
    publicationDate: { year: '2019', month: '08' },
    lastModifiedDate: '1563470364458',
  },
  {
    doi: 'https://doi.org/10.1083/jcb.201802125',
    id: '47204074',
    title:
      'The inositol 5-phosphatase INPP5K participates in the fine control of ER organization',
    type: 'JOURNAL_ARTICLE',
    publicationDate: { year: '2018', month: '10', day: '01' },
    lastModifiedDate: '1584124886663',
  },
  {
    doi: 'https://doi.org/10.1083/jcb.201807019',
    id: '47293428',
    title:
      'VPS13A and VPS13C are lipid transport proteins differentially localized at ER contact sites',
    type: 'JOURNAL_ARTICLE',
    publicationDate: { year: '2018', month: '10', day: '01' },
    lastModifiedDate: '1584124886947',
  },
  {
    doi: 'https://doi.org/10.1126/science.aat5671',
    id: '46297837',
    title: 'A liquid phase of synapsin and lipid vesicles',
    type: 'JOURNAL_ARTICLE',
    publicationDate: { year: '2018', month: '08', day: '10' },
    lastModifiedDate: '1534366475996',
  },
  {
    doi: 'https://doi.org/10.15252/embj.201797359',
    id: '39460626',
    lastModifiedDate: '1565091985255',
    publicationDate: {
      day: '17',
      month: '01',
      year: '2018',
    },
    title:
      'Ca 2+ releases E‐Syt1 autoinhibition to couple ER ‐plasma membrane tethering with lipid transport',
    type: 'JOURNAL_ARTICLE',
  },
];

import Boom from '@hapi/boom';
import { validateSquidexRequest } from '../../src/utils/validate-squidex-request';

const webhookPayload = `{
  type: 'NewsCreated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Created',
    id: 'd2b105fe-1255-4f6c-9dfe-c7c7ab9811e3',
    created: '2020-09-03T11:00:51Z',
    lastModified: '2020-09-03T11:00:51Z',
    createdBy: 'subject:5ef5d2fe75c5460001445b65',
    lastModifiedBy: 'subject:5ef5d2fe75c5460001445b65',
    data: {
      title: {
        iv: 'exists-in-dev',
      },
    },
    status: 'Draft',
    partition: -1190432355,
    schemaId: 'd7175bf9-f45c-49ee-9adb-b0e1435bfd2b,news',
    actor: 'subject:5ef5d2fe75c5460001445b65',
    appId: '83f93384-baf4-47a2-ac11-171b161d0fdc,asap-test',
    timestamp: '2020-09-03T11:00:51Z',
    name: 'NewsCreated',
    version: 0,
  },
  timestamp: '2020-09-03T11:00:51Z',
}`;

describe('Verifies Squidex webhook payload signature', () => {
  const squidexSharedSecret = 'squidex_shared_secret';
  test('throws 403 when X-Signature header is not defined', async () => {
    expect(() =>
      validateSquidexRequest(
        {
          method: 'post',
          headers: {},
          rawPayload: webhookPayload,
        },
        squidexSharedSecret,
      ),
    ).toThrow(Boom.unauthorized());
  });

  test('throws 401 when X-Signature header does not match', async () => {
    expect(() =>
      validateSquidexRequest(
        {
          method: 'post',
          headers: {
            'x-signature': 'invalidSignature',
          },
          rawPayload: webhookPayload,
        },
        squidexSharedSecret,
      ),
    ).toThrow(Boom.forbidden());
  });

  test('returns true when signature is valid', async () => {
    const payload = `{"type":"UsersUpdated","payload":{"$type":"EnrichedContentEvent","type":"Updated","id":"d17d03ef-4365-4f03-a40d-e72efcf858cf","created":"2022-10-03T13:43:38Z","lastModified":"2022-10-04T08:35:11Z","createdBy":"subject:6238cc6a4271dda2edd09d8e","lastModifiedBy":"client:asap-hub:default","data":{"firstName":{"iv":"Natalie"},"lastName":{"iv":"Doig"},"email":{"iv":"natalie.doig@bndu.ox.ac.uk"},"orcid":{"iv":"0000-0001-6821-0264"},"labs":{"iv":["e508f4bf-a264-41b1-a2f6-1f1af415c4c9"]},"teams":{"iv":[{"id":["b894b88f-46f0-4cbe-b8ae-7488c41dd7f9"],"role":"Key Personnel"}]},"degree":{"iv":"PhD"},"country":{"iv":"United Kingdom of Great Britain and Northern Ireland"},"city":{"iv":"Oxford"},"jobTitle":{"iv":"Postdoctoral Fellow"},"institution":{"iv":"University of Oxford"},"contactEmail":{"iv":null},"avatar":{"iv":["e5534d83-aedc-4289-a23c-e5f11adc571c"]},"social":{"iv":[]},"responsibilities":{"iv":"Natalie is a postdoctoral scientist defining the anatomical substrates of basal ganglia operations in health and disease."},"researchInterests":{"iv":"Physiological and anatomical characterisation of striatal and pallidal neurons. Anatomical circuitry underlying motor function. Pathological changes in the basal ganglia underlying disease."},"reachOut":{"iv":null},"expertiseAndResourceDescription":{"iv":null},"expertiseAndResourceTags":{"iv":["Basal Ganglia","Animal models","Neurons","Electron microscopy","Mitophagy"]},"questions":{"iv":[{"question":"What are the anatomical substrates of motor circuitry in the basal ganglia? "},{"question":"Is there selectivity in the projections within and between basal ganglia nuclei? "}]},"biography":{"iv":"After receiving a B.Sc. (Hons) in Neuroscience from the University of Otago in Dunedin, New Zealand, Natalie joined the MRC Anatomical Neuropharmacology Unit in 2008 to carry out a D.Phil. with Professor J. Paul Bolam. Natalie's thesis work focused on defining the cortical and thalamic inputs to striatal projection neurons and interneurons using anatomical and electrophysiological techniques. Natalie then gained funding to carry out a postdoctoral research project in the lab of Professor Pablo Henny at the Pontificia Universidad Catolica de Chile, in Santiago, Chile. This research involved examining anatomical and electrophysiological properties of neurons in motor and non-motor related regions of the brainstem. Natalie then returned to Oxford in September 2014 to work with Professor Peter Magill to define the molecular and structural properties of distinct cell types in the basal ganglia and their partner brain circuits."},"adminNotes":{"iv":null},"onboarded":{"iv":true},"dismissedGettingStarted":{"iv":false},"connections":{"iv":[{"code":"auth0|633beaec295e525e5c3724d7"}]},"role":{"iv":"Grantee"},"orcidLastSyncDate":{"iv":"2022-10-03T13:43:51.341Z"},"orcidLastModifiedDate":{"iv":"1663017353954"},"lastModifiedDate":{"iv":null},"orcidWorks":{"iv":[{"doi":"https://dx.doi.org/10.17504/protocols.io.bp2l694xdlqe/v1","id":"118868985","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663013522925"},{"doi":"https://doi.org/10.17504/protocols.io.bp2l694xdlqe/v1","id":"118871089","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals v1","type":"OTHER","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663017353954"},{"doi":"https://dx.doi.org/10.17504/protocols.io.j8nlkw55wl5r/v1","id":"118868935","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals. Protocol #1:  Tissue preparation for electron microscopy","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663013452074"},{"doi":"https://dx.doi.org/10.17504/protocols.io.x54v9d8ppg3e/v1","id":"118868809","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals. Protocol #2: Acquisition and analysis of electron microscopy images","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663013311168"},{"doi":"https://doi.org/10.17504/protocols.io.x54v9d8ppg3e/v1","id":"118871087","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals. Protocol #2: Acquisition and analysis of electron microscopy images v1","type":"OTHER","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663017353260"},{"doi":"https://doi.org/10.17504/protocols.io.j8nlkw55wl5r/v1","id":"118871088","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals. Protocol #1: Tissue preparation for electron microscopy v1","type":"OTHER","publicationDate":{"year":"2022","month":"09","day":"08"},"lastModifiedDate":"1663017353574"},{"doi":"https://doi.org/10.1038/s41467-020-18247-5","id":"81323012","title":"GABA uptake transporters support dopamine release in dorsal striatum with maladaptive downregulation in a parkinsonism model","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2020","month":"12"},"lastModifiedDate":"1653967718256"},{"doi":"https://doi.org/10.1101/2020.11.26.400242","id":"84224821","title":"A selective projection from the subthalamic nucleus to parvalbumin-expressing interneurons of the striatum","type":"OTHER","publicationDate":{"year":"2020","month":"11","day":"26"},"lastModifiedDate":"1653989942326"},{"doi":"https://doi.org/10.1038/s41467-019-13396-8","id":"65230418","title":"Tsc1-mTORC1 signaling controls striatal dopamine release and cognitive flexibility","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2019","month":"12"},"lastModifiedDate":"1653810721809"},{"doi":"https://www.ncbi.nlm.nih.gov/pubmed/31644913","id":"65251644","title":"Impairment of Macroautophagy in Dopamine Neurons Has Opposing Effects on Parkinsonian Pathology and Behavior.","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2019","month":"10","day":"01"},"lastModifiedDate":"1574967007076"}]},"alumniSinceDate":{"iv":null}},"dataOld":{"firstName":{"iv":"Natalie"},"lastName":{"iv":"Doig"},"email":{"iv":"natalie.doig@bndu.ox.ac.uk"},"orcid":{"iv":"0000-0001-6821-0264"},"labs":{"iv":["e508f4bf-a264-41b1-a2f6-1f1af415c4c9"]},"teams":{"iv":[{"id":["b894b88f-46f0-4cbe-b8ae-7488c41dd7f9"],"role":"Key Personnel"}]},"degree":{"iv":"PhD"},"country":{"iv":"United Kingdom of Great Britain and Northern Ireland"},"city":{"iv":"Oxford"},"jobTitle":{"iv":"Postdoctoral Fellow"},"institution":{"iv":"University of Oxford"},"contactEmail":{"iv":null},"avatar":{"iv":["21be9a6a-0455-48e6-b1f4-57f63a5776e1"]},"social":{"iv":[]},"responsibilities":{"iv":"Natalie is a postdoctoral scientist defining the anatomical substrates of basal ganglia operations in health and disease."},"researchInterests":{"iv":"Physiological and anatomical characterisation of striatal and pallidal neurons. Anatomical circuitry underlying motor function. Pathological changes in the basal ganglia underlying disease."},"reachOut":{"iv":null},"expertiseAndResourceDescription":{"iv":null},"expertiseAndResourceTags":{"iv":["Basal Ganglia","Animal models","Neurons","Electron microscopy","Mitophagy"]},"questions":{"iv":[{"question":"What are the anatomical substrates of motor circuitry in the basal ganglia? "},{"question":"Is there selectivity in the projections within and between basal ganglia nuclei? "}]},"biography":{"iv":"After receiving a B.Sc. (Hons) in Neuroscience from the University of Otago in Dunedin, New Zealand, Natalie joined the MRC Anatomical Neuropharmacology Unit in 2008 to carry out a D.Phil. with Professor J. Paul Bolam. Natalie's thesis work focused on defining the cortical and thalamic inputs to striatal projection neurons and interneurons using anatomical and electrophysiological techniques. Natalie then gained funding to carry out a postdoctoral research project in the lab of Professor Pablo Henny at the Pontificia Universidad Catolica de Chile, in Santiago, Chile. This research involved examining anatomical and electrophysiological properties of neurons in motor and non-motor related regions of the brainstem. Natalie then returned to Oxford in September 2014 to work with Professor Peter Magill to define the molecular and structural properties of distinct cell types in the basal ganglia and their partner brain circuits."},"adminNotes":{"iv":null},"onboarded":{"iv":true},"dismissedGettingStarted":{"iv":false},"connections":{"iv":[{"code":"auth0|633beaec295e525e5c3724d7"}]},"role":{"iv":"Grantee"},"orcidLastSyncDate":{"iv":"2022-10-03T13:43:51.341Z"},"orcidLastModifiedDate":{"iv":"1663017353954"},"lastModifiedDate":{"iv":null},"orcidWorks":{"iv":[{"doi":"https://dx.doi.org/10.17504/protocols.io.bp2l694xdlqe/v1","id":"118868985","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663013522925"},{"doi":"https://doi.org/10.17504/protocols.io.bp2l694xdlqe/v1","id":"118871089","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals v1","type":"OTHER","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663017353954"},{"doi":"https://dx.doi.org/10.17504/protocols.io.j8nlkw55wl5r/v1","id":"118868935","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals. Protocol #1:  Tissue preparation for electron microscopy","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663013452074"},{"doi":"https://dx.doi.org/10.17504/protocols.io.x54v9d8ppg3e/v1","id":"118868809","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals. Protocol #2: Acquisition and analysis of electron microscopy images","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663013311168"},{"doi":"https://doi.org/10.17504/protocols.io.x54v9d8ppg3e/v1","id":"118871087","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals. Protocol #2: Acquisition and analysis of electron microscopy images v1","type":"OTHER","publicationDate":{"year":"2022","month":"09","day":"12"},"lastModifiedDate":"1663017353260"},{"doi":"https://doi.org/10.17504/protocols.io.j8nlkw55wl5r/v1","id":"118871088","title":"Quantitative analyses of the ultrastructural features of dopaminergic axon terminals. Protocol #1: Tissue preparation for electron microscopy v1","type":"OTHER","publicationDate":{"year":"2022","month":"09","day":"08"},"lastModifiedDate":"1663017353574"},{"doi":"https://doi.org/10.1038/s41467-020-18247-5","id":"81323012","title":"GABA uptake transporters support dopamine release in dorsal striatum with maladaptive downregulation in a parkinsonism model","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2020","month":"12"},"lastModifiedDate":"1653967718256"},{"doi":"https://doi.org/10.1101/2020.11.26.400242","id":"84224821","title":"A selective projection from the subthalamic nucleus to parvalbumin-expressing interneurons of the striatum","type":"OTHER","publicationDate":{"year":"2020","month":"11","day":"26"},"lastModifiedDate":"1653989942326"},{"doi":"https://doi.org/10.1038/s41467-019-13396-8","id":"65230418","title":"Tsc1-mTORC1 signaling controls striatal dopamine release and cognitive flexibility","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2019","month":"12"},"lastModifiedDate":"1653810721809"},{"doi":"https://www.ncbi.nlm.nih.gov/pubmed/31644913","id":"65251644","title":"Impairment of Macroautophagy in Dopamine Neurons Has Opposing Effects on Parkinsonian Pathology and Behavior.","type":"JOURNAL_ARTICLE","publicationDate":{"year":"2019","month":"10","day":"01"},"lastModifiedDate":"1574967007076"}]},"alumniSinceDate":{"iv":null}},"status":"Published","partition":-1396985977,"schemaId":"7bbe46fa-c436-4a62-97ad-62f6120ae773,users","actor":"client:asap-hub:default","appId":"58ade62c-40c7-4465-a2af-773d5568ffe0,asap-hub","timestamp":"2022-10-04T08:35:11Z","name":"UsersUpdated","version":15},"timestamp":"2022-10-04T08:35:11Z"}`;
    const squidexSharedSecretProd =
      'doubloon-palter-plectrum-gold-terrapin-movement';

    const res = validateSquidexRequest(
      {
        method: 'post',
        headers: {
          'x-signature': 'kkkgKr1zT9M7zWzbjJmlsNWVESn1lVDaVTF1h+oZNyc=',
        },
        rawPayload: payload,
      },
      squidexSharedSecretProd,
    );
    expect(res).toBe(true);
  });

  test.skip('returns true when signature is valid 3', async () => {
    const payload = `{
  "type": "UsersUpdated",
  "payload": {
    "type": "Updated",
    "id": "135533ab-b384-4af0-a449-8d1a67e3cf99",
    "created": "2020-10-24T18:16:27Z",
    "lastModified": "2022-10-04T14:23:42Z",
    "createdBy": "client:asap-hub:default",
    "lastModifiedBy": "subject:6238cc6a4271dda2edd09d8e",
    "data": {
      "firstName": {
        "iv": "Lindsey"
      },
      "lastName": {
        "iv": "Riley"
      },
      "email": {
        "iv": "lriley@michaeljfox.org"
      },
      "orcid": {
        "iv": "0000-0003-0812-6671"
      },
      "labs": {
        "iv": []
      },
      "teams": {
        "iv": [
          {
            "id": [
              "ae08050f-913a-435b-b9f0-55222196678d"
            ],
            "role": "ASAP Staff"
          }
        ]
      },
      "degree": {
        "iv": "MPH"
      },
      "country": {
        "iv": "United States"
      },
      "city": {
        "iv": "New York"
      },
      "jobTitle": {
        "iv": "Director"
      },
      "institution": {
        "iv": "Michael J. Fox Foundation"
      },
      "contactEmail": {
        "iv": "grants@parkinsonsroadmap.org"
      },
      "avatar": {
        "iv": [
          "95e27411-2ae5-4899-b1a5-83c5cdc5ce38"
        ]
      },
      "social": {},
      "responsibilities": {
        "iv": "Lindsey manages general grantmaking operations for the ASAP Collaborative Research Network."
      },
      "researchInterests": {
        "iv": "Operationalizing the strategic and tactical goals of MJFFs request for application (RFA) process."
      },
      "reachOut": {
        "iv": "You have questions about pre- or post-award management, including grant portal guidance, financial and progress reporting, or other administrative requirements."
      },
      "expertiseAndResourceDescription": {
        "iv": "Operational Management"
      },
      "expertiseAndResourceTags": {
        "iv": [
          "Parkinson\u0027s disease",
          "Non-profit health sector",
          "Grants management",
          "Project management"
        ]
      },
      "questions": {
        "iv": []
      },
      "biography": {
        "iv": "Lindsey Riley joined The Michael J. Fox Foundation in 2016. In her role as Senior Associate Director, Research Programs, Lindsey is responsible for operationalizing the strategic and tactical goals of MJFFs request for application (RFA) process.  She has 10\u002B years professional experience in the non-profit health sector with a background in both clinical and translational research, as well as in project and grants management.  Lindsey graduated from Washington College with a BA in Psychology and holds a Masters in Public Health from New York University.\n"
      },
      "adminNotes": {
        "iv": null
      },
      "onboarded": {
        "iv": true
      },
      "dismissedGettingStarted": {
        "iv": null
      },
      "connections": {
        "iv": [
          {
            "code": "d375265c-c363-477c-afd3-1ccce4e6d854"
          },
          {
            "code": "google-oauth2|109641196988610888615"
          }
        ]
      },
      "role": {
        "iv": "Staff"
      },
      "orcidLastSyncDate": {
        "iv": "2022-05-11T03:45:56.389Z"
      },
      "orcidLastModifiedDate": {
        "iv": "1624017492567"
      },
      "lastModifiedDate": {
        "iv": null
      },
      "orcidWorks": {
        "iv": [
          {
            "id": "94359478",
            "doi": "https://doi.org/10.1016/j.prdoa.2021.100094",
            "title": "Video-based Parkinson\u2019s disease assessments in a nationwide cohort of Fox Insight participants",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1624017492567",
            "publicationDate": {
              "year": "2021",
              "month": "05"
            }
          },
          {
            "id": "93223631",
            "doi": "https://europepmc.org/articles/PMC5889113",
            "title": "Understanding Barriers and Facilitators to Breast and Cervical Cancer Screening among Muslim Women in New York City: Perspectives from Key Informants.",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1620065234944",
            "publicationDate": {
              "year": "2017",
              "month": "02",
              "day": "23"
            }
          },
          {
            "id": "17819888",
            "doi": null,
            "title": "Characteristics of asian American, native Hawaiian,and Pacific Islander community health worker programs: A systematic review",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1438712646335",
            "publicationDate": {
              "year": "2015"
            }
          },
          {
            "id": "17819889",
            "doi": null,
            "title": "Protocol for the DREAM Project (Diabetes Research, Education, and Action for Minorities): A randomized trial of a community health worker intervention to improve diabetic management and control among Bangladeshi adults in NYC",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1438712646340",
            "publicationDate": {
              "year": "2014"
            }
          },
          {
            "id": "93223569",
            "doi": "https://doi.org/10.2337/cd17-0068",
            "title": "A Culturally Tailored Community Health Worker Intervention Leads to Improvement in Patient-Centered Outcomes for Immigrant Patients With Type 2 Diabetes",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1620064928310",
            "publicationDate": {}
          },
          {
            "id": "93223603",
            "doi": "https://doi.org/10.1016/j.amepre.2016.08.034",
            "title": "A Place-Based Community Health Worker Program: Feasibility and Early Outcomes, New York City, 2015",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1620065106912",
            "publicationDate": {}
          },
          {
            "id": "93223517",
            "doi": "https://doi.org/10.1093/tbm/ibx026",
            "title": "Applying a community-based participatory research framework to patient and family engagement in the development of patient-centered outcomes research and practice",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1620064788100",
            "publicationDate": {}
          },
          {
            "id": "93217350",
            "doi": "https://doi.org/10.3233/jpd-191808",
            "title": "Comparison of an Online-Only Parkinson\u2019s Disease Research Cohort to Cohorts Assessed In Person",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1620058368469",
            "publicationDate": {}
          },
          {
            "id": "93223576",
            "doi": "https://doi.org/10.1016/j.ypmed.2017.07.020",
            "title": "Evaluating community health workers\u0027 attributes, roles, and pathways of action in immigrant communities",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1620065007132",
            "publicationDate": {}
          },
          {
            "id": "93217358",
            "doi": "https://doi.org/10.3233/jpd-181434",
            "title": "Feasibility and Safety of Multicenter Tissue and Biofluid Sampling for \u03B1-Synuclein in Parkinson\u2019s Disease: The Systemic Synuclein Sampling Study (S4)",
            "type": "JOURNAL_ARTICLE",
            "lastModifiedDate": "1620058430762",
            "publicationDate": {}
          }
        ]
      },
      "alumniSinceDate": {
        "iv": null
      }
    },
    "dataOld": {
      "firstName": {
        "iv": "Lindsey"
      },
      "lastName": {
        "iv": "Riley"
      },
      "email": {
        "iv": "lriley@michaeljfox.org"
      },
      "orcid": {
        "iv": "0000-0003-0812-6671"
      },
      "labs": {
        "iv": []
      },
      "teams": {
        "iv": [
          {
            "id": [
              "ae08050f-913a-435b-b9f0-55222196678d"
            ],
            "role": "ASAP Staff"
          }
        ]
      },
      "degree": {
        "iv": "MPH"
      },
      "country": {
        "iv": "United States"
      },
      "city": {
        "iv": "New York"
      },
      "jobTitle": {
        "iv": "Director"
      },
      "institution": {
        "iv": "Michael J. Fox Foundation"
      },
      "contactEmail": {
        "iv": "grants@parkinsonsroadmap.org"
      },
      "avatar": {
        "iv": [
          "95e27411-2ae5-4899-b1a5-83c5cdc5ce38"
        ]
      },
      "social": {},
      "responsibilities": {
        "iv": "Lindsey manages general grantmaking operations for the ASAP Collaborative Research Network."
      },
      "researchInterests": {
        "iv": "Operationalizing the strategic and tactical goals of MJFFs request for application (RFA) process."
      },
      "reachOut": {
        "iv": "You have questions about pre- or post-award management, including grant portal guidance, financial and progress reporting, or other administrative requirements."
      },
      "expertiseAndResourceDescription": {
        "iv": "Operational Management"
      },
      "expertiseAndResourceTags": {
        "iv": [
          "Parkinson\u0027s disease",
          "Non-profit health sector",
          "Grants management",
          "Project management"
        ]
      },
      "questions": {
        "iv": []
      },
      "biography": {
        "iv": "Lindsey Riley joined The Michael J. Fox Foundation in 2016. In her role as Senior Associate Director, Research Programs, Lindsey is responsible for operationalizing the strategic and tactical goals of MJFFs request for application (RFA) process.  She has 10\u002B years professional experience in the non-profit health sector with a background in both clinical and translational research, as well as in project and grants management.  Lindsey graduated from Washington College with a BA in Psychology and holds a Masters in Public Health from New York University.\n"
      },
      "adminNotes": {
        "iv": null
      },
      "onboarded": {
        "iv": true
      },
      "connections": {
        "iv": [
          {
            "code": "d375265c-c363-477c-afd3-1ccce4e6d854"
          },
          {
            "code": "google-oauth2|116999841034279073336"
          }
        ]
      },
      "role": {
        "iv": "Staff"
      },
      "orcidLastSyncDate": {
        "iv": "2022-05-11T03:45:56.389Z"
      },
      "orcidLastModifiedDate": {
        "iv": "1624017492567"
      },
      "lastModifiedDate": {
        "iv": null
      },
      "orcidWorks": {
        "iv": [
          {
            "doi": "https://doi.org/10.1016/j.prdoa.2021.100094",
            "id": "94359478",
            "title": "Video-based Parkinson\u2019s disease assessments in a nationwide cohort of Fox Insight participants",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {
              "year": "2021",
              "month": "05"
            },
            "lastModifiedDate": "1624017492567"
          },
          {
            "doi": "https://europepmc.org/articles/PMC5889113",
            "id": "93223631",
            "title": "Understanding Barriers and Facilitators to Breast and Cervical Cancer Screening among Muslim Women in New York City: Perspectives from Key Informants.",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {
              "year": "2017",
              "month": "02",
              "day": "23"
            },
            "lastModifiedDate": "1620065234944"
          },
          {
            "id": "17819888",
            "title": "Characteristics of asian American, native Hawaiian,and Pacific Islander community health worker programs: A systematic review",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {
              "year": "2015"
            },
            "lastModifiedDate": "1438712646335"
          },
          {
            "id": "17819889",
            "title": "Protocol for the DREAM Project (Diabetes Research, Education, and Action for Minorities): A randomized trial of a community health worker intervention to improve diabetic management and control among Bangladeshi adults in NYC",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {
              "year": "2014"
            },
            "lastModifiedDate": "1438712646340"
          },
          {
            "doi": "https://doi.org/10.2337/cd17-0068",
            "id": "93223569",
            "title": "A Culturally Tailored Community Health Worker Intervention Leads to Improvement in Patient-Centered Outcomes for Immigrant Patients With Type 2 Diabetes",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {},
            "lastModifiedDate": "1620064928310"
          },
          {
            "doi": "https://doi.org/10.1016/j.amepre.2016.08.034",
            "id": "93223603",
            "title": "A Place-Based Community Health Worker Program: Feasibility and Early Outcomes, New York City, 2015",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {},
            "lastModifiedDate": "1620065106912"
          },
          {
            "doi": "https://doi.org/10.1093/tbm/ibx026",
            "id": "93223517",
            "title": "Applying a community-based participatory research framework to patient and family engagement in the development of patient-centered outcomes research and practice",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {},
            "lastModifiedDate": "1620064788100"
          },
          {
            "doi": "https://doi.org/10.3233/jpd-191808",
            "id": "93217350",
            "title": "Comparison of an Online-Only Parkinson\u2019s Disease Research Cohort to Cohorts Assessed In Person",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {},
            "lastModifiedDate": "1620058368469"
          },
          {
            "doi": "https://doi.org/10.1016/j.ypmed.2017.07.020",
            "id": "93223576",
            "title": "Evaluating community health workers\u0027 attributes, roles, and pathways of action in immigrant communities",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {},
            "lastModifiedDate": "1620065007132"
          },
          {
            "doi": "https://doi.org/10.3233/jpd-181434",
            "id": "93217358",
            "title": "Feasibility and Safety of Multicenter Tissue and Biofluid Sampling for \u03B1-Synuclein in Parkinson\u2019s Disease: The Systemic Synuclein Sampling Study (S4)",
            "type": "JOURNAL_ARTICLE",
            "publicationDate": {},
            "lastModifiedDate": "1620058430762"
          }
        ]
      }
    },
    "status": "Published",
    "newStatus": null,
    "partition": -1944242516,
    "schemaId": "7bbe46fa-c436-4a62-97ad-62f6120ae773,users",
    "actor": "subject:6238cc6a4271dda2edd09d8e",
    "appId": "58ade62c-40c7-4465-a2af-773d5568ffe0,asap-hub",
    "timestamp": "2022-10-04T14:23:42Z",
    "name": "UsersUpdated",
    "version": 38
  },
  "timestamp": "2022-10-04T14:23:42Z"
}
`;
    const squidexSharedSecretProd =
      'doubloon-palter-plectrum-gold-terrapin-movement';

    const res = validateSquidexRequest(
      {
        method: 'post',
        headers: {
          'x-signature': 'RNrbJN5URWkv9dQzVX3mHdq7zVM5qRHFKc0M/ue3pfo=',
        },
        rawPayload: payload,
      },
      squidexSharedSecretProd,
    );
    expect(res).toBe(true);
  });
});

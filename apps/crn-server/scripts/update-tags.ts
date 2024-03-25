import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { UserContentfulDataProvider } from '../src/data-providers/contentful/user.data-provider';
import { ResearchTagContentfulDataProvider } from '../src/data-providers/contentful/research-tag.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependencies';
import { UserDataProvider } from '../src/data-providers/types';

const TAKE_ENTITIES = 200;
const timeoutPromise = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const userDataProvider = new UserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

const tagsDataProvider = new ResearchTagContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

export const tags = [
  [1, 'Adaptive immune cell'],
  [1, 'aggregation'],
  [0, 'Alessi'],
  [0, 'Alexia Kalogeropulou	'],
  [0, 'Alpha-Synuclein', 'alpha-synuclein'],
  [0, 'Alpha-synuclein', 'alpha-synuclein'],
  [1, 'alpha-synuclein'],
  [0, 'Alpha-synuclein interactions', 'alpha-synuclein interactions'],
  [1, 'alpha-synuclein interactions'],
  [1, 'ambient air pollution'],
  [0, 'Andy Singleton'],
  [1, 'Animal Models'],
  [0, 'animal models', 'Animal Models'],
  [1, 'antibodies'],
  [1, 'antiviral therapy'],
  [1, 'ARJP (Autosomal recessive juvenile'],
  [0, 'Autosomal recessive juvenile parkinsonism (ARJP)', 'ARJP (Autosomal recessive juvenile'],
  [1, 'ASAP Annual In Person Meeting'],
  [0, 'ASAP CRN'],
  [0, 'ASAP Hub'],
  [1, 'assay development'],
  [1, 'Assays'],
  [1, 'ATP Transporter'],
  [1, 'Autoimmune'],
  [1, 'autophagy'],
  [1, 'Autosomal recessive juvenile parkinsonism (ARJP)'],
  [1, 'bacteria'],
  [1, 'Basal ganglia'],
  [1, 'Behavioral assays'],
  [0, 'Benjamin O’Callaghan'],
  [1, 'Brain tissue'],
  [1, 'Brainbank'],
  [0, 'Brit Mollenhauer'],
  [1, 'Catecholamines'],
  [1, 'cell biology'],
  [0, 'Cell biology', 'cell biology'],
  [1, 'cellular assays'],
  [1, 'chemical-genetic interaction'],
  [1, 'Chemogenetics'],
  [0, 'Ching-Chieh (Ian) Chou'],
  [1, 'ciliogenesis'],
  [1, 'circadian rhythm'],
  [1, 'Circuit'],
  [1, 'Circuit dysfunction'],
  [1, 'Circuits and symptoms'],
  [0, 'Claire Parish'],
  [1, 'Clinical Cohorts'],
  [1, 'Coordination'],
  [0, 'Cornelius Blauwendraat'],
  [1, 'Cortex'],
  [1, 'Corticospinal'],
  [1, 'corticospinalorticostriatal'],
  [1, 'CRISPR/Cas9'],
  [1, 'DAMPs (Damage-associated molecular patterns) Glia'],
  [1, 'Data Analysis'],
  [1, 'Data Management'],
  [1, 'Data Reporting'],
  [1, 'Data Sharing'],
  [1, 'Data Standardization'],
  [1, 'DBS/other stimulation interventions'],
  [0, 'Desjardins'],
  [1, 'developmental biology'],
  [1, 'Diabetes'],
  [1, 'disease mechanisms'],
  [1, 'disease models'],
  [1, 'Disease penetrance'],
  [1, 'Dopamine neuron subtypes'],
  [1, 'Dopamine non-responsive'],
  [1, 'Dopamine release'],
  [0, 'dopamine release', 'Dopamine release'],
  [1, 'drug target'],
  [1, 'early onset PD'],
  [0, 'Edmundo Vides'],
  [1, 'electron microscopy'],
  [1, 'electrophysiology'],
  [1, 'endolysomal dysfunction'],
  [0, 'enteric nervous system', 'Enteric nervouse system'],
  [1, 'Enteric nervouse system'],
  [1, 'Enteroendocrine cells'],
  [1, 'epigenomics'],
  [1, 'Excitability'],
  [1, 'Extracellular Matrix'],
  [1, 'Extracellular Space'],
  [1, 'Foundin-PD'],
  [0, 'Fran Platt'],
  [0, 'Frans-Ulrich Hartl'],
  [1, 'GBA'],
  [1, 'genetics'],
  [0, 'Guillermo Arango-Duque'],
  [1, 'Gut-Brain'],
  [0, 'Gut-brain', 'Gut-Brain'],
  [0, 'Hafler'],
  [0, 'Hardy'],
  [0, 'Helen Plun-Favreau'],
  [1, 'Herpes simplex virus (HSV)'],
  [1, 'hPSC'],
  [1, 'Human induced pluripotent stem cells (hiPSCs)'],
  [1, 'imaging'],
  [1, 'Imaging; Excitability'],
  [1, 'iNDI-PD'],
  [1, 'induced neurons (iNeurons)'],
  [
    0,
    'Induced pluripotent stem cells (iPS/iPSCs)',
    '(iPSCs) Induced pluripotent stem cells',
  ],
  [
    0,
    'Induced pluripotent stem cells (iPSC)',
    '(iPSCs) Induced pluripotent stem cells',
  ],
  [1, 'interneurons'],
  [1, 'intracellular transport'],
  [1, 'iPSC neurons'],
  [0, 'iPSCs', '(iPSCs) Induced pluripotent stem cells'],
  [1, '(iPSCs) Induced pluripotent stem cells'],
  [0, 'iPSCs (Induced pluripotent stem cells)', '(iPSCs) Induced pluripotent stem cells'],
  [1, 'KO'],

  [1, 'meta-analysis'],
  [1, 'Metagenomics'],
  [0, 'Michael Schwarzchild'],
  [1, 'mitoPARK'],
  [1, 'Mortality'],
  [
    0,
    'mouse; MPTP',
    null,
    'SPECIAL CASE - Split tag to be Mouse; MPTP not combine ',
  ],
  [1, 'MPTP'],
  [1, 'Neurobehavorial'],
  [1, 'neurodegeneration'],
  [1, 'Neuro-immune interactions'],
  [1, 'neuromelanin'],
  [1, 'neuronal circuits'],
  [1, 'Neuroregenerative'],
  [1, 'Non-Human Primate'],
  [1, 'Noradrenaline'],
  [1, 'Oligomers'],
  [1, 'omics'],
  [1, 'Open Science'],
  [1, 'Optogenetic'],
  [1, 'Organoids'],
  [1, 'Parkin(PARK2)'],
  [1, 'Periphery-Brain Axis'],
  [1, 'Physiology'],
  [1, 'Placebo response'],
  [1, 'Postmortem tissue'],
  [1, 'PPMI'],
  [1, 'Primate'],
  [0, 'primate', 'Primate'],
  [1, 'Prodromal'],
  [1, 'Project Management'],
  [1, 'Quantitative'],
  [0, 'Rab GTPase', 'RabGTPases'],
  [1, 'RabGTPases'],
  [0, 'Raj Awatramani'],
  [1, 'Resource Sharing'],
  [0, 'Rio'],
  [0, 'Rob Turner'],
  [1, 'Rodent'],
  [0, 'samara reck-peterson'],
  [0, 'Sarkis Mazamanian'],
  [0, 'Scherzer'],
  [1, 'Senscence'],
  [1, 'Single cell analysis'],
  [1, 'single cell analysis'],
  [1, 'Single Cell genomics'],
  [1, 'Single cell multi-omics'],
  [1, 'single cell RNA sequencing (scRNASeq)'],
  [1, 'Single cell transcriptomics'],
  [0, 'single cell transcriptomics', 'Single cell transcriptomics'],
  [1, 'Single-cell eqtl'],
  [1, 'single-cell multiomics'],
  [1, 'Single-nuclear RNA-seq (snRNA-seq)'],
  [1, 'Sj1'],
  [1, 'Stem cells - embryonic'],
  [0, 'Stem cells – embryonic', 'Stem cells - embryonic'],
  [0, 'Steve Lee'],
  [1, 'Study Design'],
  [1, '(SNpc) Substantia nigra pars compacta'],
  [
    0,
    'Substantia nigra pars compacta (SNpc)',
    '(SNpc) Substantia nigra pars compacta',
  ],
  [
    0,
    'substantia nigra pars compacta (SNpc)',
    '(SNpc) Substantia nigra pars compacta',
  ],
  [0, 'Sulzer'],
  [1, 'Synapses'],
  [0, 'synapses', 'Synapses'],
  [1, 'synaptic homeostasis'],
  [1, 'T cell receptors (TCR)'],

  [1, 'Tool Development'],
  [0, 'Tool development', 'Tool Development'],
  [1, 'Transcranial Focused Ultrasound (tFUS)'],
  [1, 'Trans-Golgi network (TGN)'],
  [1, 'Translational research'],
  [1, 'transport'],
  [1, 'Ventral Tegmental Area'],
  [1, 'viral tracing'],
  [0, 'Viviana Gradinaru'],
];

const findOrCreateTag = async (tagName: string) => {
  const researchTag = await tagsDataProvider.fetch({ search: tagName });
  let tagId = null;
  // Create tag if doesn't exist
  if (researchTag.total === 0) {
    tagId = await tagsDataProvider.create(tagName);
    console.log(`created tag: ${tagName} - id: ${tagId}`);
  } else {
    tagId = researchTag.items[0]?.id;
    console.log('tag exists', tagId);
  }
  return tagId;
};

const findUsers = async (oldTagName: string, newTagId: string, usersToUpdate: Record<string, string[]>) => {
  const users = await userDataProvider.fetch({ take: TAKE_ENTITIES, search: oldTagName });
    console.log(`
      TAG: ${oldTagName} - USERS FOUND: ${users.total}
      `);
  for (let j = 0; j < users.items.length; j++) {
    const user = users.items[j];
    if (user?.expertiseAndResourceTags.includes(oldTagName)) {
      const existingTags: string[] = usersToUpdate[user.id] || [];
      usersToUpdate[user.id] = [...existingTags,newTagId]
    }
  }
};

const updateEntityTags = async (entitiesToUpdate: Record<string, string[]>,provider: UserDataProvider) => {
  const ids = Object.keys(entitiesToUpdate);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (id) {
      const tagIds = entitiesToUpdate[id];
      await provider.update(id, {
        tagIds: [...new Set(tagIds)],
        lastUpdated: new Date().toISOString(),
      });
      console.log(`${i}/${ids.length}`)
      await timeoutPromise(2000)
    }
  }
};

export const updateEntities =
  (findEntities: (a: string, b: string, list: Record<string, string[]>) => void, provider: UserDataProvider) => async () => {
    const entitiesToUpdate = {}
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      // legacy tag moving to research tag
      try {
      if (tag && tag[0] === 1) {
        const tagWord = tag[1] as string;
        const tagId = await findOrCreateTag(tagWord);
        tagId && findEntities(tagWord, tagId, entitiesToUpdate);
        // legacy tag going to a different name
      } else if (tag && tag.length === 3) {
        const oldTagWord = tag[1] as string;
        const newTagWord = tag[2] as string;
        console.log(oldTagWord, newTagWord);
        const tagId = await findOrCreateTag(newTagWord);
        tagId && findEntities(oldTagWord, tagId, entitiesToUpdate);
      }
    } catch(e) {
      console.log(e)
    }

    }
    console.log(`total found ${Object.keys(entitiesToUpdate).length}`)
    await updateEntityTags(entitiesToUpdate, provider);
    console.log(`DONE`);
  };
export const updateUsersTags = updateEntities(findUsers, userDataProvider);

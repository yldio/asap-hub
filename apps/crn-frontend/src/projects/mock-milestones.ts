import type { ResearchOutputOption } from '@asap-hub/react-components';

/**
 * Mock pool of articles available for search in the milestone articles modal.
 * Replace with real API search when backend is ready (ASAP-1423).
 */
const mockArticlePool: ResearchOutputOption[] = [
  {
    value: 'ro-1',
    label: 'Alpha-synuclein aggregation in PD models',
    documentType: 'Article',
    type: 'Preprint',
  },
  {
    value: 'ro-2',
    label: 'Dopaminergic neuron baseline metrics study',
    documentType: 'Article',
    type: 'Published',
  },
  {
    value: 'ro-3',
    label: 'Protein misfolding imaging protocol validation',
    documentType: 'Article',
    type: 'Preprint',
  },
  {
    value: 'ro-4',
    label: 'LRRK2 kinase inhibitor screening results',
    documentType: 'Article',
    type: 'Published',
  },
  {
    value: 'ro-5',
    label: 'Mitochondrial dysfunction in PD neuronal models',
    documentType: 'Article',
    type: 'Preprint',
  },
  {
    value: 'ro-6',
    label: 'Gene therapy vectors for synucleinopathy treatment',
    documentType: 'Article',
    type: 'Published',
  },
];

export const mockLoadArticleOptions = (
  inputValue: string,
): Promise<ResearchOutputOption[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        mockArticlePool.filter((a) =>
          a.label.toLowerCase().includes(inputValue.toLowerCase()),
        ),
      );
    }, 300);
  });

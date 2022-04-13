import { SharedResearchListCard } from '@asap-hub/react-components';
import { text, number, select } from '@storybook/addon-knobs';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Shared Research / List Card',
};

export const Normal = () => (
  <SharedResearchListCard
    researchOutputs={Array.from({
      length: number('Outputs', 20, { min: 0, max: 20 }),
    })
      .map((_, i) => createResearchOutputResponse(i))
      .map((output, i) =>
        i === 0
          ? {
              ...output,
              link: text('Link', 'https://hub.asap.science'),
              title: text(
                'Title',
                'Tracing the Origin and Progression of Parkinson’s Disease through the Neuro-Immune Interactome',
              ),
              documentType: select(
                'Type',
                ['Grant Document'],
                'Grant Document',
              ),
            }
          : output,
      )}
  />
);

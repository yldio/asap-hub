import {
  MilestoneStatusConfirmationModal,
  ResearchOutputOption,
} from '@asap-hub/react-components';

export default {
  title: 'Organisms / MilestoneStatusConfirmationModal',
  component: MilestoneStatusConfirmationModal,
};

const loadOptions = (inputValue: string): Promise<ResearchOutputOption[]> =>
  Promise.resolve(
    [
      {
        value: 'ro-1',
        label: 'Alpha-synuclein aggregation study',
        documentType: 'Article' as const,
        type: 'Preprint' as const,
      },
      {
        value: 'ro-2',
        label: 'LRRK2 kinase inhibitor results',
        documentType: 'Article' as const,
        type: 'Published' as const,
      },
    ].filter((o) => o.label.toLowerCase().includes(inputValue.toLowerCase())),
  );

export const Complete = () => (
  <MilestoneStatusConfirmationModal
    status="Complete"
    loadCurrentArticles={() => Promise.resolve([])}
    loadOptions={loadOptions}
    onClose={() => undefined}
    onConfirm={() => Promise.resolve()}
  />
);

export const Terminated = () => (
  <MilestoneStatusConfirmationModal
    status="Terminated"
    loadCurrentArticles={() => Promise.resolve([])}
    loadOptions={loadOptions}
    onClose={() => undefined}
    onConfirm={() => Promise.resolve()}
  />
);

export const CompleteWithExistingArticles = () => (
  <MilestoneStatusConfirmationModal
    status="Complete"
    loadCurrentArticles={() =>
      Promise.resolve([
        {
          id: 'ro-1',
          title: 'Alpha-synuclein aggregation study',
          href: '/shared-research/ro-1',
          type: 'Preprint',
        },
        {
          id: 'ro-2',
          title: 'LRRK2 kinase inhibitor results',
          href: '/shared-research/ro-2',
          type: 'Published',
        },
      ])
    }
    loadOptions={loadOptions}
    onClose={() => undefined}
    onConfirm={() => Promise.resolve()}
  />
);

export const LoadingArticles = () => (
  <MilestoneStatusConfirmationModal
    status="Complete"
    loadCurrentArticles={() => new Promise(() => {})}
    loadOptions={loadOptions}
    onClose={() => undefined}
    onConfirm={() => Promise.resolve()}
  />
);

export const FailedToLoadArticles = () => (
  <MilestoneStatusConfirmationModal
    status="Complete"
    loadCurrentArticles={() => Promise.reject(new Error('boom'))}
    loadOptions={loadOptions}
    onClose={() => undefined}
    onConfirm={() => Promise.resolve()}
  />
);

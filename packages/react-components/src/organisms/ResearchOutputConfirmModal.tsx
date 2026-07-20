import { ResearchOutputResponse } from '@asap-hub/model';
import { Dispatch, SetStateAction } from 'react';
import { Link } from '../atoms';
import { mailToSupport, TECH_SUPPORT_EMAIL } from '../mail';
import ConfirmModal from './ConfirmModal';

export type SeenModalType = 'description-change' | 'version';

export type ResearchOutputConfirmModalType =
  | 'description-draft'
  | 'description-publish'
  | 'version'
  | 'confirm-publish'
  | null;

type ResearchOutputConfirmModalProps = {
  modal: ResearchOutputConfirmModalType;
  save: (draftSave?: boolean) => Promise<void | ResearchOutputResponse>;
  onCancel: () => void;
  setAlreadySeenModals: Dispatch<SetStateAction<Set<SeenModalType>>>;
};

const ResearchOutputConfirmModal: React.FC<ResearchOutputConfirmModalProps> = ({
  modal,
  save,
  onCancel,
  setAlreadySeenModals,
}) => {
  const markModalAsSeen = (type: SeenModalType) => {
    setAlreadySeenModals((prev) => {
      const next = new Set(prev);
      next.add(type);
      return next;
    });
  };

  const getModalConfig = () => {
    switch (modal) {
      case 'version':
        return {
          title: 'Publish new version for the whole hub?',
          confirmText: 'Publish new version',
          description: (
            <>
              Once published this output version will be available to all Hub
              members and reminders will be issued to all associated
              contributors. If you have any issues with this output version
              after it has been published, please contact{' '}
              <Link href={mailToSupport()}>{TECH_SUPPORT_EMAIL}</Link>.
            </>
          ),
          onSave: async () => {
            markModalAsSeen('version');
            const result = await save(false);

            if (!result) {
              onCancel();
            }
          },
        };

      case 'description-draft':
      case 'description-publish':
        return {
          title: 'Keep the same description?',
          confirmText: `Keep and ${
            modal === 'description-draft' ? 'save' : 'publish'
          }`,
          description:
            'We noticed that you kept the same description as your previous output. ASAP encourages users to provide specific context for each output.',
          onSave: async () => {
            markModalAsSeen('description-change');

            const result = await save(modal === 'description-draft');

            if (!result) {
              onCancel();
            }
          },
        };

      case 'confirm-publish':
      default:
        return {
          title: 'Publish output for the whole hub?',
          confirmText: 'Publish Output',
          description: (
            <>
              Once published this output will be available to all Hub members
              and reminders will be issued to all associated contributors. If
              you have any issues with the output after it has been published,
              please contact{' '}
              <Link href={mailToSupport()}>{TECH_SUPPORT_EMAIL}</Link>.
            </>
          ),
          onSave: async () => {
            await save(false);
            onCancel();
          },
        };
    }
  };

  const modalConfig = getModalConfig();
  return (
    <ConfirmModal
      title={modalConfig.title}
      cancelText="Cancel"
      onCancel={onCancel}
      confirmText={modalConfig.confirmText}
      description={modalConfig.description}
      onSave={modalConfig.onSave}
    />
  );
};

export default ResearchOutputConfirmModal;

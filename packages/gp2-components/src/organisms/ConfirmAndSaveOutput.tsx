import { ReactNode, useState } from 'react';
import { ConfirmModal as Modal, Link, mail } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/model';
import { useNotificationContext } from '@asap-hub/react-context';

import { EntityMappper } from '../templates/CreateOutputPage';
import { GetWrappedOnSave } from './Form';

const { mailToSupport, INVITE_SUPPORT_EMAIL } = mail;

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
export type ConfirmAndSaveOutputProps = {
  children: (state: {
    save: () => Promise<gp2.OutputResponse | void>;
  }) => ReactNode;
  getWrappedOnSave: GetWrappedOnSave<gp2.OutputResponse>;
  setRedirectOnSave: (url: string) => void;
  path: (id: string) => string;
  documentType: gp2.OutputDocumentType;
  title: string | undefined;
  currentPayload: gp2.OutputPostRequest;
  isEditing: boolean;
  createVersion: boolean;
  shareOutput: (
    payload: gp2.OutputPostRequest,
  ) => Promise<gp2.OutputResponse | void>;
  entityType: 'workingGroup' | 'project';
};

const getBannerMessage = (
  entityType: 'workingGroup' | 'project',
  documentType: gp2.OutputDocumentType,
  published: boolean,
  createVersion: boolean,
) =>
  `${createVersion ? 'New ' : ''}${EntityMappper[entityType]} ${documentType} ${
    createVersion ? 'version ' : ''
  }${published || createVersion ? 'published' : 'saved'} successfully.`;

export const ConfirmAndSaveOutput = ({
  children,
  getWrappedOnSave,
  setRedirectOnSave,
  path,
  documentType,
  title,
  shareOutput,
  currentPayload,
  createVersion,
  isEditing,
  entityType,
}: ConfirmAndSaveOutputProps) => {
  const [displayPublishModal, setDisplayPublishModal] = useState(false);
  const [displayVersionModal, setDiplayVersionModal] = useState(false);

  const { addNotification, removeNotification, notifications } =
    useNotificationContext();

  const setBannerMessage = (
    message: string,
    page: 'output' | 'output-form',
    bannerType: 'error' | 'success',
  ) => {
    if (
      notifications[0] &&
      notifications[0]?.message !== capitalizeFirstLetter(message)
    ) {
      removeNotification(notifications[0]);
    }
    addNotification({
      message: capitalizeFirstLetter(message),
      page,
      type: bannerType,
    });
  };
  const save = async (skipConfirmationModal: boolean = false) => {
    const displayModalFn =
      !isEditing && !skipConfirmationModal
        ? () => {
            setDisplayPublishModal(true);
          }
        : createVersion && !skipConfirmationModal
          ? () => {
              setDiplayVersionModal(true);
            }
          : null;

    const output = await getWrappedOnSave(
      () => shareOutput(currentPayload),
      (error) => setBannerMessage(error, 'output-form', 'error'),
      displayModalFn,
    )();

    if (output && typeof output.id === 'string') {
      setBannerMessage(
        getBannerMessage(entityType, documentType, !title, createVersion),
        'output',
        'success',
      );
      setRedirectOnSave(path(output.id));
    }
    return output;
  };
  return (
    <>
      {displayPublishModal && (
        <Modal
          title="Publish output for the whole hub?"
          cancelText="Cancel"
          onCancel={() => setDisplayPublishModal(false)}
          confirmText="Publish Output"
          onSave={async () => {
            const skipPublishModal = true;
            const result = await save(skipPublishModal);
            if (!result) {
              setDisplayPublishModal(false);
            }
          }}
          description={
            <>
              All {entityType === 'workingGroup' ? 'working group' : 'project'}{' '}
              members listed on this output will be notified and all GP2 members
              will be able to access it. If you need to unpublish this output,
              please contact{' '}
              {<Link href={mail.mailToSupport()}>{INVITE_SUPPORT_EMAIL}</Link>}.
            </>
          }
        />
      )}

      {displayVersionModal && (
        <Modal
          title="Publish new version for the whole hub?"
          cancelText="Cancel"
          onCancel={() => setDiplayVersionModal(false)}
          confirmText="Publish new version"
          onSave={async () => {
            const skipPublishModal = true;
            const result = await save(skipPublishModal);
            if (!result) {
              setDiplayVersionModal(false);
            }
          }}
          description={
            <>
              All working group members listed on this output will be notified
              and all GP2 members will be able to access it. If you want to add
              or edit older versions after this new version was published,
              please contact{' '}
              {<Link href={mailToSupport()}>{INVITE_SUPPORT_EMAIL}</Link>}.
            </>
          }
        />
      )}
      {children({
        save,
      })}
    </>
  );
};

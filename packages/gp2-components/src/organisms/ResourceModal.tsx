import { gp2 } from '@asap-hub/model';
import {
  Button,
  EditModal,
  Headline3,
  LabeledDropdown,
  LabeledTextArea,
  LabeledTextField,
  Link,
  Paragraph,
  pixels,
  utils,
  usePushFromHere,
} from '@asap-hub/react-components';
import { urlExpression } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { useState } from 'react';
import {
  footerStyles,
  formContainer,
  mobileQuery,
  modalStyles,
  padding24Styles,
} from '../layout';

const { rem } = pixels;
const { noop } = utils;

const divWithActionsStyle = css({
  display: 'inline-flex',
  gap: rem(14),
  justifyContent: 'space-between',
  [mobileQuery]: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
});

type ResourceModalProps = Partial<gp2.Resource> & {
  modalTitle: string;
  modalDescription: string;
  backHref: string;
  onSave?: (data: gp2.Resource) => Promise<void>;
  onDelete?: () => void | Promise<void>;
};

const ResourceModal: React.FC<ResourceModalProps> = ({
  id,
  title,
  description,
  backHref,
  modalTitle,
  modalDescription,
  onSave = noop,
  onDelete = noop,
  ...props
}) => {
  const externalLink = props.type === 'Link' && props.externalLink;
  const [newType, setNewType] = useState<'Link' | 'Note' | ''>(
    props.type || '',
  );
  const historyPush = usePushFromHere();
  const [isDeleting, setIsDeleting] = useState(false);

  const [newTitle, setNewTitle] = useState(title || '');
  const [newDescription, setNewDescription] = useState(description || '');
  const [newExternalLink, setNewExternalLink] = useState(externalLink || '');

  const isDirty = () => {
    if (!props.type && newType === '') {
      return false;
    }

    if (props.type === 'Link' && externalLink !== newExternalLink) {
      return true;
    }

    return (
      props.type !== newType ||
      title !== newTitle ||
      (!!description && description !== newDescription)
    );
  };

  const onSaveFunction = () => {
    /* istanbul ignore next */
    if (!newType) {
      throw new Error('There is no type provided.');
    }

    const resourceBase = {
      id,
      title: newTitle,
      description: newDescription || undefined,
    };
    const resource =
      newType === 'Link'
        ? {
            type: newType,
            ...resourceBase,
            externalLink: newExternalLink,
          }
        : {
            type: newType,
            ...resourceBase,
          };
    return onSave(resource);
  };

  const onDeleteFunction = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
    historyPush(backHref);
  };

  return (
    <EditModal
      title={modalTitle}
      backHref={backHref}
      dirty={isDirty()}
      noHeader
      onSave={noop}
    >
      {({ isSaving }, asyncFunctionWrapper) => (
        <div css={modalStyles}>
          <header css={padding24Styles}>
            <Headline3>{modalTitle}</Headline3>
            <Paragraph accent="lead">{modalDescription}</Paragraph>
          </header>
          <div css={[formContainer, padding24Styles]}>
            <LabeledDropdown
              title="Resource Type"
              subtitle="(required)"
              options={gp2.resourceTypes.map((value) => ({
                value,
                label: value,
              }))}
              value={newType}
              required
              getValidationMessage={() => 'Please enter a valid type'}
              onChange={setNewType}
              enabled={!isSaving && !isDeleting}
            />
            {newType === 'Link' && (
              <LabeledTextField
                title="URL"
                subtitle="(required)"
                value={newExternalLink}
                onChange={setNewExternalLink}
                getValidationMessage={() => 'Please enter a valid link'}
                required
                pattern={urlExpression}
                enabled={!isSaving && !isDeleting}
              />
            )}
            <LabeledTextField
              title="Title"
              subtitle="(required)"
              required
              value={newTitle}
              getValidationMessage={() => 'Please enter a title'}
              onChange={setNewTitle}
              enabled={newType !== '' && !isSaving && !isDeleting}
            />
            <LabeledTextArea
              title="Description"
              value={newDescription}
              onChange={setNewDescription}
              enabled={newType !== '' && !isSaving && !isDeleting}
            />
          </div>
          <footer css={[footerStyles, padding24Styles]}>
            <div>
              <Link href={backHref} buttonStyle noMargin>
                Cancel
              </Link>
            </div>
            <div css={css(divWithActionsStyle)}>
              {onDelete !== noop && (
                <Button noMargin onClick={onDeleteFunction}>
                  Delete
                </Button>
              )}
              <Button
                noMargin
                primary
                onClick={() => asyncFunctionWrapper(onSaveFunction)}
                enabled={!isSaving && !isDeleting}
              >
                Save
              </Button>
            </div>
          </footer>
        </div>
      )}
    </EditModal>
  );
};

export default ResourceModal;

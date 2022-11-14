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
} from '@asap-hub/react-components';
import { UrlExpression } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { useState } from 'react';
import { mobileQuery } from '../layout';

const { rem } = pixels;
const { noop } = utils;

const buttonContainerStyles = css({
  display: 'inline-flex',
  gap: rem(24),
  width: '100%',
  justifyContent: 'space-between',
  [mobileQuery]: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
});

const overrideButtonStyles = css({
  margin: 0,
  maxWidth: 'fit-content',
  [mobileQuery]: {
    maxWidth: '100%',
  },
});

type ResourceModalProps = Partial<gp2.Resource> & {
  modalTitle: string;
  modalDescription: string;
  backHref: string;
  onSave?: (data: gp2.Resource) => void | Promise<void>;
};

const ResourceModal: React.FC<ResourceModalProps> = (props) => {
  const {
    type,
    title,
    description,
    backHref,
    modalTitle,
    modalDescription,
    onSave = noop,
  } = props;
  const externalLink = type === 'Link' && props.externalLink;
  const [newType, setNewType] = useState<'Link' | 'Note' | ''>(type || '');
  const [newTitle, setNewTitle] = useState(title || '');
  const [newDescription, setNewDescription] = useState(description || '');
  const [newExternalLink, setNewExternalLink] = useState(externalLink || '');

  return (
    <EditModal
      title={modalTitle}
      backHref={backHref}
      dirty={type !== newType}
      noHeader
      onSave={() => {
        /* istanbul ignore next */
        if (!newType) {
          throw new Error('There is no type provided.');
        }

        const resourceBase = {
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
      }}
    >
      {({ isSaving }, asyncOnSave) => (
        <div css={css({ width: '100%' })}>
          <header>
            <Headline3>{modalTitle}</Headline3>
            <Paragraph accent="lead">{modalDescription}</Paragraph>
          </header>
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
            enabled={!isSaving}
          />
          {newType === 'Link' && (
            <LabeledTextField
              title="URL"
              subtitle="(required)"
              value={newExternalLink}
              onChange={setNewExternalLink}
              getValidationMessage={() => 'Please enter a valid link'}
              required
              pattern={UrlExpression}
              enabled={!isSaving}
            />
          )}
          <LabeledTextField
            title="Title"
            subtitle="(required)"
            required
            value={newTitle}
            getValidationMessage={() => 'Please enter a title'}
            onChange={setNewTitle}
            enabled={newType !== '' && !isSaving}
          />
          <LabeledTextArea
            title="Description"
            value={newDescription}
            onChange={setNewDescription}
            enabled={newType !== '' && !isSaving}
          />
          <div css={buttonContainerStyles}>
            <Link
              href={backHref}
              buttonStyle
              noMargin
              overrideStyles={css({
                maxWidth: 'fit-content',
              })}
            >
              Cancel
            </Link>

            <Button
              overrideStyles={overrideButtonStyles}
              primary
              onClick={asyncOnSave}
              enabled={!isSaving}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </EditModal>
  );
};

export default ResourceModal;

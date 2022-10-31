import { gp2 } from '@asap-hub/model';
import {
  Button,
  EditModal,
  Headline3,
  LabeledDropdown,
  LabeledTextField,
  Link,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useState } from 'react';
import { mobileQuery } from '../layout';

const types = ['Link', 'Note'];

const { rem } = pixels;

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

type ResourceModalProps = gp2.Resource & {
  backHref: string;
};

const ResourceModal: React.FC<ResourceModalProps> = ({
  type,
  title,
  description,
  externalLink,
  backHref,
}) => {
  const [newType, setNewType] = useState(type);
  const [newTitle, setNewTitle] = useState(title || '');
  const [newDescription, setNewDescription] = useState(description || '');
  const [newExternalLink, setNewExternalLink] = useState(externalLink || '');

  return (
    <EditModal title="Add Resource" backHref={backHref} dirty={false} noHeader>
      {({ isSaving }, asyncOnSave) => (
        <div css={css({ width: '100%' })}>
          <header>
            <Headline3>Add resource</Headline3>
            <Paragraph accent="lead">
              Select a resource type and provide the neccessary information
              required to share a resource privately with your group.
            </Paragraph>
          </header>
          <LabeledDropdown
            title="Resource Type"
            subtitle="(required)"
            options={types.map((type) => ({ value: type, label: type }))}
            value={newType}
            onChange={setNewType}
          />
          {newType !== 'Note' && (
            <LabeledTextField
              title="URL"
              subtitle="(required)"
              value={newExternalLink}
              onChange={setNewExternalLink}
              enabled={newType !== '' && !isSaving}
            />
          )}
          <LabeledTextField
            title="Title"
            subtitle="(required)"
            value={newTitle}
            onChange={setNewTitle}
            enabled={newType !== '' && !isSaving}
          />
          <LabeledTextField
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

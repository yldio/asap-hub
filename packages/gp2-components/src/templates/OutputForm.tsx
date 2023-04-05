import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Button,
  Form,
  FormCard,
  GlobeIcon,
  LabeledDropdown,
  LabeledTextField,
  pixels,
  usePushFromHere,
  AuthorSelect,
  noop,
} from '@asap-hub/react-components';

import { gp2 as gp2Routing } from '@asap-hub/routing';
import { isInternalUser, urlExpression } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { ComponentPropsWithRef, useState } from 'react';
import { buttonWrapperStyle, mobileQuery } from '../layout';
import { EntityMappper } from './CreateOutputPage';

const { rem } = pixels;

const getBannerMessage = (
  entityType: 'workingGroup' | 'project',
  documentType: gp2Model.OutputDocumentType,
  published: boolean,
) =>
  `${EntityMappper[entityType]} ${documentType} ${
    published ? 'published' : 'saved'
  } successfully.`;

const footerStyles = css({
  display: 'flex',
  gap: rem(24),
  justifyContent: 'flex-end',
  [mobileQuery]: {
    flexDirection: 'column-reverse',
  },
});
const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
});
type OutputFormType = {
  entityType: 'workingGroup' | 'project';
  shareOutput: (
    payload: gp2Model.OutputPostRequest,
  ) => Promise<gp2Model.OutputResponse | undefined>;
  setBannerMessage: (message: string) => void;
  documentType: gp2Model.OutputDocumentType;
  readonly getAuthorSuggestions?: ComponentPropsWithRef<
    typeof AuthorSelect
  >['loadOptions'];
} & Partial<
  Pick<
    gp2Model.OutputResponse,
    'title' | 'link' | 'type' | 'subtype' | 'authors'
  >
>;

export const getPostAuthors = (
  authors: ComponentPropsWithRef<typeof AuthorSelect>['values'],
) =>
  authors?.map(({ value, author }) => {
    if (author) {
      return isInternalUser(author)
        ? { userId: value }
        : { externalUserId: value };
    }
    return { externalUserName: value };
  });

const OutputForm: React.FC<OutputFormType> = ({
  entityType,
  shareOutput,
  documentType,
  getAuthorSuggestions = noop,
  title,
  link,
  type,
  subtype,
  authors,
  setBannerMessage,
}) => {
  const historyPush = usePushFromHere();
  const [newTitle, setTitle] = useState(title || '');
  const [newLink, setLink] = useState(link || '');
  const [newType, setType] = useState<gp2Model.OutputType | ''>(type || '');
  const [newSubtype, setSubtype] = useState<gp2Model.OutputSubtype | ''>(
    subtype || '',
  );
  const [newAuthors, setAuthors] = useState<
    ComponentPropsWithRef<typeof AuthorSelect>['values']
  >(
    authors?.map((author) => ({
      author,
      label: author.displayName,
      value: author.id,
    })) || [],
  );

  const currentPayload: gp2Model.OutputPostRequest = {
    title: newTitle,
    documentType,
    link: newLink,
    type: newType || undefined,
    subtype: newSubtype || undefined,
    authors: getPostAuthors(newAuthors),
  };
  const isFieldDirty = (original: string = '', current: string) =>
    current !== original;

  const isFormDirty =
    isFieldDirty(title, newTitle) ||
    isFieldDirty(link, newLink) ||
    isFieldDirty(type, newType) ||
    isFieldDirty(subtype, newSubtype) ||
    (authors
      ? !authors.every(
          (author, index) =>
            index ===
            newAuthors?.findIndex((newAuthor) => newAuthor.value === author.id),
        )
      : !!newAuthors?.length);

  return (
    <Form dirty={isFormDirty}>
      {({ isSaving, getWrappedOnSave, onCancel }) => (
        <div css={containerStyles}>
          <FormCard title="What are you sharing?">
            <LabeledTextField
              title="URL"
              subtitle={'(required)'}
              required
              pattern={urlExpression}
              onChange={setLink}
              getValidationMessage={() =>
                'Please enter a valid URL, starting with http://'
              }
              value={newLink ?? ''}
              enabled={!isSaving}
              labelIndicator={<GlobeIcon />}
              placeholder="https://example.com"
            />
            {documentType === 'Article' && (
              <LabeledDropdown
                title="Type"
                subtitle={'(required)'}
                required
                value={newType}
                options={gp2Model.outputTypes.map((name) => ({
                  label: name,
                  value: name,
                }))}
                onChange={setType}
              />
            )}
            {newType === 'Research' && (
              <LabeledDropdown
                title="Subtype"
                subtitle={'(required)'}
                required
                value={newSubtype}
                options={gp2Model.outputSubtypes.map((name) => ({
                  label: name,
                  value: name,
                }))}
                onChange={setSubtype}
              />
            )}
            <LabeledTextField
              title={'Title'}
              subtitle={'(required)'}
              value={newTitle}
              onChange={setTitle}
              required
              enabled={!isSaving}
            />
          </FormCard>
          <FormCard title="Who were the contributors?">
            <AuthorSelect
              title="Authors"
              description=""
              subtitle={'(required)'}
              enabled={!isSaving}
              placeholder="Start typing..."
              loadOptions={getAuthorSuggestions}
              externalLabel="Non GP2"
              onChange={setAuthors}
              values={newAuthors}
              required
              noOptionsMessage={({ inputValue }) =>
                `Sorry, no authors match ${inputValue}`
              }
            />
          </FormCard>
          <div css={footerStyles}>
            <div css={[buttonWrapperStyle, { margin: 0 }]}>
              <Button noMargin enabled={!isSaving} onClick={onCancel}>
                Cancel
              </Button>
            </div>
            <div css={[buttonWrapperStyle, { margin: `0 0 ${rem(32)}` }]}>
              <Button
                primary
                noMargin
                onClick={async () => {
                  const researchOutput = await getWrappedOnSave(() =>
                    shareOutput(currentPayload),
                  )();
                  if (researchOutput) {
                    const path = gp2Routing.outputs({}).$;
                    setBannerMessage(
                      getBannerMessage(entityType, documentType, !title),
                    );
                    historyPush(path);
                  }
                  return researchOutput;
                }}
                enabled={!isSaving}
              >
                {title ? 'Save' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
};

export default OutputForm;

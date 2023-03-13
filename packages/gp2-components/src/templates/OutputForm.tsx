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
import { isInternalUser, UrlExpression } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { ComponentPropsWithRef, useState } from 'react';
import { buttonWrapperStyle, mobileQuery } from '../layout';

import { documentTypeMapper } from './CreateOutputPage';

const { rem } = pixels;

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
  createOutput: (
    payload: gp2Model.OutputPostRequest,
  ) => Promise<gp2Model.OutputResponse>;
  documentType: gp2Routing.OutputDocumentTypeParameter;
  readonly getAuthorSuggestions?: ComponentPropsWithRef<
    typeof AuthorSelect
  >['loadOptions'];
};

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
  createOutput,
  documentType,
  getAuthorSuggestions = noop,
}) => {
  const historyPush = usePushFromHere();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState<gp2Model.OutputType | ''>('');
  const [subtype, setSubtype] = useState<gp2Model.OutputSubtype | ''>('');
  const [authors, setAuthors] = useState<
    ComponentPropsWithRef<typeof AuthorSelect>['values']
  >([]);

  const currentPayload: gp2Model.OutputPostRequest = {
    title,
    documentType: documentTypeMapper[documentType],
    link,
    type: type || undefined,
    subtype: subtype || undefined,
    authors: getPostAuthors(authors),
  };

  return (
    <Form dirty={title !== ''}>
      {({ isSaving, getWrappedOnSave, onCancel }) => (
        <div css={containerStyles}>
          <FormCard title="What are you sharing?">
            <LabeledTextField
              title="URL"
              subtitle={'(required)'}
              required
              pattern={UrlExpression}
              onChange={setLink}
              getValidationMessage={() =>
                'Please enter a valid URL, starting with http://'
              }
              value={link ?? ''}
              enabled={!isSaving}
              labelIndicator={<GlobeIcon />}
              placeholder="https://example.com"
            />
            {documentType === 'article' && (
              <LabeledDropdown
                title="Type"
                subtitle={'(required)'}
                required
                value={type}
                options={gp2Model.outputTypes.map((name) => ({
                  label: name,
                  value: name,
                }))}
                onChange={setType}
              />
            )}
            {type === 'Research' && (
              <LabeledDropdown
                title="Subtype"
                subtitle={'(required)'}
                required
                value={subtype}
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
              value={title}
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
              values={authors}
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
                    createOutput(currentPayload),
                  )();
                  if (researchOutput) {
                    const path = gp2Routing.outputs({}).$;
                    historyPush(path);
                  }
                  return researchOutput;
                }}
                enabled={!isSaving}
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
};

export default OutputForm;

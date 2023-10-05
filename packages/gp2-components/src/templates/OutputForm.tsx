import { gp2 as gp2Model } from '@asap-hub/model';
import {
  AuthorSelect,
  Button,
  Form,
  FormCard,
  GlobeIcon,
  LabeledDateField,
  LabeledDropdown,
  LabeledMultiSelect,
  LabeledRadioButtonGroup,
  LabeledTextArea,
  LabeledTextField,
  Link,
  mail,
  Markdown,
  noop,
  pixels,
} from '@asap-hub/react-components';
import { useNotificationContext } from '@asap-hub/react-context';

import { gp2 as gp2Routing } from '@asap-hub/routing';
import { isInternalUser, urlExpression } from '@asap-hub/validation';
import { css } from '@emotion/react';
import {
  ComponentProps,
  ComponentPropsWithRef,
  useEffect,
  useState,
} from 'react';
import { buttonWrapperStyle, mobileQuery } from '../layout';
import { OutputIdentifier } from '../organisms/OutputIdentifier';
import OutputRelatedResearchCard from '../organisms/OutputRelatedResearchCard';
import { createIdentifierField } from '../utils';
import { EntityMappper } from './CreateOutputPage';

const { rem } = pixels;
const { mailToSupport, INVITE_SUPPORT_EMAIL } = mail;

const DOC_TYPES_GP2_SUPPORTED_NOT_REQUIRED = [
  'Training Materials',
  'Procedural Form',
];

export const getRelatedOutputs = (
  relatedOutputs: gp2Model.OutputResponse['relatedOutputs'],
) =>
  relatedOutputs.map(({ id, title, type, documentType }) => ({
    value: id,
    label: title,
    type,
    documentType,
  }));

const getBannerMessage = (
  entityType: 'workingGroup' | 'project',
  documentType: gp2Model.OutputDocumentType,
  published: boolean,
) =>
  `${EntityMappper[entityType]} ${documentType} ${
    published ? 'published' : 'saved'
  } successfully.`;

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const footerStyles = css({
  display: 'flex',
  gap: rem(24),
  justifyContent: 'flex-end',
  [mobileQuery]: {
    flexDirection: 'column-reverse',
  },
});

const linkStyles = css({
  marginBottom: rem(36),
});
const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
});
type OutputFormProps = {
  entityType: 'workingGroup' | 'project';
  shareOutput: (
    payload: gp2Model.OutputPostRequest,
  ) => Promise<gp2Model.OutputResponse | undefined>;
  documentType: gp2Model.OutputDocumentType;
  readonly getAuthorSuggestions?: ComponentPropsWithRef<
    typeof AuthorSelect
  >['loadOptions'];
  tagSuggestions: gp2Model.TagDataObject[];
  getRelatedOutputSuggestions: NonNullable<
    ComponentProps<
      typeof OutputRelatedResearchCard
    >['getRelatedResearchSuggestions']
  >;
} & Partial<
  Pick<
    gp2Model.OutputResponse,
    | 'title'
    | 'link'
    | 'type'
    | 'subtype'
    | 'description'
    | 'gp2Supported'
    | 'sharingStatus'
    | 'publishDate'
    | 'authors'
    | 'tags'
    | 'doi'
    | 'rrid'
    | 'accessionNumber'
    | 'relatedOutputs'
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

const OutputForm: React.FC<OutputFormProps> = ({
  entityType,
  shareOutput,
  documentType,
  tagSuggestions,
  getAuthorSuggestions = noop,
  title,
  link,
  type,
  subtype,
  description,
  gp2Supported,
  sharingStatus,
  publishDate,
  authors,
  tags,
  doi,
  rrid,
  accessionNumber,
  relatedOutputs = [],
  getRelatedOutputSuggestions,
}) => {
  const isAlwaysPublic = documentType === 'Training Materials';
  const [isGP2SupportedAlwaysTrue, setIsGP2SupportedAlwaysTrue] = useState(
    Boolean(type === 'Blog' || documentType === 'GP2 Reports'),
  );

  const [newTitle, setTitle] = useState(title || '');
  const [newLink, setLink] = useState(link || '');
  const [newType, setType] = useState<gp2Model.OutputType | ''>(type || '');
  const [newSubtype, setSubtype] = useState<gp2Model.OutputSubtype | ''>(
    subtype || '',
  );
  const [newDescription, setDescription] = useState(description || '');
  const [newGp2Supported, setGp2Supported] = useState<gp2Model.DecisionOption>(
    isGP2SupportedAlwaysTrue ? 'Yes' : gp2Supported || "Don't Know",
  );
  const [newSharingStatus, setSharingStatus] =
    useState<gp2Model.OutputSharingStatus>(
      isAlwaysPublic ? 'Public' : sharingStatus || 'GP2 Only',
    );

  const [newPublishDate, setPublishDate] = useState<Date | undefined>(
    publishDate ? new Date(publishDate) : undefined,
  );
  const [newRelatedOutputs, setRelatedOutputs] = useState<
    NonNullable<
      ComponentProps<typeof OutputRelatedResearchCard>['relatedResearch']
    >
  >(getRelatedOutputs(relatedOutputs));

  const [newAuthors, setAuthors] = useState<
    ComponentPropsWithRef<typeof AuthorSelect>['values']
  >(
    authors?.map((author) => ({
      author,
      label: author.displayName,
      value: author.id,
    })) || [],
  );
  const [newTags, setNewTags] = useState<gp2Model.TagDataObject[]>(tags || []);

  const identifierType: gp2Model.OutputIdentifierType = doi
    ? gp2Model.OutputIdentifierType.DOI
    : rrid
    ? gp2Model.OutputIdentifierType.RRID
    : accessionNumber
    ? gp2Model.OutputIdentifierType.AccessionNumber
    : title // if it's editing
    ? gp2Model.OutputIdentifierType.None
    : gp2Model.OutputIdentifierType.Empty;
  const [newIdentifierType, setNewIdentifierType] =
    useState<gp2Model.OutputIdentifierType>(identifierType);

  const [identifier, setIdentifier] = useState<string>(
    doi || rrid || accessionNumber || '',
  );
  const { addNotification } = useNotificationContext();

  const setBannerMessage = (message: string) =>
    addNotification({
      message: capitalizeFirstLetter(message),
      page: 'outputs',
      type: 'success',
    });

  const currentPayload: gp2Model.OutputPostRequest = {
    title: newTitle,
    documentType,
    link: newLink,
    type: newType || undefined,
    subtype: newSubtype || undefined,
    description: newDescription || undefined,
    gp2Supported: DOC_TYPES_GP2_SUPPORTED_NOT_REQUIRED.includes(documentType)
      ? undefined
      : newGp2Supported,
    sharingStatus: newSharingStatus,
    publishDate: newPublishDate?.toISOString(),
    authors: getPostAuthors(newAuthors),
    tags: newTags.length > 0 ? newTags : undefined,
    relatedOutputs: newRelatedOutputs.map((output) => ({
      id: output.value,
      title: output.label,
      documentType: output.documentType as gp2Model.OutputDocumentType,
    })),
    ...createIdentifierField(newIdentifierType, identifier),
  };

  useEffect(() => {
    const newisGP2SupportedAlwaysTrue = Boolean(
      newType === 'Blog' || documentType === 'GP2 Reports',
    );

    if (newisGP2SupportedAlwaysTrue) {
      setGp2Supported('Yes');
    }

    setIsGP2SupportedAlwaysTrue(newisGP2SupportedAlwaysTrue);
  }, [newType, documentType]);

  const isFieldDirty = (original: string = '', current: string) =>
    current !== original;

  const isFormDirty =
    isFieldDirty(title, newTitle) ||
    isFieldDirty(link, newLink) ||
    isFieldDirty(type, newType) ||
    isFieldDirty(subtype, newSubtype) ||
    isFieldDirty(identifierType, newIdentifierType) ||
    (authors
      ? !authors.every(
          (author, index) =>
            index ===
            newAuthors?.findIndex((newAuthor) => newAuthor.value === author.id),
        )
      : !!newAuthors?.length);

  return (
    <Form dirty={isFormDirty}>
      {({ isSaving, getWrappedOnSave, onCancel, setRedirectOnSave }) => (
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
            <LabeledTextArea
              title="Description"
              subtitle="(required)"
              tip="Add an abstract or a summary that describes this work."
              onChange={setDescription}
              getValidationMessage={() => 'Please enter a description'}
              required
              enabled={!isSaving}
              value={newDescription}
              info={
                <Markdown
                  value={`**Markup Language**\n\n**Bold:** \\*\\*your text\\*\\*\n\n**Italic:** \\*your text\\*\n\n**H1:** \\# Your Text\n\n**H2:** \\#\\# Your Text\n\n**H3:** \\#\\#\\# Your Text\n\n**Hyperlink:** [your text](https://example.com)\n\n**New Paragraph:** To create a line break, you will need to press the enter button twice.
        `}
                ></Markdown>
              }
            />
            {!DOC_TYPES_GP2_SUPPORTED_NOT_REQUIRED.includes(documentType) ? (
              <LabeledRadioButtonGroup<gp2Model.DecisionOption>
                title="Has this output been supported by GP2?"
                subtitle="(required)"
                options={[
                  {
                    value: 'Yes',
                    label: 'Yes',
                    disabled: isGP2SupportedAlwaysTrue,
                  },
                  {
                    value: 'No',
                    label: 'No',
                    disabled: isGP2SupportedAlwaysTrue,
                  },
                  {
                    value: "Don't Know",
                    label: "Don't Know",
                    disabled: isGP2SupportedAlwaysTrue,
                  },
                ]}
                value={newGp2Supported}
                onChange={setGp2Supported}
              />
            ) : null}
            <LabeledRadioButtonGroup<gp2Model.OutputSharingStatus>
              title="Sharing status"
              subtitle="(required)"
              options={[
                {
                  value: 'GP2 Only',
                  label: 'GP2 Only',
                  disabled: isAlwaysPublic,
                },
                { value: 'Public', label: 'Public', disabled: isAlwaysPublic },
              ]}
              value={newSharingStatus}
              onChange={setSharingStatus}
            />
            {newSharingStatus === 'Public' ? (
              <LabeledDateField
                title="Public Repository Published Date"
                subtitle="(optional)"
                description="This should be the date your output was shared publicly on its repository."
                onChange={(date) =>
                  setPublishDate(date ? new Date(date) : undefined)
                }
                value={newPublishDate}
                max={new Date()}
                getValidationMessage={(e) => getPublishDateValidationMessage(e)}
              />
            ) : null}
          </FormCard>
          <FormCard title="What extra information can you provide?">
            <LabeledMultiSelect
              title="Additional Tags"
              subtitle="(optional)"
              description={
                <>
                  Increase the discoverability of this output by adding
                  keywords.{' '}
                </>
              }
              values={newTags.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              enabled={!isSaving}
              suggestions={tagSuggestions.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              onChange={(newValues) => {
                setNewTags(
                  newValues
                    .slice(0, 10)
                    .reduce(
                      (acc, curr) => [
                        ...acc,
                        { id: curr.value, name: curr.label },
                      ],
                      [] as gp2Model.TagDataObject[],
                    ),
                );
              }}
              placeholder="Start typing... (E.g. Neurology)"
              maxMenuHeight={160}
            />
            <div css={linkStyles}>
              <Link
                href={mailToSupport({
                  email: INVITE_SUPPORT_EMAIL,
                  subject: 'New Keyword',
                })}
              >
                Ask GP2 to add a new keyword
              </Link>
            </div>

            {documentType !== 'GP2 Reports' &&
            documentType !== 'Training Materials' ? (
              <OutputIdentifier
                documentType={documentType}
                identifier={identifier}
                setIdentifier={setIdentifier}
                identifierType={newIdentifierType}
                setIdentifierType={setNewIdentifierType}
                enabled={!isSaving}
              />
            ) : null}
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
          <OutputRelatedResearchCard
            isSaving={isSaving}
            relatedResearch={newRelatedOutputs}
            onChangeRelatedResearch={setRelatedOutputs}
            getRelatedResearchSuggestions={getRelatedOutputSuggestions}
          />
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
                  const output = await getWrappedOnSave(() =>
                    shareOutput(currentPayload),
                  )();
                  if (output) {
                    const path = gp2Routing.outputs({}).$;
                    setBannerMessage(
                      getBannerMessage(entityType, documentType, !title),
                    );
                    setRedirectOnSave(path);
                  }
                  return output;
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

export const getPublishDateValidationMessage = (e: ValidityState): string => {
  if (e.badInput) {
    return 'Date published should be complete or removed';
  }
  return 'Publish date cannot be greater than today';
};

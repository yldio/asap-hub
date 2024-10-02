import {
  AuthorResponse,
  gp2 as gp2Model,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  AuthorSelect,
  Button,
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
  ResearchOutputRelatedEventsCard,
  ajvErrors,
  OutputVersions,
  OutputShortDescriptionCard,
  MultiSelectOptionsType,
  OptionsType,
} from '@asap-hub/react-components';
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
import OutputRelatedEventsCard from '../organisms/OutputRelatedEventsCard';
import { Form, OutputIdentifier } from '../organisms';
import OutputRelatedResearchCard from '../organisms/OutputRelatedResearchCard';
import { createIdentifierField, getIconForDocumentType } from '../utils';
import { ConfirmAndSaveOutput } from '../organisms/ConfirmAndSaveOutput';
import { GetWrappedOnSave } from '../organisms/Form';

const { rem } = pixels;
const { mailToSupport, INVITE_SUPPORT_EMAIL } = mail;
const { getAjvErrorForPath } = ajvErrors;

const DOC_TYPES_GP2_SUPPORTED_NOT_REQUIRED = [
  'Training Materials',
  'Procedural Form',
];
const DOC_TYPES_IDENTIFIER_NOT_REQUIRED: gp2Model.OutputDocumentType[] = [
  'Training Materials',
  'GP2 Reports',
];
const DOC_TYPES_COHORTS_NOT_REQUIRED: gp2Model.OutputDocumentType[] = [
  'Training Materials',
  'GP2 Reports',
  'Code/Software',
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

export const getRelatedEvents = (
  relatedOutputs: gp2Model.OutputResponse['relatedEvents'],
) =>
  relatedOutputs.map(({ id, title: label, endDate }) => ({
    value: id,
    label,
    endDate,
  }));

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
  ) => Promise<gp2Model.OutputResponse | void>;
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
  cohortSuggestions: gp2Model.ContributingCohortDataObject[];
  workingGroupSuggestions: Pick<
    gp2Model.WorkingGroupDataObject,
    'id' | 'title'
  >[];
  projectSuggestions: Pick<gp2Model.ProjectDataObject, 'id' | 'title'>[];
  mainEntityId: string;
  getRelatedEventSuggestions: NonNullable<
    ComponentProps<
      typeof ResearchOutputRelatedEventsCard
    >['getRelatedEventSuggestions']
  >;
  getShortDescriptionFromDescription: (description: string) => Promise<string>;
  serverValidationErrors?: ValidationErrorResponse['data'];
  clearServerValidationError?: (instancePath: string) => void;
  createVersion?: boolean;
} & Partial<
  Pick<
    gp2Model.OutputResponse,
    | 'addedDate'
    | 'title'
    | 'link'
    | 'type'
    | 'subtype'
    | 'description'
    | 'shortDescription'
    | 'gp2Supported'
    | 'sharingStatus'
    | 'publishDate'
    | 'authors'
    | 'tags'
    | 'doi'
    | 'rrid'
    | 'accessionNumber'
    | 'contributingCohorts'
    | 'workingGroups'
    | 'projects'
    | 'relatedOutputs'
    | 'relatedEvents'
    | 'versions'
  >
>;

export const getPostAuthors = (
  authors: ComponentPropsWithRef<typeof AuthorSelect>['values'],
) =>
  (
    authors as OptionsType<MultiSelectOptionsType & { author?: AuthorResponse }>
  )?.map(({ value, author }) => {
    if (author) {
      return isInternalUser(author)
        ? { userId: value }
        : { externalUserId: value };
    }
    return { externalUserName: value };
  });

const isFieldDirty = (current: string, original: string = '') =>
  current !== original;

const hasId = (obj: { id?: string; value?: string }): obj is { id: string } =>
  !!(obj.id as unknown as { id: string });

const isArrayDirty = (
  items?: readonly { id: string }[],
  newItems?: readonly { id: string }[] | readonly { value: string }[],
) =>
  items
    ? !items.every(
        ({ id }, index) =>
          index ===
          newItems?.findIndex(
            (newItem) => (hasId(newItem) ? newItem.id : newItem.value) === id,
          ),
      )
    : !!newItems?.length;
const toId = ({ id }: { id: string }) => id;

const OutputForm: React.FC<OutputFormProps> = ({
  addedDate,
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
  shortDescription,
  gp2Supported,
  sharingStatus,
  publishDate,
  authors,
  tags,
  doi,
  rrid,
  accessionNumber,
  relatedOutputs = [],
  relatedEvents = [],
  getRelatedOutputSuggestions,
  getShortDescriptionFromDescription,
  cohortSuggestions,
  contributingCohorts,
  mainEntityId,
  workingGroups,
  projects,
  workingGroupSuggestions,
  projectSuggestions,
  getRelatedEventSuggestions,
  serverValidationErrors = [],
  clearServerValidationError = noop,
  createVersion = false,
  versions = [],
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
  const [newShortDescription, setShortDescription] = useState(
    shortDescription || '',
  );
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

  const [newWorkingGroups, setWorkingGroups] = useState<gp2Model.OutputOwner[]>(
    workingGroups || [],
  );

  const [newProjects, setProjects] = useState<gp2Model.OutputOwner[]>(
    projects || [],
  );
  const [urlValidationMessage, setUrlValidationMessage] = useState<string>();
  const [titleValidationMessage, setTitleValidationMessage] =
    useState<string>();

  const [newCohorts, setCohorts] = useState<
    gp2Model.ContributingCohortDataObject[]
  >(contributingCohorts || []);
  const [newRelatedEvents, setRelatedEvents] = useState<
    NonNullable<
      ComponentProps<typeof ResearchOutputRelatedEventsCard>['relatedEvents']
    >
  >(getRelatedEvents(relatedEvents));

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

  const outMainEntity = ({ id }: { id: string }) => id !== mainEntityId;
  const currentPayload: gp2Model.OutputPostRequest = {
    createVersion,
    title: newTitle,
    documentType,
    link: newLink,
    type: newType || undefined,
    subtype: newSubtype || undefined,
    description: newDescription || undefined,
    shortDescription: newShortDescription || undefined,
    gp2Supported: DOC_TYPES_GP2_SUPPORTED_NOT_REQUIRED.includes(documentType)
      ? undefined
      : newGp2Supported,
    sharingStatus: newSharingStatus,
    publishDate: newPublishDate?.toISOString(),
    authors: getPostAuthors(newAuthors),
    tagIds: newTags.map(toId),
    mainEntityId,
    contributingCohortIds: newCohorts.map(toId),
    workingGroupIds:
      newWorkingGroups.length > 0
        ? newWorkingGroups.filter(outMainEntity).map(toId)
        : undefined,
    projectIds:
      newProjects.length > 0
        ? newProjects.filter(outMainEntity).map(toId)
        : undefined,
    relatedOutputIds: newRelatedOutputs.map(({ value }) => value),
    relatedEventIds: newRelatedEvents.map(({ value }) => value),
    ...createIdentifierField(newIdentifierType, identifier),
  };

  const versionList: ComponentProps<typeof OutputVersions>['versions'] =
    createVersion
      ? [
          ...versions,
          {
            id: '0',
            documentType,
            type,
            title: title || '',
            link,
            addedDate,
          },
        ]
      : versions;

  useEffect(() => {
    const newisGP2SupportedAlwaysTrue = Boolean(
      newType === 'Blog' || documentType === 'GP2 Reports',
    );

    if (newisGP2SupportedAlwaysTrue) {
      setGp2Supported('Yes');
    }

    setIsGP2SupportedAlwaysTrue(newisGP2SupportedAlwaysTrue);
  }, [newType, documentType]);

  useEffect(() => {
    setUrlValidationMessage(
      getAjvErrorForPath(
        serverValidationErrors,
        '/link',
        'An Output with this URL already exists. Please enter a different URL.',
      ),
    );
    setTitleValidationMessage(
      getAjvErrorForPath(
        serverValidationErrors,
        '/title',
        'An Output with this title already exists. Please check if this is repeated and choose a different title.',
      ),
    );
  }, [serverValidationErrors]);

  const isFormDirty =
    isFieldDirty(newTitle, title) ||
    isFieldDirty(newLink, link) ||
    isFieldDirty(newType, type) ||
    isFieldDirty(newSubtype, subtype) ||
    isFieldDirty(newIdentifierType, identifierType) ||
    isFieldDirty(newSharingStatus, sharingStatus) ||
    isFieldDirty(newGp2Supported, gp2Supported) ||
    isArrayDirty(workingGroups, newWorkingGroups) ||
    isArrayDirty(projects, newProjects) ||
    isArrayDirty(tags, newTags) ||
    isArrayDirty(contributingCohorts, newCohorts) ||
    isArrayDirty(authors, newAuthors as OptionsType<MultiSelectOptionsType>) ||
    isArrayDirty(relatedOutputs, newRelatedOutputs) ||
    isArrayDirty(relatedEvents, newRelatedEvents);
  return (
    <Form dirty={isFormDirty} serverErrors={serverValidationErrors}>
      {({ isSaving, getWrappedOnSave, onCancel, setRedirectOnSave }) => {
        const isEditing = link !== undefined;

        return (
          <>
            <ConfirmAndSaveOutput
              getWrappedOnSave={
                getWrappedOnSave as unknown as GetWrappedOnSave<gp2Model.OutputResponse>
              }
              setRedirectOnSave={setRedirectOnSave}
              documentType={documentType}
              title={title}
              shareOutput={shareOutput}
              createVersion={createVersion}
              isEditing={isEditing}
              entityType={entityType}
              path={(id: string) =>
                gp2Routing.outputs({}).output({ outputId: id }).$
              }
              currentPayload={currentPayload}
            >
              {({ save }) => (
                <div css={containerStyles}>
                  {versionList.length > 0 && (
                    <OutputVersions
                      versions={versionList}
                      versionAction="edit"
                    />
                  )}
                  <FormCard title="What are you sharing?">
                    <LabeledTextField
                      title={'Title'}
                      subtitle={'(required)'}
                      value={newTitle}
                      customValidationMessage={titleValidationMessage}
                      getValidationMessage={(validationState) =>
                        validationState.valueMissing ||
                        validationState.patternMismatch
                          ? 'Please enter a title.'
                          : undefined
                      }
                      onChange={(newValue) => {
                        clearServerValidationError('/title');
                        setTitle(newValue);
                      }}
                      required
                      enabled={!isSaving}
                    />
                    <LabeledTextField
                      title="URL"
                      subtitle={'(required)'}
                      required
                      pattern={urlExpression}
                      onChange={(newValue) => {
                        clearServerValidationError('/link');
                        setLink(newValue);
                      }}
                      getValidationMessage={(validationState) =>
                        validationState.valueMissing ||
                        validationState.patternMismatch
                          ? 'Please enter a valid URL, starting with http://'
                          : undefined
                      }
                      customValidationMessage={urlValidationMessage}
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
                          value={`**Markup Language**\n\n**Bold:** \\*\\*your text\\*\\*\n\n**Italic:** \\*your text\\*\n\n**H1:** \\# Your Text\n\n**H2:** \\#\\# Your Text\n\n**H3:** \\#\\#\\# Your Text\n\n**Superscript:** ^<p>Your Text</p>^\n\n**Subscript:** ~<p>Your Text</p>~\n\n**Hyperlink:** \\[your text](https://example.com)\n\n**New Paragraph:** To create a line break, you will need to press the enter button twice.
        `}
                        ></Markdown>
                      }
                    />
                    <OutputShortDescriptionCard
                      onChange={setShortDescription}
                      buttonEnabled={newDescription.length > 0}
                      enabled={!isSaving}
                      value={newShortDescription}
                      getShortDescription={() =>
                        getShortDescriptionFromDescription(newDescription)
                      }
                    />
                    {!DOC_TYPES_GP2_SUPPORTED_NOT_REQUIRED.includes(
                      documentType,
                    ) ? (
                      <LabeledRadioButtonGroup<gp2Model.DecisionOption>
                        title="Has this output been supported by GP2?"
                        subtitle="(required)"
                        options={[
                          {
                            value: 'Yes',
                            label: 'Yes',
                            disabled: isSaving,
                          },
                          {
                            value: 'No',
                            label: 'No',
                            disabled: isGP2SupportedAlwaysTrue || isSaving,
                          },
                          {
                            value: "Don't Know",
                            label: "Don't Know",
                            disabled: isGP2SupportedAlwaysTrue || isSaving,
                          },
                        ]}
                        value={newGp2Supported}
                        onChange={setGp2Supported}
                        tooltipText="This option is not available for this document type."
                      />
                    ) : null}
                    <LabeledRadioButtonGroup<gp2Model.OutputSharingStatus>
                      title="Sharing status"
                      subtitle="(required)"
                      options={[
                        {
                          value: 'GP2 Only',
                          label: 'GP2 Only',
                          disabled: isAlwaysPublic || isSaving,
                        },
                        {
                          value: 'Public',
                          label: 'Public',
                          disabled: isSaving,
                        },
                      ]}
                      value={newSharingStatus}
                      onChange={setSharingStatus}
                      tooltipText="This option is not available for this document type."
                    />
                    {newSharingStatus === 'Public' ? (
                      <LabeledDateField
                        title="Public Repository Published Date"
                        subtitle="(optional)"
                        description="This should be the date your output was shared publicly on its repository."
                        onChange={(date) =>
                          setPublishDate(date ? new Date(date) : undefined)
                        }
                        enabled={!isSaving}
                        value={newPublishDate}
                        max={new Date()}
                        getValidationMessage={(e) =>
                          getPublishDateValidationMessage(e)
                        }
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

                    {!DOC_TYPES_IDENTIFIER_NOT_REQUIRED.includes(
                      documentType,
                    ) ? (
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
                    <LabeledMultiSelect
                      title="Working Groups"
                      description="Add other working groups that contributed to this output. Those working groups will also then be able to edit."
                      subtitle={
                        entityType === 'project' ? '(optional)' : '(required)'
                      }
                      required={entityType === 'workingGroup'}
                      enabled={!isSaving}
                      placeholder="Start typing..."
                      suggestions={workingGroupSuggestions.map(
                        (workingGroup) => ({
                          label: workingGroup.title,
                          value: workingGroup.id,
                        }),
                      )}
                      onChange={(newValues) => {
                        setWorkingGroups(
                          newValues
                            .slice(0, 10)
                            .reduce(
                              (acc, curr) => [
                                ...acc,
                                { id: curr.value, title: curr.label },
                              ],
                              [] as gp2Model.OutputOwner[],
                            ),
                        );
                      }}
                      values={newWorkingGroups.map((workingGroup, idx) => ({
                        label: workingGroup.title,
                        value: workingGroup.id,
                        isFixed: idx === 0 && entityType === 'workingGroup',
                      }))}
                      noOptionsMessage={({ inputValue }) =>
                        `Sorry, no working groups match ${inputValue}`
                      }
                    />
                    <LabeledMultiSelect
                      title="Projects"
                      description="Add other projects that contributed to this output. Those projects will also then be able to edit."
                      subtitle={
                        entityType === 'project' ? '(required)' : '(optional)'
                      }
                      enabled={!isSaving}
                      required={entityType === 'project'}
                      placeholder="Start typing..."
                      suggestions={projectSuggestions.map((project) => ({
                        label: project.title,
                        value: project.id,
                      }))}
                      onChange={(newValues) => {
                        setProjects(
                          newValues
                            .slice(0, 10)
                            .reduce(
                              (acc, curr) => [
                                ...acc,
                                { id: curr.value, title: curr.label },
                              ],
                              [] as gp2Model.OutputOwner[],
                            ),
                        );
                      }}
                      values={newProjects.map((project, idx) => ({
                        label: project.title,
                        value: project.id,
                        isFixed: idx === 0 && entityType === 'project',
                      }))}
                      noOptionsMessage={({ inputValue }) =>
                        `Sorry, no projects match ${inputValue}`
                      }
                    />
                    {!DOC_TYPES_COHORTS_NOT_REQUIRED.includes(documentType) ? (
                      <>
                        <LabeledMultiSelect
                          title="Cohorts"
                          subtitle="(optional)"
                          description={
                            <>
                              Add other cohorts that contributed to this output.
                            </>
                          }
                          values={newCohorts.map(({ id, name }) => ({
                            label: name,
                            value: id,
                          }))}
                          enabled={!isSaving}
                          suggestions={cohortSuggestions.map(
                            ({ id, name }) => ({
                              label: name,
                              value: id,
                            }),
                          )}
                          onChange={(newValues) => {
                            setCohorts(
                              newValues
                                .slice(0, 10)
                                .reduce(
                                  (acc, curr) => [
                                    ...acc,
                                    { id: curr.value, name: curr.label },
                                  ],
                                  [] as gp2Model.ContributingCohortDataObject[],
                                ),
                            );
                          }}
                          placeholder="Start typing..."
                          maxMenuHeight={160}
                        />
                        <div css={linkStyles}>
                          Don’t see a cohort in this list?{' '}
                          <Link
                            href={mailToSupport({
                              email: INVITE_SUPPORT_EMAIL,
                              subject: 'New Cohort',
                            })}
                          >
                            Contact {INVITE_SUPPORT_EMAIL}
                          </Link>
                        </div>
                      </>
                    ) : null}
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
                    getIconForDocumentType={getIconForDocumentType}
                    isEditMode={true}
                  />
                  <OutputRelatedEventsCard
                    getRelatedEventSuggestions={getRelatedEventSuggestions}
                    isSaving={isSaving}
                    relatedEvents={newRelatedEvents}
                    onChangeRelatedEvents={setRelatedEvents}
                    isEditMode={true}
                  />
                  <div css={footerStyles}>
                    <div css={[buttonWrapperStyle, { margin: 0 }]}>
                      <Button noMargin enabled={!isSaving} onClick={onCancel}>
                        Cancel
                      </Button>
                    </div>
                    <div
                      css={[buttonWrapperStyle, { margin: `0 0 ${rem(32)}` }]}
                    >
                      <Button
                        primary
                        noMargin
                        onClick={save}
                        enabled={!isSaving}
                      >
                        {isEditing && !createVersion ? 'Save' : 'Publish'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ConfirmAndSaveOutput>
          </>
        );
      }}
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

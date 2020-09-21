import React, { useState, useRef } from 'react';
import css from '@emotion/css';
import {
  ResearchOutputType,
  ResearchOutputAccessLevel,
  ResearchOutputFormData,
} from '@asap-hub/model';

import { Headline2, Button, Paragraph } from '../atoms';
import {
  LabeledTextField,
  LabeledDropdown,
  LabeledDateField,
  LabeledTextArea,
} from '../molecules';
import { RadioButtonGroup } from '../organisms';
import { perRem } from '../pixels';
import { lead } from '../colors';
import { noop } from '../utils';

const containerStyles = css({
  width: 'max-content',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
});
const sectionHeadingPaddingStyles = css({
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${12 / perRem}em`,
});
const buttonStyles = css({
  display: 'flex',
  flexDirection: 'column',

  paddingTop: `${24 / perRem}em`,
});
const linkStyles = css({
  display: 'flex',
  justifyContent: 'center',
});
const titleOptionalStyles = css({
  color: lead.rgb,
  fontWeight: 'lighter',
});

interface RecordOutputFormProps {
  onPreview?: (formData: ResearchOutputFormData) => void;
  onPublish?: (formData: ResearchOutputFormData) => void;
}
const RecordOutputForm: React.FC<RecordOutputFormProps> = ({
  onPreview = noop,
  onPublish = noop,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [url, setUrl] = useState('');
  const [doi, setDoi] = useState('');
  const [type, setType] = useState<ResearchOutputType>('proposal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authors, setAuthors] = useState('');
  const [publishDate, setPublishDate] = useState<Date>();
  const [accessLevel, setAccessLevel] = useState<ResearchOutputAccessLevel>(
    'private',
  );

  const formData: ResearchOutputFormData = {
    url,
    doi,
    type,
    title,
    text: description,
    authors: authors.split(/,|\n/m).map((author) => author.trim()),
    publishDate,
    accessLevel,
  };

  return (
    <form ref={formRef} css={containerStyles}>
      <div css={sectionHeadingPaddingStyles}>
        <Headline2 styleAsHeading={3}>Link the output</Headline2>
      </div>
      <LabeledTextField
        required
        title="Add a URL"
        value={url}
        onChange={setUrl}
      />
      <LabeledTextField
        title={
          <>
            Add a DOI
            <span css={titleOptionalStyles}> (Optional)</span>
          </>
        }
        value={doi}
        onChange={setDoi}
      />
      <div css={sectionHeadingPaddingStyles}>
        <Headline2 styleAsHeading={3}>About the output</Headline2>
      </div>
      <LabeledDropdown<ResearchOutputType>
        options={[
          { value: 'proposal', label: 'Proposal' },
          // { value: 'dataset', label: 'Dataset' },
          // { value: 'code', label: 'Code' },
          // { value: 'protocol', label: 'Protocol' },
          // { value: 'resource', label: 'Resource' },
          // { value: 'preprint', label: 'Preprint' },
          // { value: 'other', label: 'Other' },
        ]}
        title="Type of output"
        value={type}
        onChange={setType}
      />
      <LabeledTextField
        required
        indicateValid={false}
        title="Title"
        value={title}
        onChange={setTitle}
      />
      <LabeledTextArea
        required
        title="Description"
        value={description}
        onChange={setDescription}
      />
      <LabeledTextArea
        required
        title="Authors"
        value={authors}
        onChange={setAuthors}
      />
      <LabeledDateField
        title={
          <>
            Original publishing date
            <span css={titleOptionalStyles}> (Optional)</span>
          </>
        }
        value={publishDate}
        onChange={setPublishDate}
      />
      <div css={sectionHeadingPaddingStyles}>
        <Headline2 styleAsHeading={3}>Who should have access</Headline2>
      </div>
      <RadioButtonGroup<ResearchOutputAccessLevel>
        options={[
          { value: 'private', label: 'Only me (Record privately to ASAP)' },
          { value: 'team', label: 'My team' },
          { value: 'public', label: 'Everyone in the ASAP Network' },
        ]}
        value={accessLevel}
        onChange={setAccessLevel}
      />
      <div css={buttonStyles}>
        <Button
          primary
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
              onPreview(formData);
            }
          }}
        >
          Preview
        </Button>
      </div>
      <div css={linkStyles}>
        <Paragraph>
          <Button
            linkStyle
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              if (formRef.current!.reportValidity()) {
                onPublish(formData);
              }
            }}
          >
            Skip preview and publish
          </Button>
        </Paragraph>
      </div>
    </form>
  );
};

export default RecordOutputForm;

import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Button,
  FormCard,
  LabeledTextField,
  Form,
  GlobeIcon,
  LabeledDropdown,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { UrlExpression } from '@asap-hub/validation';
import { useState } from 'react';
import { documentTypeMapper } from './CreateOutputPage';

type OutputFormType = {
  createOutput: (
    payload: gp2Model.OutputPostRequest,
  ) => Promise<gp2Model.OutputResponse>;
  documentType: gp2Routing.OutputDocumentTypeParameter;
};
const OutputForm: React.FC<OutputFormType> = ({
  createOutput,
  documentType,
}) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('');
  const [subtype, setSubtype] = useState('');
  const currentPayload = {
    title,
    documentType: documentTypeMapper[documentType],
    link,
    type: type ? (type as gp2Model.OutputType) : undefined,
    subtype: subtype ? (subtype as gp2Model.OutputSubtype) : undefined,
  };

  return (
    <Form dirty={title !== ''}>
      {({ isSaving, getWrappedOnSave }) => (
        <>
          <FormCard title="What are you sharing?">
            <LabeledTextField
              title="URL"
              subtitle={'(required)'}
              required
              pattern={UrlExpression}
              onChange={setLink}
              getValidationMessage={(validationState) =>
                validationState.valueMissing || validationState.patternMismatch
                  ? 'Please enter a valid URL, starting with http://'
                  : undefined
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
          <Button
            primary
            onClick={getWrappedOnSave(() => createOutput(currentPayload))}
          >
            Publish
          </Button>
        </>
      )}
    </Form>
  );
};

export default OutputForm;

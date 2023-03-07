import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Button,
  FormCard,
  LabeledTextField,
  Form,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';

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
  const currentPayload = {
    title,
    documentType: documentTypeMapper[documentType],
  };

  return (
    <Form onSave={() => createOutput(currentPayload)} dirty={false}>
      {({ isSaving, onSave, onCancel }) => (
        <div>
          <FormCard title="What are you sharing?">
            <LabeledTextField
              title={'Title'}
              subtitle={'(required)'}
              value={title}
              onChange={setTitle}
              required
              enabled={!isSaving}
            />
          </FormCard>
          <Button primary onClick={onSave}>
            Publish
          </Button>
        </div>
      )}
    </Form>
  );
};

export default OutputForm;

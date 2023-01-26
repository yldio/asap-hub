import { gp2 } from '@asap-hub/model';
import { Keyword } from '@asap-hub/model/src/gp2';
import { LabeledMultiSelect } from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import { ContactSupport } from '../molecules';
import EditUserModal from './EditUserModal';

type KeywordsModalProps = Pick<gp2.UserResponse, 'keywords'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
  };

const KeywordsModal: React.FC<KeywordsModalProps> = ({
  onSave,
  backHref,
  keywords,
}) => {
  const [newKeywords, setNewKeywords] = useState<Keyword[]>(keywords || []);

  const checkDirty = () =>
    (!keywords && newKeywords.length) ||
    (!!keywords && !keywords.every((val, index) => val === newKeywords[index]));

  return (
    <EditUserModal
      title="Keywords"
      description="Help others to understand your areas of expertise or what you’re passionate about."
      onSave={() => onSave({ keywords: newKeywords })}
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <>
          <LabeledMultiSelect
            title="Keywords"
            subtitle="(required)"
            description={
              <>
                Select up to ten.{' '}
                <span css={{ fontStyle: 'italic' }}>
                  <ContactSupport preContactText="Need to request a new keyword?" />{' '}
                </span>
              </>
            }
            values={newKeywords.map((keyword) => ({
              label: keyword,
              value: keyword,
            }))}
            required
            enabled={!isSaving}
            suggestions={gp2.keywords.map((suggestion) => ({
              label: suggestion,
              value: suggestion,
            }))}
            onChange={(newValues) => {
              setNewKeywords(
                newValues.reduce(
                  (acc, curr) => [...acc, curr.value],
                  [] as Keyword[],
                ),
              );
            }}
            placeholder="Start typing..."
            maxMenuHeight={125}
            getValidationMessage={() => 'Please add your keywords'}
          />
        </>
      )}
    </EditUserModal>
  );
};

export default KeywordsModal;

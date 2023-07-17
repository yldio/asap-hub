import { gp2 } from '@asap-hub/model';
import { LabeledMultiSelect, pixels } from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import { ContactSupport } from '../molecules';
import EditUserModal from './EditUserModal';

const { perRem } = pixels;

type KeywordsModalProps = Pick<gp2.UserResponse, 'keywords'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
  };

const KeywordsModal: React.FC<KeywordsModalProps> = ({
  onSave,
  backHref,
  keywords,
}) => {
  const [newKeywords, setNewKeywords] = useState<gp2.Keyword[]>(keywords || []);

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
        <div css={{ paddingBottom: `${162 / perRem}em` }}>
          <LabeledMultiSelect
            title="Keywords"
            subtitle="(required)"
            description={
              <>
                Select up to ten keywords that best describe you.{' '}
                <span css={{ fontStyle: 'italic' }}>
                  <ContactSupport preContactText="Want to add more keywords to the list?" />{' '}
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
                newValues
                  .slice(0, 10)
                  .reduce(
                    (acc, curr) => [...acc, curr.value],
                    [] as gp2.Keyword[],
                  ),
              );
            }}
            placeholder="Start typing..."
            maxMenuHeight={160}
            getValidationMessage={() => 'Please add your keywords'}
          />
        </div>
      )}
    </EditUserModal>
  );
};

export default KeywordsModal;

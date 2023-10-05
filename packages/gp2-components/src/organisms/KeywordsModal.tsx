import { gp2 } from '@asap-hub/model';
import { LabeledMultiSelect, pixels } from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import { ContactSupport } from '../molecules';
import EditUserModal from './EditUserModal';

const { perRem } = pixels;

type KeywordsModalProps = Pick<gp2.UserResponse, 'tags'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
    suggestions: gp2.TagDataObject[];
  };

const KeywordsModal: React.FC<KeywordsModalProps> = ({
  onSave,
  backHref,
  tags,
  suggestions,
}) => {
  const [newKeywords, setNewKeywords] = useState<gp2.TagDataObject[]>(
    tags || [],
  );

  const checkDirty = () =>
    (!tags && newKeywords.length) ||
    (!!tags && !tags.every((val, index) => val === newKeywords[index]));

  return (
    <EditUserModal
      title="Keywords"
      description="Help others to understand your areas of expertise or what you’re passionate about."
      onSave={() =>
        onSave({
          tags: newKeywords.map(({ id }) => ({ id })),
        })
      }
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
            values={newKeywords.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
            required
            enabled={!isSaving}
            suggestions={suggestions.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
            onChange={(newValues) => {
              setNewKeywords(
                newValues
                  .slice(0, 10)
                  .reduce(
                    (acc, curr) => [
                      ...acc,
                      { id: curr.value, name: curr.label },
                    ],
                    [] as gp2.TagDataObject[],
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

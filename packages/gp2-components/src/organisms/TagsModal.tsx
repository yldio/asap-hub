import { gp2 } from '@asap-hub/model';
import { LabeledMultiSelect, pixels } from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import { ContactSupport } from '../molecules';
import EditUserModal from './EditUserModal';

const { perRem } = pixels;

type TagsModalProps = Pick<gp2.UserResponse, 'tags'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
    suggestions: gp2.TagDataObject[];
  };

const TagsModal: React.FC<TagsModalProps> = ({
  onSave,
  backHref,
  tags,
  suggestions,
}) => {
  const [newTags, setNewTags] = useState<gp2.TagDataObject[]>(tags || []);

  const checkDirty = () =>
    (!tags && newTags.length) ||
    (!!tags && !tags.every((val, index) => val === newTags[index]));

  return (
    <EditUserModal
      title="Tags"
      description="Help others to understand your areas of expertise or what you’re passionate about."
      onSave={() =>
        onSave({
          tags: newTags.map(({ id }) => ({ id })),
        })
      }
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <div css={{ paddingBottom: `${162 / perRem}em` }}>
          <LabeledMultiSelect
            title="Tags"
            subtitle="(required)"
            description={
              <>
                Select up to ten keywords that best describe you.{' '}
                <span css={{ fontStyle: 'italic' }}>
                  <ContactSupport preContactText="Want to add more keywords to the list?" />{' '}
                </span>
              </>
            }
            values={newTags.map(({ id, name }) => ({
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
              setNewTags(
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
            getValidationMessage={() => 'Please add your tags'}
          />
        </div>
      )}
    </EditUserModal>
  );
};

export default TagsModal;

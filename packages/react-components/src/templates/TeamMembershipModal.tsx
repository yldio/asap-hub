import { useState } from 'react';
import { UserTeam, UserPatchRequest } from '@asap-hub/model';
import { css } from '@emotion/react';

import {
  LabeledTextField,
  LabeledTextArea,
  LabeledDropdown,
} from '../molecules';
import { noop } from '../utils';
import { perRem, tabletScreen } from '../pixels';
import { Paragraph } from '../atoms';
import { EditModal } from '../organisms';

const fieldsContainer = css({
  display: 'grid',
  rowGap: `${12 / perRem}em`,
});

const textFieldsContainerStyles = css({
  display: 'grid',
  columnGap: `${24 / perRem}em`,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr',
    rowGap: `${12 / perRem}em`,
  },
});

type TeamMembershipModalProps = Pick<
  UserTeam,
  'approach' | 'responsibilities' | 'id' | 'proposal' | 'role' | 'displayName'
> & {
  onSave?: (data: UserPatchRequest) => Promise<void>;
  backHref: string;
};

const TeamMembershipModal: React.FC<TeamMembershipModalProps> = ({
  id,
  role,
  displayName = '',
  approach = '',
  responsibilities = '',
  onSave = noop,
  backHref,
}) => {
  const [newApproach, setNewApproach] = useState(approach);
  const [newResponsibilities, setNewResponsibilities] =
    useState(responsibilities);

  return (
    <EditModal
      title={'Your Role in ASAP Network'}
      dirty={
        newApproach !== approach || newResponsibilities !== responsibilities
      }
      backHref={backHref}
      onSave={() =>
        onSave({
          teams: [
            {
              id,
              approach: newApproach.trim(),
              responsibilities: newResponsibilities.trim(),
            },
          ],
        })
      }
    >
      {({ isSaving }) => (
        <>
          <Paragraph accent="lead">
            Tell the network what role you play in your team and your main
            research goals by completing this part of your profile.
          </Paragraph>
          <div css={fieldsContainer}>
            <div css={textFieldsContainerStyles}>
              <LabeledTextField
                title="Team"
                value={displayName}
                enabled={false}
              />
              <LabeledDropdown
                title="Role"
                enabled={false}
                value={role}
                options={[{ label: role, value: role }]}
              />
            </div>
            <LabeledTextArea
              required
              title="Main research interests"
              placeholder="Example: Randy is interested in membrane assembly, vesicular transport, and membrane fusion among organelles of the secretary pathway."
              customValidationMessage={
                !newApproach ? 'Please add your research interests.' : ''
              }
              maxLength={200}
              enabled={!isSaving}
              value={newApproach}
              onChange={setNewApproach}
            />
            <LabeledTextArea
              required
              title="Your responsibilities"
              placeholder="Example: Randy will be responsible for applying basic principles he developed from studies of a simple eukaryote, yeast, to investigate the mechanisms of intracellular vesicular transport and biogenesis of extracellular vesicles (exosomes) in cultured human cells. His team's current work is devoted to understanding how proteins and RNA are sorted into extracellular vesicles and how these molecules may be delivered to target cells in relation to normal and pathological functions."
              customValidationMessage={
                !newResponsibilities ? 'Please add your responsibilities.' : ''
              }
              maxLength={500}
              enabled={!isSaving}
              value={newResponsibilities}
              onChange={setNewResponsibilities}
              tip="Tip: Refer to yourself in the third person."
            />
          </div>
        </>
      )}
    </EditModal>
  );
};

export default TeamMembershipModal;

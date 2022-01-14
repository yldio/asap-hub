import { useState, Fragment } from 'react';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { noop } from '../utils';
import { Paragraph } from '../atoms';
import {
  LabeledTextField,
  LabeledTextArea,
  LabeledDropdown,
} from '../molecules';
import { EditModal } from '../organisms';
import { perRem, tabletScreen } from '../pixels';

type RoleModalProps = Pick<
  UserResponse,
  | 'teams'
  | 'labs'
  | 'researchInterests'
  | 'responsibilities'
  | 'role'
  | 'reachOut'
  | 'firstName'
> & {
  onSave?: (data: UserPatchRequest) => Promise<void>;
  backHref: string;
};

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

const RoleModal: React.FC<RoleModalProps> = ({
  teams,
  labs,
  researchInterests = '',
  responsibilities = '',
  reachOut = '',
  firstName,
  role,
  onSave = noop,
  backHref,
}) => {
  const [newResearchInterests, setNewResearchInterests] =
    useState(researchInterests);
  const [newResponsibilities, setNewResponsibilities] =
    useState(responsibilities);
  const [newReachOut, setNewReachOut] = useState(reachOut);
  return (
    <EditModal
      title={'Your Role on ASAP'}
      dirty={
        newResearchInterests !== researchInterests ||
        newResponsibilities !== responsibilities
      }
      backHref={backHref}
      onSave={() =>
        onSave({
          researchInterests: newResearchInterests.trim(),
          responsibilities: newResponsibilities.trim(),
          reachOut: newReachOut.trim(),
        })
      }
    >
      {({ isSaving }) => (
        <>
          <Paragraph accent="lead">
            Tell the network what role you play in your team and your main
            research goals by completing this part of your profile. (Note: if
            you need to change any locked fields, please contact ASAP)
          </Paragraph>
          <div css={fieldsContainer}>
            <div css={textFieldsContainerStyles}>
              {teams.map(({ displayName, role: teamRole, id }) => (
                <Fragment key={id}>
                  <LabeledTextField
                    key={`team-${id}`}
                    title="Team"
                    value={displayName ?? ''}
                    enabled={false}
                  />
                  <LabeledDropdown
                    key={`team${id}-role`}
                    title="Role"
                    enabled={false}
                    value={teamRole}
                    options={[{ label: teamRole, value: teamRole }]}
                  />
                </Fragment>
              ))}
              {labs.map(({ name, id }) => (
                <LabeledTextField
                  key={`lab-${id}`}
                  title="Lab"
                  value={name}
                  enabled={false}
                />
              ))}
            </div>
          </div>
          {role !== 'Staff' && (
            <LabeledTextArea
              required
              title="Main research interests"
              subtitle="(Required)"
              placeholder="Example: Randy is interested in membrane assembly, vesicular transport, and membrane fusion among organelles of the secretary pathway."
              getValidationMessage={() => 'Please add your research interests.'}
              maxLength={200}
              enabled={!isSaving}
              value={newResearchInterests}
              onChange={setNewResearchInterests}
            />
          )}
          <LabeledTextArea
            required
            title="Your responsibilities"
            subtitle="(Required)"
            placeholder="Example: Randy will be responsible for applying basic principles he developed from studies of a simple eukaryote, yeast, to investigate the mechanisms of intracellular vesicular transport and biogenesis of extracellular vesicles (exosomes) in cultured human cells. His team's current work is devoted to understanding how proteins and RNA are sorted into extracellular vesicles and how these molecules may be delivered to target cells in relation to normal and pathological functions."
            getValidationMessage={() => 'Please add your responsibilities.'}
            maxLength={500}
            enabled={!isSaving}
            value={newResponsibilities}
            onChange={setNewResponsibilities}
            tip="Tip: Refer to yourself in the third person."
          />
          {role === 'Staff' && (
            <LabeledTextArea
              title={`Reach out to ${firstName} if…`}
              subtitle="(Optional)"
              placeholder="E.g: You have questions about preclinical tools/data sharing, subgroup meetings or collaboration opportunities."
              tip="Tip: refer to yourself in the third person."
              maxLength={250}
              enabled={!isSaving}
              value={newReachOut}
              onChange={setNewReachOut}
            />
          )}
        </>
      )}
    </EditModal>
  );
};

export default RoleModal;

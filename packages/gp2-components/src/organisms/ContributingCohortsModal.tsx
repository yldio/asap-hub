import { gp2 } from '@asap-hub/model';
import {
  Button,
  LabeledDropdown,
  pixels,
  Subtitle,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { addIcon, binIcon } from '../icons';
import { mobileQuery } from '../layout';
import colors from '../templates/colors';
import EditUserModal from './EditUserModal';

const { rem } = pixels;
const containerStyles = css({
  [mobileQuery]: {
    display: 'unset',
  },
  display: 'flex',
  paddingBottom: rem(8),
  flexDirection: 'column',
});
const rowStyles = css({
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  marginBottom: rem(12),
  padding: `${rem(16)} 0`,
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
});
const headerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});
const buttonStyles = css({ margin: 0 });
const addButtonStyles = css({
  width: 'fit-content',
  [mobileQuery]: {
    width: '100%',
  },
});
const required = '(required)';
const getValues = <T extends string>(selected: T[]) =>
  selected.map((item) => ({ label: item, value: item }));

type ContributingCohortsModalProps = Pick<
  gp2.UserResponse,
  'contributingCohorts'
> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
  } & {
    cohortOptions: gp2.ContributingCohortResponse[];
  };

const ContributingCohortsModal: React.FC<ContributingCohortsModalProps> = ({
  onSave,
  backHref,
  contributingCohorts,
  cohortOptions,
}) => {
  const emptyCohort = {
    role: undefined,
    contributingCohortId: undefined,
  };
  const [newCohorts, setCohorts] = useState<
    Partial<gp2.UserContributingCohort>[]
  >(contributingCohorts.length ? contributingCohorts : [emptyCohort]);

  const checkDirty = () =>
    newCohorts.some(
      (newChort, index) =>
        newChort.contributingCohortId !==
          contributingCohorts[index]?.contributingCohortId ||
        newChort.role !== contributingCohorts[index]?.role,
    );
  const onChangeValue =
    (index: number, property: keyof gp2.UserContributingCohort) =>
    (value: string) =>
      setCohorts(
        Object.assign([], newCohorts, {
          [index]: {
            ...newCohorts[index],
            [property]: value,
          },
        }),
      );
  const onRemove = (index: number) => () =>
    setCohorts(newCohorts.filter((_, idx) => idx !== index));
  const onAdd = () => setCohorts([...newCohorts, emptyCohort]);
  return (
    <EditUserModal
      title="Contributing Cohort Studies"
      description="List out the cohort studies that you have been involved in (up to ten)."
      onSave={() => {
        const isCohort = (
          cohort: Partial<gp2.UserContributingCohort>,
        ): cohort is gp2.UserContributingCohort =>
          !!cohort.contributingCohortId && !!cohort.role;

        const cleanCohorts = newCohorts.reduce<
          NonNullable<gp2.UserPatchRequest['contributingCohorts']>
        >(
          (acc, { name: _name, ...cohort }) =>
            isCohort(cohort) ? [...acc, cohort] : acc,
          [],
        );
        return onSave({
          contributingCohorts: cleanCohorts,
        });
      }}
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <>
          <div css={[containerStyles]}>
            <div css={{ paddingBottom: '0' }}>
              {newCohorts.map(({ contributingCohortId, role }, index) => (
                <div css={[rowStyles]} key={`cohort-${index}`}>
                  <div css={headerStyles}>
                    <Subtitle styleAsHeading={4}>
                      #{index + 1} Cohort Study
                    </Subtitle>
                    <div css={buttonStyles}>
                      <Button onClick={onRemove(index)} small>
                        <span css={css({ display: 'inline-flex' })}>
                          {binIcon}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <LabeledDropdown
                    title="Name"
                    subtitle={required}
                    getValidationMessage={() => 'Please add the cohort name'}
                    enabled={!isSaving}
                    value={contributingCohortId || ''}
                    onChange={onChangeValue(index, 'contributingCohortId')}
                    required
                    options={cohortOptions.map(({ id, name }) => ({
                      label: name,
                      value: id,
                    }))}
                    placeholder={'Type a cohort study name...'}
                  />
                  <LabeledDropdown
                    title="Role"
                    subtitle={required}
                    options={getValues([...gp2.userContributingCohortRole])}
                    enabled={!isSaving}
                    getValidationMessage={() => 'Please add the role'}
                    value={role || ''}
                    onChange={onChangeValue(index, 'role')}
                    required
                    placeholder={'Select a role...'}
                  />
                </div>
              ))}
            </div>
            {newCohorts.length < 10 ? (
              <div css={addButtonStyles}>
                <Button onClick={onAdd} enabled={!isSaving} small>
                  <span
                    css={{
                      display: 'inline-flex',
                      gap: rem(8),
                      margin: `0 ${rem(3)}`,
                    }}
                  >
                    Add {newCohorts.length > 0 ? 'Another' : 'Cohort'} Study{' '}
                    {addIcon}
                  </span>
                </Button>
              </div>
            ) : undefined}
          </div>
        </>
      )}
    </EditUserModal>
  );
};

export default ContributingCohortsModal;

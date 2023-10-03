import { gp2 as gp2Model } from '@asap-hub/model';
import { LabeledMultiSelect, Modal } from '@asap-hub/react-components';

import { useState } from 'react';
import { formContainer, modalStyles, padding24Styles } from '../layout';
import FilterModalFooter from '../molecules/FilterModalFooter';
import FilterModalHeader from '../molecules/FilterModalHeader';

const { userRegions } = gp2Model;

type FiltersModalProps = {
  onBackClick: () => void;
  filters: gp2Model.FetchUsersSearchFilter;
  onApplyClick: (filters: gp2Model.FetchUsersSearchFilter) => void;
  projects: Pick<gp2Model.ProjectResponse, 'id' | 'title'>[];
  workingGroups: Pick<gp2Model.WorkingGroupResponse, 'id' | 'title'>[];
  keywords: gp2Model.KeywordResponse[];
};

const getValues = <T extends string>(selected: T[]) =>
  selected.map((item) => ({ label: item, value: item }));

const onChange =
  <T extends string>(setValue: (items: T[]) => void) =>
  (newValues: Readonly<{ value: T; label: T }[]>) => {
    setValue(newValues.map(({ value }) => value));
  };

const getNoOptionsMessage =
  (message: string) =>
  ({ inputValue }: { inputValue: string }) =>
    `${message} "${inputValue}"`;

const FiltersModal: React.FC<FiltersModalProps> = ({
  onBackClick,
  onApplyClick,
  filters,
  projects,
  workingGroups,
  keywords,
}) => {
  const entityToSelect = <T extends { title: string; id: string }>({
    title,
    id,
  }: T) => ({ label: title, value: id });
  const keywordsToSelect = ({
    name,
    id,
  }: FiltersModalProps['keywords'][number]) => ({
    label: name,
    value: id,
  });
  const sortByLabel = <T extends { label: string }>(a: T, b: T) =>
    a.label.localeCompare(b.label);
  const [selectedRegions, setSelectedRegions] = useState(filters.regions || []);
  const [selectedExpertise, setSelectedExpertise] = useState(
    keywords
      .filter(({ id }) => filters.keywords?.includes(id))
      .map(keywordsToSelect),
  );
  const [selectedProjects, setSelectedProjects] = useState(
    projects
      .filter(({ id }) => filters.projects?.includes(id))
      .map(entityToSelect),
  );
  const [selectedWorkingGroups, setSelectedWorkingGroups] = useState(
    workingGroups
      .filter(({ id }) => filters.workingGroups?.includes(id))
      .map(entityToSelect),
  );
  const resetFilters = () => {
    setSelectedRegions([]);
    setSelectedExpertise([]);
    setSelectedProjects([]);
    setSelectedWorkingGroups([]);
  };

  const numberOfFilter =
    selectedRegions.length +
    selectedExpertise.length +
    selectedProjects.length +
    selectedWorkingGroups.length;
  return (
    <Modal padding={false}>
      <div css={modalStyles}>
        <FilterModalHeader numberOfFilter={numberOfFilter} />
        <div css={[formContainer, padding24Styles]}>
          <LabeledMultiSelect
            title={'Expertise / Interests'}
            placeholder="Start typing…"
            values={selectedExpertise}
            suggestions={keywords.map(keywordsToSelect).sort(sortByLabel)}
            onChange={(newValues) => setSelectedExpertise([...newValues])}
            noOptionsMessage={getNoOptionsMessage(
              'Sorry, no current expertise / interests match',
            )}
          />
          <LabeledMultiSelect
            title={'Regions'}
            placeholder="Start typing…"
            values={getValues(selectedRegions)}
            suggestions={getValues([...userRegions])}
            onChange={onChange(setSelectedRegions)}
            noOptionsMessage={getNoOptionsMessage(
              'Sorry, no current regions match',
            )}
          />
          <LabeledMultiSelect
            title="Working Groups"
            placeholder="Start typing…"
            suggestions={workingGroups.map(entityToSelect).sort(sortByLabel)}
            values={selectedWorkingGroups}
            noOptionsMessage={getNoOptionsMessage(
              'Sorry, no current working groups match',
            )}
            onChange={(newValues) => {
              setSelectedWorkingGroups([...newValues]);
            }}
          />
          <LabeledMultiSelect
            title="Projects"
            placeholder="Start typing…"
            suggestions={projects.map(entityToSelect).sort(sortByLabel)}
            values={selectedProjects}
            noOptionsMessage={getNoOptionsMessage(
              'Sorry, no current projects match',
            )}
            onChange={(newValues) => {
              setSelectedProjects([...newValues]);
            }}
          />
        </div>
        <FilterModalFooter
          onApply={() => {
            onApplyClick({
              regions: selectedRegions,
              keywords: selectedExpertise.map(({ value }) => value),
              projects: selectedProjects.map(({ value }) => value),
              workingGroups: selectedWorkingGroups.map(({ value }) => value),
            });
          }}
          onClose={onBackClick}
          onReset={resetFilters}
        />
      </div>
    </Modal>
  );
};

export default FiltersModal;

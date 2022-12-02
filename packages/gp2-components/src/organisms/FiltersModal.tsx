import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Divider,
  LabeledMultiSelect,
  Modal,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';

import { useState } from 'react';
import FilterModalFooter from '../molecules/FilterModalFooter';
import FilterModalHeader from '../molecules/FilterModalHeader';

const { rem } = pixels;

const { userRegions, keywords } = gp2Model;

const containerStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

type FiltersModalProps = {
  onBackClick: () => void;
  filters: gp2Model.FetchUsersFilter;
  onApplyClick: (filters: gp2Model.FetchUsersFilter) => void;
  projects: gp2Model.ProjectResponse[];
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
}) => {
  const [selectedRegions, setSelectedRegions] = useState(filters.region || []);
  const [selectedExpertise, setSelectedExpertise] = useState(
    filters.keyword || [],
  );
  const [selectedProjects, setSelectedProjects] = useState(
    projects
      .filter(({ id }) => filters.project?.includes(id))
      .map(({ id, title }) => ({ label: title, value: id })) || [],
  );
  const resetFilters = () => {
    setSelectedRegions([]);
    setSelectedExpertise([]);
    setSelectedProjects([]);
  };

  const numberOfFilter =
    selectedRegions.length + selectedExpertise.length + selectedProjects.length;
  return (
    <Modal padding={false}>
      <div css={containerStyles}>
        <FilterModalHeader numberOfFilter={numberOfFilter} />
        <LabeledMultiSelect
          title={'Expertise / Interests'}
          placeholder="Start typing…"
          values={getValues(selectedExpertise)}
          suggestions={getValues([...keywords])}
          onChange={onChange(setSelectedExpertise)}
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
          suggestions={[]}
        />
        <LabeledMultiSelect
          title="Projects"
          placeholder="Start typing…"
          suggestions={projects.map(({ id, title }) => ({
            label: title,
            value: id,
          }))}
          values={selectedProjects}
          noOptionsMessage={getNoOptionsMessage(
            'Sorry, no current projects match',
          )}
          onChange={(newValues) => {
            setSelectedProjects(
              newValues.map(({ value, label }) => ({ value, label })),
            );
          }}
        />
        <Divider />
        <FilterModalFooter
          onApply={() => {
            onApplyClick({
              region: selectedRegions,
              keyword: selectedExpertise,
              project: selectedProjects.map(({ value }) => value),
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

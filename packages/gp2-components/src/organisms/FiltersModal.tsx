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
};

type FilterSelectorProps<T extends string> = {
  title: string;
  selected: T[];
  readonly suggestions: T[];
  setValue: (item: T[]) => void;
  noOptionsMessage: string;
};

const FilterSelector = <T extends string>({
  title,
  selected,
  suggestions,
  setValue,
  noOptionsMessage,
}: FilterSelectorProps<T>): ReturnType<React.FC> => (
  <LabeledMultiSelect
    title={title}
    placeholder="Start typing…"
    values={selected.map((item) => ({
      label: item,
      value: item,
    }))}
    suggestions={suggestions.map((suggestion) => ({
      label: suggestion,
      value: suggestion,
    }))}
    onChange={(newValues) => {
      setValue(newValues.map(({ value }) => value));
    }}
    noOptionsMessage={({ inputValue }) => `${noOptionsMessage} "${inputValue}"`}
  />
);

const FiltersModal: React.FC<FiltersModalProps> = ({
  onBackClick,
  onApplyClick,
  filters,
}) => {
  const [selectedRegions, setSelectedRegions] = useState(filters.region || []);
  const [selectedExpertise, setSelectedExpertise] = useState(
    filters.keyword || [],
  );
  const resetFilters = () => {
    setSelectedRegions([]);
    setSelectedExpertise([]);
  };

  const numberOfFilter = selectedRegions.length + selectedExpertise.length;
  return (
    <Modal padding={false}>
      <div css={containerStyles}>
        <FilterModalHeader numberOfFilter={numberOfFilter} />
        <FilterSelector<gp2Model.Keyword>
          title="Expertise / Interests"
          selected={selectedExpertise}
          suggestions={[...keywords]}
          setValue={setSelectedExpertise}
          noOptionsMessage={'Sorry, no current expertise / interests match'}
        />
        <FilterSelector<gp2Model.UserRegion>
          title="Regions"
          selected={selectedRegions}
          suggestions={[...userRegions]}
          setValue={setSelectedRegions}
          noOptionsMessage={'Sorry, no current regions match'}
        />
        <LabeledMultiSelect
          title="Working Groups"
          placeholder="Start typing…"
          suggestions={[]}
        />
        <LabeledMultiSelect
          title="Projects"
          placeholder="Start typing…"
          suggestions={[]}
        />
        <Divider />
        <FilterModalFooter
          onApply={() => {
            onApplyClick({
              region: selectedRegions,
              keyword: selectedExpertise,
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

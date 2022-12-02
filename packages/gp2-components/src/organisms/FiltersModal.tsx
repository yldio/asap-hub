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

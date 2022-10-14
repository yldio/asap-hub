import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Modal,
  Headline3,
  Subtitle,
  LabeledMultiSelect,
  Button,
  Divider,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';

import { useState } from 'react';

const { rem } = pixels;

const { userRegions } = gp2Model;

const containerStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

type FiltersModalProps = {
  onBackClick: () => void;
  filters: gp2Model.FetchUsersFilter;
  onApplyClick: (filters: gp2Model.FetchUsersFilter) => void;
};

const FiltersModal: React.FC<FiltersModalProps> = ({
  onBackClick,
  onApplyClick,
  filters,
}) => {
  const [seletedRegions, setSelectedRegions] = useState(filters.region || []);
  const resetFilters = () => {
    setSelectedRegions([]);
  };
  return (
    <Modal padding={false}>
      <div css={containerStyles}>
        <Headline3>Filters</Headline3>
        <Subtitle>
          Apply filters to narrow down your search results. You currently have
          three filters selected.
        </Subtitle>
        <LabeledMultiSelect
          title="Expertise / Interests"
          placeholder="Start typing…"
          suggestions={[]}
        />
        <LabeledMultiSelect
          title="Regions"
          placeholder="Start typing…"
          values={seletedRegions.map((region) => ({
            label: region,
            value: region,
          }))}
          onChange={(newValues) => {
            setSelectedRegions(newValues.map(({ value }) => value));
          }}
          suggestions={userRegions.map((suggestion) => ({
            label: suggestion,
            value: suggestion,
          }))}
          noOptionsMessage={({ inputValue }) =>
            `Sorry, No current regions match "${inputValue}"`
          }
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
        <Button onClick={() => onBackClick()}>Close</Button>
        <Button noMargin onClick={() => resetFilters()}>
          Reset
        </Button>
        <Button
          primary
          noMargin
          onClick={() => onApplyClick({ region: seletedRegions })}
        >
          Apply
        </Button>
      </div>
    </Modal>
  );
};

export default FiltersModal;

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

const { rem, tabletScreen } = pixels;

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
        <Subtitle accent="lead" styleAsHeading={6}>
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
        <div
          css={css({
            display: 'inline-flex',
            gap: rem(24),
            width: '100%',
            [`@media (max-width: ${tabletScreen.max - 1}px)`]: {
              display: 'flex',
              flexDirection: 'column-reverse',
            },
          })}
        >
          <Button
            overrideStyles={css({
              margin: 0,
              maxWidth: 'fit-content',
              [`@media (max-width: ${tabletScreen.max - 1}px)`]: {
                maxWidth: '100%',
              },
            })}
            onClick={() => onBackClick()}
          >
            Close
          </Button>
          <div
            css={css({
              display: 'inline-flex',
              gap: rem(24),
              marginLeft: 'auto',
              [`@media (max-width: ${tabletScreen.max - 1}px)`]: {
                marginLeft: 'unset',
                display: 'flex',
                flexDirection: 'column-reverse',
              },
            })}
          >
            <Button
              overrideStyles={css({
                margin: 0,
              })}
              onClick={() => resetFilters()}
            >
              Reset
            </Button>
            <Button
              overrideStyles={css({
                margin: 0,
              })}
              primary
              onClick={() => onApplyClick({ region: seletedRegions })}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FiltersModal;

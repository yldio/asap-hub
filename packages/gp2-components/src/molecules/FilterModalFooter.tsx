import { Button, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { mobileQuery } from '../layout';

const { rem, tabletScreen } = pixels;

type FilterModalFooterProps = {
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;
};

const buttonContainerStyles = css({
  display: 'inline-flex',
  gap: rem(24),
  width: '100%',
  [mobileQuery]: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
});

const floatButtonContainerStyles = css({
  marginLeft: 'auto',
  width: 'unset',
  [mobileQuery]: {
    marginLeft: 'unset',
  },
});

const overrideButtonStyles = css({
  margin: 0,
  maxWidth: 'fit-content',
  [mobileQuery]: {
    maxWidth: '100%',
  },
});

const FilterModalFooter: React.FC<FilterModalFooterProps> = ({
  onReset,
  onApply,
  onClose,
}) => (
  <div css={buttonContainerStyles}>
    <Button overrideStyles={overrideButtonStyles} onClick={onClose}>
      Close
    </Button>
    <div css={[buttonContainerStyles, floatButtonContainerStyles]}>
      <Button overrideStyles={overrideButtonStyles} onClick={onReset}>
        Reset
      </Button>
      <Button overrideStyles={overrideButtonStyles} primary onClick={onApply}>
        Apply
      </Button>
    </div>
  </div>
);

export default FilterModalFooter;

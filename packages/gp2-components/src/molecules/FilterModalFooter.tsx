import { Button, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { footerStyles, mobileQuery, padding24Styles } from '../layout';

const { rem } = pixels;

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

const FilterModalFooter: React.FC<FilterModalFooterProps> = ({
  onReset,
  onApply,
  onClose,
}) => (
  <footer css={[footerStyles, padding24Styles]}>
    <div>
      <Button noMargin onClick={onClose}>
        Close
      </Button>
    </div>
    <div css={[buttonContainerStyles, floatButtonContainerStyles]}>
      <Button noMargin onClick={onReset}>
        Reset
      </Button>
      <Button noMargin primary onClick={onApply}>
        Apply
      </Button>
    </div>
  </footer>
);

export default FilterModalFooter;

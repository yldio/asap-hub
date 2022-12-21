import { css } from '@emotion/react';

import { pixels } from '@asap-hub/react-components';

const { rem } = pixels;

const styles = css({
  display: 'grid',
  gridRowGap: rem(72),
  marginBottom: rem(24),
});

const DashboardPageBody: React.FC = ({}) => <div css={styles}></div>;

export default DashboardPageBody;

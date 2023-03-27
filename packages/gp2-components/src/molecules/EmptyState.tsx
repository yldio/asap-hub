import { Display, Paragraph, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ReactChild } from 'react';

const { rem } = pixels;

interface EmptyStateProps {
  icon: ReactChild;
  title: string;
  description: string;
}

const styles = css({
  padding: `${rem(48)} 0`,
  display: 'grid',
  textAlign: 'center',
});

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
}) => (
  <div css={styles}>
    <span>{icon}</span>
    <div>
      <Display styleAsHeading={3}>{title}</Display>
      <Paragraph accent="lead">{description}</Paragraph>
    </div>
  </div>
);

export default EmptyState;

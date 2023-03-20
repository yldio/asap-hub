import { Display, Paragraph, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ReactChild } from 'react';

const { rem } = pixels;

interface EmptyStateProps {
  icon: ReactChild;
  title: string;
  description: string;
  smallPadding?: boolean;
}

const styles = css({
  padding: `${rem(80)} 0`,
  display: 'grid',
  textAlign: 'center',
});

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  smallPadding = false,
}) => (
  <div css={[styles, smallPadding ? { padding: `${rem(32)} 0` } : {}]}>
    <span>{icon}</span>
    <div>
      <Display styleAsHeading={3}>{title}</Display>
      <Paragraph accent="lead">{description}</Paragraph>
    </div>
  </div>
);

export default EmptyState;

import { css } from '@emotion/react';
import { Headline3, Paragraph } from '../atoms';
import { rem } from '../pixels';
import { themes } from '../theme';
export type FormSectionProps = {
  title?: string;
  description?: string | React.ReactNode;
  headerDecorator?: React.ReactNode;
};

const titleStyles = css({
  display: 'flex',
  flexFlow: 'row',
  gap: rem(10),
  alignItems: 'center',
  justifyContent: 'space-between',
});

const sectionStyles = css({
  padding: 0,
});

const descriptionStyles = css({
  paddingTop: rem(24),
  paddingBottom: 0,
});

const withHeaderStyle = css({
  height: 0,
  marginTop: rem(32),
});

const sectionChildrenWrapStyle = css({
  display: 'flex',
  flexFlow: 'column',
  gap: rem(48),
});

/**
 * A component for composing form layouts with consistent spacing and structure.
 *
 * Provides default spacing between child components (48px gap) and optional title,
 * description, and header decorator elements with proper spacing relationships:
 *
 * All props are optional, allowing flexible composition:
 * - Use with title and description for full form sections
 * - Use with only description for contextual information
 * - Use with headerDecorator for action buttons (e.g., close, save)
 * - Use without any props for simple field grouping with consistent spacing
 *
 * The component has zero padding, so it can be wrapped in other containers
 * to control distance from borders as needed.
 */
const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  description,
  headerDecorator,
}) => (
  <section aria-label={title} css={[themes.light, sectionStyles]}>
    {(!!title || !!headerDecorator) && (
      <div role="presentation" css={[titleStyles]}>
        <div style={{ flex: 1 }}>
          <Headline3 noMargin>{title}</Headline3>
        </div>
        <div>{headerDecorator}</div>
      </div>
    )}
    {!!description && (
      <div css={[descriptionStyles]}>
        <Paragraph noMargin accent="lead">
          {description}
        </Paragraph>
      </div>
    )}
    {(!!title || !!headerDecorator || !!description) && (
      <div css={withHeaderStyle}>&nbsp;</div>
    )}
    <div css={sectionChildrenWrapStyle}>{children}</div>
  </section>
);

export default FormSection;

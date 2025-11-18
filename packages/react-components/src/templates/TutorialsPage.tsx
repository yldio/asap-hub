import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { rem } from '../pixels';

import TutorialsPageHeader from './TutorialsPageHeader';

type TutorialsPageProps = ComponentProps<typeof TutorialsPageHeader>;

const containerStyles = css({ paddingTop: rem(48) });

const TutorialsPage: React.FC<TutorialsPageProps> = ({
  children,
  ...props
}) => (
  <article>
    <TutorialsPageHeader {...props} />
    <main css={containerStyles}>{children}</main>
  </article>
);

export default TutorialsPage;

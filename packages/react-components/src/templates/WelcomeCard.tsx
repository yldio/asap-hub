import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph, Button, Card } from '../atoms';
import { paddingStyles } from '../card';
import { vminLinearCalcClamped, mobileScreen, tabletScreen } from '../pixels';

const containerStyles = css({
  maxWidth: '440px',
});
const styles = css(paddingStyles, {
  paddingBottom: `${vminLinearCalcClamped(
    mobileScreen,
    18,
    tabletScreen,
    24,
    'px',
  )}`,

  display: 'grid',
  textAlign: 'center',
});
const buttonContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
});

type WelcomeProps = {
  readonly buttonText: string;
  readonly content: string;
  readonly signup?: boolean;
  readonly title: string;
  readonly children?: React.ReactNode;
  readonly onClick: () => void;
};

const Welcome: React.FC<WelcomeProps> = ({
  buttonText,
  content,
  title,
  children,
  onClick,
}) => (
  <div css={containerStyles}>
    <Card padding={false}>
      <article css={styles}>
        <header>
          <Display styleAsHeading={2}>{title}</Display>
          <Paragraph primary accent="lead">
            {content}
          </Paragraph>
        </header>

        <section css={buttonContainerStyles}>
          <Button primary onClick={onClick}>
            {buttonText}
          </Button>
        </section>
        <section>{children}</section>
      </article>
    </Card>
  </div>
);

export default Welcome;

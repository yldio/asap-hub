import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph, Button, Card } from '../atoms';

const styles = css({
  maxWidth: '323px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const headerStyles = css({
  textAlign: 'center',
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
  <Card>
    <article css={styles}>
      <header css={headerStyles}>
        <Display styleAsHeading={4}>{title}</Display>
        <Paragraph primary accent="lead">
          {content}
        </Paragraph>
      </header>

      <Button primary onClick={onClick}>
        {buttonText}
      </Button>
      <footer>{children}</footer>
    </article>
  </Card>
);

export default Welcome;

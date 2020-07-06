import React from 'react';
import css from '@emotion/css';
import Layout from './Layout';
import { Headline3, Paragraph, Link } from '../atoms';

interface WelcomeProps {
  readonly firstName: string;
  readonly link: string;
}

const listStyle = css({
  margin: 0,
  paddingLeft: '16px',
  paddingTop: '12px',
  paddingBottom: '12px',
  paddingRight: '12px',
});

const Component: React.FC<WelcomeProps> = ({ firstName, link }) => (
  <Layout>
    <Headline3>Dear {firstName}</Headline3>
    <>
      <Paragraph>Congratulations on being awarded the ASAP Grant.</Paragraph>
      <Paragraph>
        We're delighted to be able to invite you to join the ASAP Hub!
      </Paragraph>
      <Paragraph>The ASAP Hub is the perfect place to:</Paragraph>
      <ul css={listStyle}>
        <li>Collaborate with your team</li>
        <li>Expand your wider network</li>
        <li>Gain access to new resources</li>
      </ul>
      <Paragraph>Join the community and set up your profile.</Paragraph>
    </>
    <Link href={link}>Create account</Link>
  </Layout>
);

export default Component;

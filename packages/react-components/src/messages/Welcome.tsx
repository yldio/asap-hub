import React, { ComponentProps } from 'react';
import Layout from './Layout';
import { Display, Paragraph, Link } from '../atoms';

type WelcomeProps = ComponentProps<typeof Layout> & {
  readonly firstName: string;
  readonly lastName: string;
  readonly link: string;
};

const Welcome: React.FC<WelcomeProps> = ({
  firstName,
  lastName,
  link,
  privacyPolicyHref,
  termsHref,
}) => (
  <Layout privacyPolicyHref={privacyPolicyHref} termsHref={termsHref}>
    <Display styleAsHeading={3}>
      Dear {firstName} {lastName}
    </Display>
    <>
      <Paragraph>
        You are part of a team who has been awarded a grant by ASAP.
      </Paragraph>
      <Paragraph>
        As part of the ASAP grant, you are required to{' '}
        <span css={{ fontWeight: 'bold' }}>activate your account</span> on the
        ASAP Hub, where we have created a profile on your behalf.
      </Paragraph>
      <Paragraph>
        The ASAP Hub is the platform where all ASAP grantees share information
        and collaborate. You can access grantee and team profiles, all project
        proposals, and read the latest news and events from ASAP.
      </Paragraph>
      <Paragraph>
        Activate your account to view your profile. This is your personal link
        and cannot be shared.
      </Paragraph>
    </>
    <Link buttonStyle primary href={link}>
      Activate account
    </Link>
    <Paragraph>
      <span css={{ fontWeight: 'bold' }}>Note:</span> Please be mindful that the
      ASAP Hub is a closed platform developed for ASAP grantees only. The closed
      nature of the Hub is meant to foster trust, candor, and connection. As a
      reminder, your commitment to confidentiality has been codified in the ASAP
      grant agreement to which your team has agreed.
    </Paragraph>
  </Layout>
);

export default Welcome;

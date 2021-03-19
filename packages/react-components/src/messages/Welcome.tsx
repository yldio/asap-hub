import React, { ComponentProps } from 'react';
import Layout from './Layout';
import { Display, Paragraph, Link } from '../atoms';
import { mailToSupport } from '../mail';

type WelcomeProps = ComponentProps<typeof Layout> & {
  readonly firstName: string;
  readonly link: string;
};

const Welcome: React.FC<WelcomeProps> = ({
  firstName,
  link,
  privacyPolicyHref,
  termsHref,
}) => (
  <Layout privacyPolicyHref={privacyPolicyHref} termsHref={termsHref}>
    <Display styleAsHeading={3}>Dear {firstName}</Display>
    <>
      <Paragraph>
        Thank you for filling out your Profile Form, you’re one step away from
        joining the ASAP Hub! Please choose a login method and activate your
        account.
      </Paragraph>
      <Link buttonStyle primary href={link}>
        Activate account
      </Link>
      <Paragraph>
        The ASAP Hub is a platform where you’ll be able to collaborate with your
        team, connect with others, join ASAP events, and access new resources
        generated throughout the network.
      </Paragraph>
      <Paragraph>
        If you're facing a technical issue with the Hub, please{' '}
        <Link href={mailToSupport()}>get in touch</Link>. Our Support team is
        happy to help!
      </Paragraph>
    </>
  </Layout>
);

export default Welcome;

import { Display, Paragraph, Link } from '../atoms';
import { mailToSupport } from '../mail';

type WelcomeProps = {
  readonly firstName: string;
  readonly link: string;
};

const Welcome: React.FC<WelcomeProps> = ({ firstName, link }) => (
  <section>
    <Display styleAsHeading={3}>Dear {firstName}</Display>
    <Paragraph>
      Thank you for filling out your Profile Form, you’re one step away from
      joining the ASAP Hub! Please choose a login method and activate your
      account.
    </Paragraph>
    <Paragraph>
      The ASAP Hub is a platform where you’ll be able to collaborate with your
      team, connect with others, join ASAP events, and access new resources
      generated throughout the network.
    </Paragraph>
    <Link buttonStyle primary href={link}>
      Activate account
    </Link>
    <Paragraph>
      If you're facing a technical issue with the Hub, please{' '}
      <Link href={mailToSupport()}>get in touch</Link>. Our Support team is
      happy to help!
    </Paragraph>
    <Paragraph>
      Note: please be mindful that the ASAP Hub is a closed platform developed
      for ASAP grantees only. The closed nature of the Hub is meant to foster
      trust, candor, and connection. As a reminder, your commitment to
      confidentiality has been codified in the ASAP grant agreement to which
      your team has agreed
    </Paragraph>
  </section>
);

export default Welcome;

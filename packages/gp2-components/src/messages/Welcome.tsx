import { Display, Link, mail, Paragraph } from '@asap-hub/react-components';

const { mailToSupport } = mail;

type WelcomeProps = {
  readonly firstName: string;
  readonly link: string;
};

const Welcome: React.FC<WelcomeProps> = ({ firstName, link }) => (
  <section>
    <Display styleAsHeading={3}>Dear {firstName}</Display>
    <Paragraph>Thank you for starting this journey with us!</Paragraph>
    <Paragraph>
      You’re one step closer to joining the GP2 Hub - A private, invite-only
      network where the GP2 community collaborates. Here, you can connect with
      your team, join events, browse through projects, and access research.{' '}
    </Paragraph>
    <Paragraph>
      Click ‘Create Account’ below to get started - we look forward to seeing
      you there!
    </Paragraph>
    <Link buttonStyle primary href={link}>
      Create account
    </Link>
    <Paragraph>
      As with every new path, you may come across some questions and{' '}
      <Link href={mailToSupport()}>our team</Link> would be delighted to answer
      them.
    </Paragraph>
    <Paragraph>
      Reminder: GP2 Hub is a closed platform to foster trust, candor and
      connection among grantees. You are expected to comply with confidentiality
      guidelines.
    </Paragraph>
  </section>
);

export default Welcome;

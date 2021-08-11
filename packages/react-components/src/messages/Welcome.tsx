import { Display, Paragraph, Link } from '../atoms';
import { mailToSupport } from '../mail';

type WelcomeContentProps = { link: string };

const InviteScriptWelcomeTemplate: React.FC<WelcomeContentProps> = ({
  link,
}) => (
  <>
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
  </>
);

const InviteWelcomeTemplate: React.FC<WelcomeContentProps> = ({ link }) => (
  <>
    <Paragraph>Thank you for starting this journey with us!</Paragraph>
    <Paragraph>
      You’re one step closer to joining the ASAP Hub - the virtual home of the
      Collaborative Research Network (CRN), where you can connect with your
      team, join events and access research.
    </Paragraph>
    <Paragraph>
      Before you can explore the Hub you’ll need to complete your profile. Click
      ‘Create Account’ below to get started - we look forward to seeing you
      there!
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
      Reminder: ASAP Hub is a closed platform to foster trust, candor and
      connection among grantees. In line with your team’s grant agreement, you
      are expected to comply with confidentiality guidelines.
    </Paragraph>
  </>
);

type WelcomeProps = {
  readonly firstName: string;
  readonly link: string;
  readonly variant?: 'InviteScriptWelcomeTemplate' | 'InviteWelcomeTemplate';
};

const Welcome: React.FC<WelcomeProps> = ({
  firstName,
  link,
  variant = 'InviteScriptWelcomeTemplate',
}) => {
  const contentVariants = {
    InviteScriptWelcomeTemplate,
    InviteWelcomeTemplate,
  };
  const ContentTag = contentVariants[variant];
  return (
    <section>
      <Display styleAsHeading={3}>Dear {firstName}</Display>
      <ContentTag link={link} />
    </section>
  );
};

export default Welcome;

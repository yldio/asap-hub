import { Link, mail } from '@asap-hub/react-components';

const { createMailTo } = mail;
const email = 'techsupport@gp2.org';

type ContactSupportProps = {
  preContactText?: string;
};

const ContactSupport: React.FC<ContactSupportProps> = ({
  preContactText = 'Need to change something?',
}) => (
  <span>
    {preContactText} Contact{' '}
    <Link
      href={createMailTo(email, {
        subject: 'GP2 Hub: Tech support',
      })}
    >
      {email}
    </Link>
  </span>
);

export default ContactSupport;

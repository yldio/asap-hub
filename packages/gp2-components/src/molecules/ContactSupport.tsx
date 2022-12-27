import { Link, mail } from "@asap-hub/react-components";

const { createMailTo } = mail;
const email = 'techsupport@gp2.org';

const ContactSupport = () => (
  <span>
    Need to change something? Contact{' '}
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

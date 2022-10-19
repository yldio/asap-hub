import { EmailSection } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Email Section',
  component: EmailSection,
};

const emails = [
  { email: 'example@mail.com', contact: 'PM Email' },
  { email: 'example2@mail.com', contact: 'Lead Email' },
];

export const Normal = () => <EmailSection contactEmails={emails} />;

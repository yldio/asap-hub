import { ToastCard, Link } from '@asap-hub/react-components';

import { select, text } from './knobs';

export default {
  title: 'Molecules / Toast Card',
};

export const Normal = () => (
  <ToastCard
    type={select('Type', ['alert', 'live', 'attachment', 'info'], 'alert')}
    toastContent={text('Toast Content', '')}
  >
    content
  </ToastCard>
);

export const AlertType = () => (
  <ToastCard type="alert" toastContent="This is an alert message">
    <p>Here is the main content of the card below the alert banner.</p>
  </ToastCard>
);

export const InfoType = () => (
  <ToastCard type="info" toastContent="This is an informational message">
    <p>Here is the main content of the card below the info banner.</p>
  </ToastCard>
);

export const LiveType = () => (
  <ToastCard type="live" toastContent="Last updated 5 minutes ago">
    <p>This content updates in real-time.</p>
  </ToastCard>
);

export const AttachmentType = () => (
  <ToastCard type="attachment" toastContent="This item has attachments">
    <p>View the content and attached files below.</p>
  </ToastCard>
);

export const WithToastAction = () => (
  <ToastCard
    type="alert"
    toastContent="Your changes need review"
    toastAction={<Link href="#">Review Changes</Link>}
  >
    <p>Make sure to review your changes before submitting.</p>
  </ToastCard>
);

export const WithLongContent = () => (
  <ToastCard
    type="info"
    toastContent="This is a longer notification message that spans multiple words and explains the situation in more detail"
  >
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur.
    </p>
  </ToastCard>
);

export const WithoutToastContent = () => (
  <ToastCard>
    <p>This is just a regular card without any toast notification banner.</p>
  </ToastCard>
);

export const MultipleActions = () => (
  <ToastCard
    type="alert"
    toastContent="Action required"
    toastAction={
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link href="#">Accept</Link>
        <Link href="#">Decline</Link>
      </div>
    }
  >
    <p>Please take action on this item by accepting or declining.</p>
  </ToastCard>
);

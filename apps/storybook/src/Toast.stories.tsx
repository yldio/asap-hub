import { noop, Toast } from '@asap-hub/react-components';

import { boolean, text } from './knobs';

export default {
  title: 'Organisms / Toast',
  component: Toast,
  decorators: [],
};

export const Normal = () => (
  <Toast onClose={boolean('closable', true) ? noop : undefined}>
    {text('Message', 'Something happened.')}
  </Toast>
);

export const Info = () => (
  <Toast onClose={boolean('closable', true) ? noop : undefined} accent="info">
    {text('Message', 'Something happened.')}
  </Toast>
);

export const Warning = () => (
  <Toast
    onClose={boolean('closable', true) ? noop : undefined}
    accent="warning"
  >
    {text('Message', 'Something happened.')}
  </Toast>
);

export const ErrorAccent = () => (
  <Toast accent="error" onClose={noop}>
    An error occurred while processing your request. Please try again.
  </Toast>
);

export const InfoAccent = () => (
  <Toast accent="info" onClose={noop}>
    Your profile has been updated successfully.
  </Toast>
);

export const WarningAccent = () => (
  <Toast accent="warning" onClose={noop}>
    Your session will expire in 5 minutes. Please save your work.
  </Toast>
);

export const SuccessAccent = () => (
  <Toast accent="success" onClose={noop}>
    Your changes have been saved successfully.
  </Toast>
);

export const SuccessLargeAccent = () => (
  <Toast accent="successLarge" onClose={noop}>
    Congratulations! Your submission has been approved and published.
  </Toast>
);

export const AllAccentsComparison = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Toast accent="error" onClose={noop}>
      Error: Failed to save changes.
    </Toast>
    <Toast accent="info" onClose={noop}>
      Info: Profile updated.
    </Toast>
    <Toast accent="warning" onClose={noop}>
      Warning: Session expiring soon.
    </Toast>
    <Toast accent="success" onClose={noop}>
      Success: Changes saved.
    </Toast>
    <Toast accent="successLarge" onClose={noop}>
      Success: Submission approved!
    </Toast>
  </div>
);

export const ErrorWithoutClose = () => (
  <Toast accent="error">
    This is a critical error that cannot be dismissed.
  </Toast>
);

export const InfoWithoutClose = () => (
  <Toast accent="info">This informational message will remain visible.</Toast>
);

export const WarningWithoutClose = () => (
  <Toast accent="warning">
    This warning requires attention and cannot be dismissed.
  </Toast>
);

export const SuccessWithoutClose = () => (
  <Toast accent="success">This success message will stay visible.</Toast>
);

export const LongMessage = () => (
  <Toast accent="info" onClose={noop}>
    This is a very long message that spans multiple lines to test how the toast
    component handles text wrapping and maintains proper spacing with the close
    button. The layout should remain clean and readable even with extended
    content that requires multiple lines to display properly.
  </Toast>
);

export const ShortMessage = () => (
  <Toast accent="success" onClose={noop}>
    Done!
  </Toast>
);

export const WithStrongText = () => (
  <Toast accent="warning" onClose={noop}>
    <strong>Important:</strong> Your password will expire in 3 days. Please
    update it soon.
  </Toast>
);

export const WithMultipleParagraphs = () => (
  <Toast accent="info" onClose={noop}>
    Your request has been received. We will process it within 24-48 hours. You
    will receive an email notification once the process is complete.
  </Toast>
);

export const ErrorLongMessage = () => (
  <Toast accent="error" onClose={noop}>
    Unable to connect to the server. This could be due to network issues, server
    maintenance, or an invalid configuration. Please check your connection and
    try again later.
  </Toast>
);

export const WarningLongMessage = () => (
  <Toast accent="warning" onClose={noop}>
    You have unsaved changes in multiple sections of the form. If you navigate
    away now, all progress will be lost. Please save your work before leaving
    this page.
  </Toast>
);

export const SuccessLargeLongMessage = () => (
  <Toast accent="successLarge" onClose={noop}>
    Congratulations! Your research proposal has been successfully submitted and
    is now under review. You will receive updates via email as it progresses
    through the approval process.
  </Toast>
);

export const ErrorRounded = () => (
  <Toast accent="error" onClose={noop} rounded>
    An error occurred while processing your request. Please try again.
  </Toast>
);

export const InfoRounded = () => (
  <Toast accent="info" onClose={noop} rounded>
    Your profile has been updated successfully.
  </Toast>
);

export const WarningRounded = () => (
  <Toast accent="warning" onClose={noop} rounded>
    Your session will expire in 5 minutes. Please save your work.
  </Toast>
);

export const SuccessRounded = () => (
  <Toast accent="success" onClose={noop} rounded>
    Your changes have been saved successfully.
  </Toast>
);

export const SuccessLargeRounded = () => (
  <Toast accent="successLarge" onClose={noop} rounded>
    Congratulations! Your submission has been approved and published.
  </Toast>
);

export const AllAccentsRoundedComparison = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Toast accent="error" onClose={noop} rounded>
      Error: Failed to save changes.
    </Toast>
    <Toast accent="info" onClose={noop} rounded>
      Info: Profile updated.
    </Toast>
    <Toast accent="warning" onClose={noop} rounded>
      Warning: Session expiring soon.
    </Toast>
    <Toast accent="success" onClose={noop} rounded>
      Success: Changes saved.
    </Toast>
    <Toast accent="successLarge" onClose={noop} rounded>
      Success: Submission approved!
    </Toast>
  </div>
);

export const RoundedWithoutClose = () => (
  <Toast accent="info" rounded>
    This informational message has rounded borders and cannot be dismissed.
  </Toast>
);

export const RoundedLongMessage = () => (
  <Toast accent="warning" onClose={noop} rounded>
    This is a very long message with rounded borders that spans multiple lines
    to test how the toast component handles text wrapping and maintains proper
    spacing with the close button. The border should remain visible and properly
    rounded throughout.
  </Toast>
);

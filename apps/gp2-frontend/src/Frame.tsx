import { serializeError } from 'serialize-error';
import { Frame as DefaultFrame } from '@asap-hub/frontend-utils';
import { mail } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

const email = 'techsupport@gp2.org';
const { createMailTo } = mail;

type FrameProps = ComponentProps<typeof DefaultFrame>;

const Frame: React.FC<FrameProps> = ({ children, ...props }) => (
  <DefaultFrame
    {...props}
    boundaryProps={{
      mailto: (error: Error) =>
        createMailTo(email, {
          subject: 'Error message on the GP2 Hub',
          body: `Dear GP2 Support,
    I've come across this error and it would be great if you could address it. Thank you!

    Details about the issue (please don't delete, this will help our engineers solve the issue)
    ${btoa(
      JSON.stringify(
        {
          error: serializeError(error),
        },
        null,
        2,
      ),
    )}`,
        }),
    }}
  >
    {children}
  </DefaultFrame>
);

export default Frame;

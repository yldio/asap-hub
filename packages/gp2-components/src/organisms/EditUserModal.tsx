import { gp2 } from '@asap-hub/model';
import {
  Button,
  Divider,
  EditModal,
  Headline3,
  Link,
  noop,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { mobileQuery } from '../layout';

const { rem } = pixels;

const buttonContainerStyles = css({
  display: 'inline-flex',
  gap: rem(24),
  width: '100%',
  justifyContent: 'space-between',
  [mobileQuery]: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  paddingTop: rem(12),
});

const formContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(18),
});

const buttonStyles = css({
  width: 'fit-content',
  [mobileQuery]: {
    width: '100%',
  },
});

type EditUserModalProps = Partial<gp2.UserResponse> & {
  title: string;
  description: string;
  dirty: boolean;
  backHref: string;
  onSave?: () => void | Promise<void>;
  children: (
    state: { isSaving: boolean },
    asyncWrapper: (cb: () => void | Promise<void>) => void,
  ) => ReactNode;
};

const EditUserModal: React.FC<EditUserModalProps> = ({
  children,
  title,
  description,
  backHref,
  dirty,
  onSave = noop,
}) => (
  <EditModal
    title={title}
    backHref={backHref}
    dirty={dirty}
    noHeader
    onSave={onSave}
  >
    {({ isSaving }, asyncWrapper) => (
      <div css={css({ width: '100%' })}>
        <header>
          <Headline3>{title}</Headline3>
          <Paragraph accent="lead">{description}</Paragraph>
        </header>
        <div css={formContainer}>{children({ isSaving }, asyncWrapper)}</div>
        <Divider />
        <div css={buttonContainerStyles}>
          <div css={buttonStyles}>
            <Link href={backHref} buttonStyle noMargin>
              Close
            </Link>
          </div>
          <div css={buttonStyles}>
            <Button
              primary
              onClick={() => asyncWrapper(onSave)}
              enabled={!isSaving}
              noMargin
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    )}
  </EditModal>
);
export default EditUserModal;

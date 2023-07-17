import { gp2 } from '@asap-hub/model';
import {
  Button,
  EditModal,
  Headline3,
  Link,
  noop,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { ReactNode } from 'react';
import {
  footerStyles,
  formContainer,
  mobileQuery,
  modalStyles,
  padding24Styles,
} from '../layout';

const { rem } = pixels;

const buttonStyles = css({
  width: 'fit-content',
  [mobileQuery]: {
    width: '100%',
  },
});

const headerStyles = css({
  padding: `${rem(24)} ${rem(24)} ${rem(48)}`,
});

const contentStyles = css({
  padding: `0 ${rem(24)}`,
});

type EditUserModalProps = Partial<gp2.UserResponse> & {
  title: string;
  description: string;
  dirty: boolean;
  backHref: string;
  onSave?: () => void | Promise<void>;
  children?: (
    state: { isSaving: boolean },
    asyncWrapper: (cb: () => void | Promise<void>) => void,
  ) => ReactNode;
  buttonText?: string;
};

const EditUserModal: React.FC<EditUserModalProps> = ({
  children,
  title,
  description,
  backHref,
  dirty,
  onSave = noop,
  buttonText = 'Save',
}) => (
  <EditModal
    title={title}
    backHref={backHref}
    dirty={dirty}
    noHeader
    onSave={onSave}
  >
    {({ isSaving }, asyncWrapper) => (
      <div css={modalStyles}>
        <header css={headerStyles}>
          <Headline3>{title}</Headline3>
          <Paragraph noMargin accent="lead">
            {description}
          </Paragraph>
        </header>
        {children ? (
          <div css={[formContainer, contentStyles]}>
            {children({ isSaving }, asyncWrapper)}
          </div>
        ) : null}
        <footer css={[footerStyles, padding24Styles]}>
          <div css={buttonStyles}>
            <Link href={backHref} buttonStyle fullWidth noMargin>
              Close
            </Link>
          </div>
          <div css={buttonStyles}>
            <Button
              primary
              fullWidth
              onClick={() => asyncWrapper(onSave)}
              enabled={!isSaving}
              noMargin
            >
              {buttonText}
            </Button>
          </div>
        </footer>
      </div>
    )}
  </EditModal>
);
export default EditUserModal;

import { gp2 } from '@asap-hub/model';
import {
  Button,
  EditModal,
  Headline3,
  Link,
  noop,
  Paragraph,
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
      <div css={modalStyles}>
        <header css={padding24Styles}>
          <Headline3>{title}</Headline3>
          <Paragraph accent="lead">{description}</Paragraph>
        </header>
        <div css={[formContainer, padding24Styles]}>
          {children({ isSaving }, asyncWrapper)}
        </div>
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
              Save
            </Button>
          </div>
        </footer>
      </div>
    )}
  </EditModal>
);
export default EditUserModal;

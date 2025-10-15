import { gp2 } from '@asap-hub/model';
import { Button, EditModal, Link, noop } from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { footerStyles, mobileQuery, padding24Styles } from '../layout';

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
  children?: (
    state: { isSaving: boolean },
    asyncWrapper: (cb: () => void | Promise<void>) => void,
  ) => ReactNode;
  buttonText?: string;
  stickyTitle?: boolean;
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
    description={description}
    backHref={backHref}
    dirty={dirty}
    onSave={onSave}
    showHeadingSave={false}
  >
    {({ isSaving }, asyncWrapper) => (
      <>
        {children ? children({ isSaving }, asyncWrapper) : null}
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
      </>
    )}
  </EditModal>
);
export default EditUserModal;

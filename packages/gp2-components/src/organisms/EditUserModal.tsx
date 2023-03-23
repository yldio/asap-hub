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
import { mobileQuery } from '../layout';
import colors from '../templates/colors';

const { rem } = pixels;

const paddingStyles = css({
  padding: rem(24),
});

const footerStyles = css({
  display: 'inline-flex',
  gap: rem(24),
  justifyContent: 'space-between',
  [mobileQuery]: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },

  borderTop: `1px solid ${colors.neutral500.rgb}`,
});

const modalStyles = css({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateRows: `max-content 1fr max-content`,
});

const formContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(18),
  overflowY: 'scroll',
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
      <div css={modalStyles}>
        <header css={paddingStyles}>
          <Headline3>{title}</Headline3>
          <Paragraph accent="lead">{description}</Paragraph>
        </header>
        <div css={[formContainer, paddingStyles]}>
          {children({ isSaving }, asyncWrapper)}
        </div>
        <footer css={[footerStyles, paddingStyles]}>
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

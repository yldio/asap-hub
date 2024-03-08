import { UserResponse } from '@asap-hub/model';

import { css } from '@emotion/react';
import { ReactNode } from 'react';

import { rem, tabletScreen } from '../pixels';
import { noop } from '../utils';
import { Button, Paragraph, Headline3, Link } from '../atoms';
import EditModal from './EditModal';
import { crossIcon } from '../icons';

const mobileQuery = `@media (max-width: ${tabletScreen.width - 1}px)`;
const buttonStyles = css({
  width: 'fit-content',
  [mobileQuery]: {
    width: '100%',
  },
});

const titleStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: rem(12),
});

const descriptionStyles = css({
  padding: `0 0 ${rem(24)}`,
});

const footerStyles = css({
  display: 'flex',
  padding: `${rem(33)} 0 ${rem(12)}`,
  gap: rem(24),
  justifyContent: 'flex-end',
  [mobileQuery]: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
});

type EditUserModalProps = Partial<UserResponse> & {
  title: string;
  description?: string;
  dirty: boolean;
  backHref: string;
  onSave?: () => void | Promise<void>;
  validate?: () => boolean;
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
  validate = () => true,
}) => (
  <EditModal
    title={title}
    backHref={backHref}
    dirty={dirty}
    noHeader
    onSave={onSave}
    validate={validate}
  >
    {({ isSaving }, asyncWrapper) => (
      <div>
        <header>
          <div css={titleStyles}>
            <Headline3>{title}</Headline3>
            <div>
              <Link small buttonStyle href={backHref}>
                {crossIcon}
              </Link>
            </div>
          </div>
          {description && (
            <Paragraph accent="lead" styles={descriptionStyles}>
              {description}
            </Paragraph>
          )}
        </header>
        {children ? <div>{children({ isSaving }, asyncWrapper)}</div> : null}
        <footer css={[footerStyles]}>
          <div css={buttonStyles}>
            <Link href={backHref} buttonStyle fullWidth noMargin>
              Cancel
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

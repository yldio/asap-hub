import { css } from '@emotion/react';
import { pixels, Toast } from '@asap-hub/react-components';
import DashboardHeader from '../organisms/DashboardHeader';
import { mainStyles } from '../layout';

const { rem } = pixels;

type dashboardProps = {
  showWelcomeBackBanner: boolean;
  firstName: string;
  dismissBanner: () => void;
};

const Dashboard: React.FC<dashboardProps> = ({
  children,
  showWelcomeBackBanner,
  firstName,
  dismissBanner,
}) => (
  <>
    {showWelcomeBackBanner && (
      <div css={css({ width: '100vw', position: 'absolute', top: 0, left: 0 })}>
        <Toast accent="info" onClose={dismissBanner}>
          {`Welcome back to the GP2 Hub${firstName ? `, ${firstName}` : ''}!`}
        </Toast>
      </div>
    )}
    <article
      css={
        showWelcomeBackBanner
          ? { position: 'relative', marginTop: rem(48) }
          : {}
      }
    >
      <DashboardHeader />
      <main css={mainStyles}>{children}</main>
    </article>
  </>
);

export default Dashboard;

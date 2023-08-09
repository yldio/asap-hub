import { pixels, TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { isEnabled } from '@asap-hub/flags';

import { workingGroupsImage } from '../images';
import { mainStyles } from '../layout';
import { PageBanner } from '../organisms';

const { rem } = pixels;

const bannerProps = {
  image: workingGroupsImage,
  position: 'center',
  title: 'Events',
  description:
    'Stay up to date with the GP2 network. Discover upcoming events and explore past events.',
};

const navStyles = css({
  marginTop: rem(32),
});

const EventsPage: React.FC = ({ children }) => (
  <article>
    <PageBanner {...bannerProps} noMarginBottom>
      <div css={navStyles}>
        <TabNav>
          {isEnabled('ASAP_UPCOMING_EVENTS') && (
            <TabLink href={gp2.events({}).upcoming({}).$}>Upcoming</TabLink>
          )}
          {isEnabled('ASAP_PAST_EVENTS') && (
            <TabLink href={gp2.events({}).past({}).$}>Past</TabLink>
          )}
          <TabLink href={gp2.events({}).calendar({}).$}>
            Subscribe to Calendars
          </TabLink>
        </TabNav>
      </div>
    </PageBanner>
    <main css={mainStyles}>{children}</main>
  </article>
);

export default EventsPage;

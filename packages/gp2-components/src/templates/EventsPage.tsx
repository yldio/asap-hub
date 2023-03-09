import { pixels, TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { workingGroupsImage } from '../images';
import { mainStyles } from '../layout';
import { PageBanner } from '../organisms';

const { rem } = pixels;

const bannerProps = {
  image: workingGroupsImage,
  position: 'center',
  title: 'Events',
  description:
    'Discover past and upcoming events within the GP2 network to learn more about the great work that other members are doing.',
};

const navStyles = css({
  marginTop: rem(32),
});

const EventsPage: React.FC = ({ children }) => (
  <article>
    <PageBanner {...bannerProps} noMarginBottom>
      <div css={navStyles}>
        <TabNav>
          <TabLink href={gp2.events({}).upcoming({}).$}>Upcoming</TabLink>
          <TabLink href={gp2.events({}).past({}).$}>Past</TabLink>
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

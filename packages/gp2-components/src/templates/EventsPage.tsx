import { workingGroupsImage } from '../images';
import { PageBanner } from '../organisms';

const bannerProps = {
  image: workingGroupsImage,
  position: 'center',
  title: 'Events',
  description:
    'Discover past and upcoming events within the GP2 network to learn more about the great work that other members are doing.',
};

const EventsPage: React.FC = () => (
  <article>
    <PageBanner {...bannerProps} />
  </article>
);

export default EventsPage;

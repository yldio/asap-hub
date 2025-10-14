import { InfoCard } from '@asap-hub/gp2-components';
import {
  userIcon,
  usersIcon,
  projectIcon,
  outputsIcon,
  eventsIcon,
  workingGroupIcon,
  dashboardIcon,
  graduateIcon,
} from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Molecules / Info Card',
  component: InfoCard,
};

export const Normal = () => (
  <InfoCard icon={userIcon} total={42} title="Active Users" />
);

export const WithUsers = () => (
  <InfoCard icon={usersIcon} total={127} title="Team Members" />
);

export const WithProjects = () => (
  <InfoCard icon={projectIcon} total={15} title="Active Projects" />
);

export const WithOutputs = () => (
  <InfoCard icon={outputsIcon} total={89} title="Research Outputs" />
);

export const WithEvents = () => (
  <InfoCard icon={eventsIcon} total={23} title="Upcoming Events" />
);

export const WithWorkingGroups = () => (
  <InfoCard icon={workingGroupIcon} total={8} title="Working Groups" />
);

export const WithDashboard = () => (
  <InfoCard icon={dashboardIcon} total={156} title="Dashboard Views" />
);

export const WithGraduates = () => (
  <InfoCard icon={graduateIcon} total={34} title="Researchers" />
);

export const SingleDigit = () => (
  <InfoCard icon={userIcon} total={5} title="New Members This Week" />
);

export const DoubleDigit = () => (
  <InfoCard icon={projectIcon} total={42} title="Ongoing Studies" />
);

export const TripleDigit = () => (
  <InfoCard icon={outputsIcon} total={357} title="Total Publications" />
);

export const LargeNumber = () => (
  <InfoCard icon={usersIcon} total={1248} title="Community Members" />
);

export const Zero = () => (
  <InfoCard icon={eventsIcon} total={0} title="Pending Approvals" />
);

export const LongTitle = () => (
  <InfoCard
    icon={workingGroupIcon}
    total={12}
    title="Active Research Working Groups Across Multiple Disciplines"
  />
);

export const ShortTitle = () => (
  <InfoCard icon={projectIcon} total={7} title="New" />
);

export const MultipleCards = () => (
  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
    <InfoCard icon={usersIcon} total={1248} title="Users" />
    <InfoCard icon={projectIcon} total={42} title="Projects" />
    <InfoCard icon={outputsIcon} total={357} title="Outputs" />
    <InfoCard icon={eventsIcon} total={23} title="Events" />
  </div>
);

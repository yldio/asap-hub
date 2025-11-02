import { ProjectDuration } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Project Duration',
  component: ProjectDuration,
};

export const ShortDuration = () => (
  <ProjectDuration startDate="2024-01-15" endDate="2024-03-15" />
);

export const MediumDuration = () => (
  <ProjectDuration startDate="2024-01-15" endDate="2024-08-15" />
);

export const AlmostOneYear = () => (
  <ProjectDuration startDate="2024-01-15" endDate="2024-11-15" />
);

export const ExactlyOneYear = () => (
  <ProjectDuration startDate="2023-01-15" endDate="2024-01-15" />
);

export const TwoYears = () => (
  <ProjectDuration startDate="2023-01-15" endDate="2025-01-15" />
);

export const ThreeYears = () => (
  <ProjectDuration startDate="2022-01-15" endDate="2025-01-15" />
);

export const FiveYears = () => (
  <ProjectDuration startDate="2020-01-15" endDate="2025-01-15" />
);

export const RealWorldExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <h3>Active Discovery Project</h3>
    <ProjectDuration startDate="2023-06-01" endDate="2025-12-31" />
    
    <h3>Completed Resource Project</h3>
    <ProjectDuration startDate="2021-03-15" endDate="2023-09-30" />
    
    <h3>Short-term Trainee Project</h3>
    <ProjectDuration startDate="2024-01-15" endDate="2024-07-15" />
  </div>
);

export const EdgeCases = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <h3>Less than 1 Month</h3>
    <ProjectDuration startDate="2024-01-15" endDate="2024-01-20" />
    
    <h3>Exactly 1 Month</h3>
    <ProjectDuration startDate="2024-01-15" endDate="2024-02-15" />
    
    <h3>11 Months (Still shows as months)</h3>
    <ProjectDuration startDate="2024-01-15" endDate="2024-12-15" />
    
    <h3>13 Months (Shows as years)</h3>
    <ProjectDuration startDate="2024-01-15" endDate="2025-02-15" />
  </div>
);


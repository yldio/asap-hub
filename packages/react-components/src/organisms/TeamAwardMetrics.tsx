import MetricsCard, { Metric } from './MetricsCard';

export type TeamAward = {
  id: string;
  name: string;
  status: boolean;
  philosophy: string;
  metricDefinition: string;
};

type TeamAwardMetricsProps = {
  awards: TeamAward[];
};

const TeamAwardMetrics: React.FC<TeamAwardMetricsProps> = ({ awards }) => {
  const metrics: Metric[] = awards.map((award) => ({
    id: award.id,
    name: award.name,
    status: award.status ? 'Y' : 'N',
    philosophy: award.philosophy,
    definition: award.metricDefinition,
  }));

  return <MetricsCard metrics={metrics} />;
};

export default TeamAwardMetrics;

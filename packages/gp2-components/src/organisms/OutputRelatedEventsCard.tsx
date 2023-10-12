import { ComponentProps } from 'react';

import { ResearchOutputRelatedEventsCard } from '@asap-hub/react-components';

type OutputRelatedEventsCardProps = ComponentProps<
  typeof ResearchOutputRelatedEventsCard
>;

const OutputRelatedEventsCard: React.FC<OutputRelatedEventsCardProps> = ({
  ...props
}) => (
  <ResearchOutputRelatedEventsCard
    {...props}
    title="Are there any related GP2 Hub events?"
    description="List all GP2 Hub events that are related to this output."
    labelTitle="Related GP2 Hub Events"
  />
);

export default OutputRelatedEventsCard;

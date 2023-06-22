import { Card, Headline2, Paragraph } from '../atoms';
import { LabeledMultiSelect } from '../molecules';

type RelatedEventsCardProps = {};

const RelatedEventsCard: React.FC<RelatedEventsCardProps> = () => {
  return (
    <Card>
      <Headline2>Are there any related CRN Hub events?</Headline2>
      <Paragraph accent="lead">
        List all CRN Hub events that are related to this output.
      </Paragraph>
      <LabeledMultiSelect
        title="Related CRN Hub Events"
        subtitle="(optional)"
        loadOptions={() => ''}
      />
    </Card>
  );
};

export default RelatedEventsCard;

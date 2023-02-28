import { gp2 } from '@asap-hub/model';

import {
  Caption,
  Card,
  formatDate,
  Headline2,
} from '@asap-hub/react-components';

type OutputCardProps = Pick<
  gp2.OutputResponse,
  'id' | 'created' | 'addedDate' | 'title' | 'authors'
>;

const OutputCard: React.FC<OutputCardProps> = ({
  id: researchOutputId,
  created,
  addedDate,

  title,
  authors,
  ...props
}) => (
  <Card>
    <Headline2 styleAsHeading={4}>{title}</Headline2>
    <Caption accent={'lead'} asParagraph>
      Date Added: {formatDate(new Date(addedDate))}
    </Caption>
  </Card>
);

export default OutputCard;

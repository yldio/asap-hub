import { InterestGroupResponse } from '@asap-hub/model';

import { Card, Divider, Headline3, Paragraph } from '../atoms';
import TagList from '../molecules/TagList';

type InterestGroupInformationProps = Pick<
  InterestGroupResponse,
  'description' | 'tags'
>;
const InterestGroupInformation: React.FC<InterestGroupInformationProps> = ({
  description,
  tags,
}) => (
  <Card>
    <Headline3>Interest Group Description</Headline3>
    <Paragraph accent="lead">
      <span css={{ whiteSpace: 'pre-line' }}>{description}</span>
    </Paragraph>
    <Divider />
    <Headline3>Interest Group Expertise</Headline3>
    <TagList tags={tags} />
  </Card>
);

export default InterestGroupInformation;

import { GroupResponse } from '@asap-hub/model';

import { Card, Divider, Headline3, Paragraph } from '../atoms';
import TagList from '../molecules/TagList';

type GroupInformationProps = Pick<GroupResponse, 'description' | 'tags'>;
const GroupInformation: React.FC<GroupInformationProps> = ({
  description,
  tags,
}) => (
  <Card>
    <Headline3>Group Description</Headline3>
    <Paragraph accent="lead">
      <span css={{ whiteSpace: 'pre-line' }}>{description}</span>
    </Paragraph>
    <Divider />
    <Headline3>Group Expertise</Headline3>
    <TagList tags={tags} />
  </Card>
);

export default GroupInformation;

import { InterestGroupResponse } from '@asap-hub/model';
import { Card, Divider, Headline3, Paragraph } from '../atoms';
import TagList from '../molecules/TagList';
import { perRem } from '../pixels';

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
    <Headline3>Tags</Headline3>
    <div
      css={{
        marginTop: `${12 / perRem}em`,
        marginBottom: `${24 / perRem}em`,
      }}
    >
      <Paragraph noMargin accent="lead">
        Explore keywords related to skills, techniques, resources, and tools.
      </Paragraph>
    </div>
    <TagList tags={tags} />
  </Card>
);

export default InterestGroupInformation;

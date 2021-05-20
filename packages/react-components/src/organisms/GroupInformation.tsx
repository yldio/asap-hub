import { useState } from 'react';
import { GroupResponse } from '@asap-hub/model';

import { Button, Card, Headline3, Paragraph, Divider } from '../atoms';
import TagList from '../molecules/TagList';

const TRIM_CONTENT = 160;

type GroupInformationProps = Pick<GroupResponse, 'description' | 'tags'>;
const GroupInformation: React.FC<GroupInformationProps> = ({
  description,
  tags,
}) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <Card>
      <Headline3>Group Description</Headline3>
      <Paragraph accent="lead">
        <span css={{ whiteSpace: 'pre-line' }}>
          {showMore
            ? description
            : description.substring(0, TRIM_CONTENT).trim()}
          {TRIM_CONTENT < description.length && (
            <>
              {!showMore && '…'}
              <br />
              <Button onClick={() => setShowMore(!showMore)} linkStyle>
                {showMore ? 'Show less' : 'Show more'}
              </Button>
            </>
          )}
        </span>
      </Paragraph>
      <Divider />
      <Headline3>Group Expertise</Headline3>
      <TagList tags={tags} />
    </Card>
  );
};

export default GroupInformation;

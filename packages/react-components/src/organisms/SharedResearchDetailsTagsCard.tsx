import { ResearchOutputResponse } from '@asap-hub/model';

import { RichText, TagList } from '..';
import { Card, Divider, Headline2, Paragraph, TextEditor } from '../atoms';
import { perRem } from '../pixels';

type SharedResearchDetailsTagsCardProps = Pick<
  ResearchOutputResponse,
  'description' | 'descriptionMD'
> & {
  tags: string[];
  displayDescription: boolean;
};

const SharedResearchDetailsTagsCard: React.FC<
  SharedResearchDetailsTagsCardProps
> = ({ tags, description = '', descriptionMD = '', displayDescription }) => (
  <Card>
    {displayDescription && (
      <div css={{ paddingBottom: `${12 / perRem}em` }}>
        <Headline2 noMargin>Description</Headline2>
        <TextEditor
          id="description"
          value={descriptionMD}
          enabled={false}
          isMarkdown
        ></TextEditor>
        {descriptionMD === '' && <RichText poorText text={description} />}
      </div>
    )}
    {displayDescription && !!tags.length && <Divider />}
    {!!tags.length && (
      <>
        <Headline2 styleAsHeading={4}>Tags</Headline2>
        <div
          css={{
            marginTop: `${12 / perRem}em`,
            marginBottom: `${24 / perRem}em`,
          }}
        >
          <Paragraph noMargin accent="lead">
            Explore keywords related to skills, techniques, resources, and
            tools.
          </Paragraph>
        </div>
        <TagList tags={tags} />
      </>
    )}
  </Card>
);
export default SharedResearchDetailsTagsCard;

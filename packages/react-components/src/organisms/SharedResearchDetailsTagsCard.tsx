import { ResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { lead, RichText, TagList } from '..';
import {
  Card,
  Divider,
  Headline2,
  Headline3,
  Paragraph,
  TextEditor,
} from '../atoms';
import { perRem, rem } from '../pixels';

type SharedResearchDetailsTagsCardProps = Pick<
  ResearchOutputResponse,
  'description' | 'descriptionMD' | 'shortDescription' | 'changelog'
> & {
  tags: string[];
  displayDescription: boolean;
};

const SharedResearchDetailsTagsCard: React.FC<
  SharedResearchDetailsTagsCardProps
> = ({
  tags,
  description = '',
  descriptionMD = '',
  displayDescription,
  shortDescription,
  changelog,
}) => (
  <Card
    overrideStyles={css({
      padding: `${rem(32)} ${rem(24)}`,
      display: 'flex',
      flexDirection: 'column',
      gap: rem(24),
    })}
  >
    {shortDescription && (
      <div>
        <div css={{ marginBottom: rem(16) }}>
          <Headline3 noMargin>Short Description</Headline3>
        </div>
        <Paragraph noMargin accent="lead">
          {shortDescription}
        </Paragraph>
      </div>
    )}
    {shortDescription && displayDescription && <Divider />}

    {displayDescription && (
      <div>
        <div css={{ marginBottom: rem(16) }}>
          <Headline3 noMargin>Description</Headline3>
        </div>
        <TextEditor
          id="description"
          value={descriptionMD}
          enabled={false}
          isMarkdown
          editorStyles={css({
            fontSize: '17px',
            letterSpacing: '0.1px',
            color: lead.rgb,
            lineHeight: '24px',
          })}
        ></TextEditor>
        {descriptionMD === '' && <RichText poorText text={description} />}
      </div>
    )}

    {(shortDescription || displayDescription) && changelog && <Divider />}

    {changelog && (
      <div>
        <div css={{ marginBottom: rem(16) }}>
          <Headline3 noMargin>Changelog</Headline3>
        </div>
        <Paragraph noMargin accent="lead">
          {changelog}
        </Paragraph>
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

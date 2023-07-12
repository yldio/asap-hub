import { css } from '@emotion/react';
import { GuideDataObject } from '@asap-hub/model';

import { HelpSection } from '../organisms';
import { perRem } from '../pixels';
import { Card, Headline2, Link, Paragraph } from '../atoms';
import { Accordion } from '../molecules';
import { externalLinkIcon } from '../icons';
import { isInternalLink } from '../utils';

const styles = css({
  display: 'flex',
  flexFlow: 'column',
  gap: `${12 / perRem}em`,
  marginBottom: `${57 / perRem}em`,
});

type DiscoverGuidesProps = {
  guides: GuideDataObject[];
};

const DiscoverGuides: React.FC<DiscoverGuidesProps> = ({
  guides,
}: DiscoverGuidesProps) => {
  const accordionItems = guides.map((guide) => ({
    icon: <></>,
    title: guide.title,
    description: guide.content.map((content) => (
      <div key={content.text}>
        <Paragraph>{content.text}</Paragraph>
        <div css={{ width: 'fit-content' }}>
          {content.linkUrl && (
            <div css={{ width: 'fit-content' }}>
              <Link buttonStyle small primary href={content.linkUrl}>
                {content.linkText}{' '}
                {!isInternalLink(content.linkUrl)[0] && externalLinkIcon}
              </Link>
            </div>
          )}
        </div>
      </div>
    )),
  }));
  return (
    <>
      <div css={styles}>
        <div>
          <Headline2 styleAsHeading={3}>Guides</Headline2>
          <Paragraph accent="lead">
            Explore our guides, templates and forms to help you with your daily
            activities.
          </Paragraph>
        </div>
        <Card accent="neutral200" padding={false}>
          <Accordion items={accordionItems} />
        </Card>
      </div>
      <HelpSection />
    </>
  );
};

export default DiscoverGuides;

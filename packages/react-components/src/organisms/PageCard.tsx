import { PageResponse } from '@asap-hub/model';

import { Card, Headline2, Paragraph, Link } from '../atoms';

type PageCardProps = Omit<PageResponse, 'path'>;

const PageCard: React.FC<PageCardProps> = ({
  title,
  shortText,
  link,
  linkText,
}) => (
  <Card>
    <Headline2 styleAsHeading={5}>{title}</Headline2>
    <Paragraph accent="lead">{shortText}</Paragraph>
    {link ? (
      <Paragraph>
        <Link href={link}>{linkText || 'Read more'}</Link>
      </Paragraph>
    ) : null}
  </Card>
);

export default PageCard;

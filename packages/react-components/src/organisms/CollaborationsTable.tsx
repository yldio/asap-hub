import { Card, Paragraph, Headline3 } from '../atoms';

type CollaborationsTableProps = {
  title: string;
  description: string;
};

const CollaborationsTable: React.FC<CollaborationsTableProps> = ({
  title,
  description,
}) => (
  <Card>
    <Headline3>{title}</Headline3>
    <Paragraph accent="lead">{description}</Paragraph>
  </Card>
);

export default CollaborationsTable;

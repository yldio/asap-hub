import { gp2 } from '@asap-hub/model';
import { PageBanner } from '../organisms';
import { mainStyles } from '../layout';

const props = (
  entityType: CreateOutputPageProps['entityType'],
  documentType: CreateOutputPageProps['documentType'],
) => ({
  title: `Share a ${EntityMappper[entityType]} ${documentType.toLowerCase()}`,
  description: `Share your ${
    EntityMappper[entityType]
  } ${documentType.toLowerCase()} with the GP2 network.`,
});

type CreateOutputPageProps = {
  entityType: 'workingGroup' | 'project';
  documentType: gp2.OutputDocumentType;
};

export const EntityMappper: Record<
  CreateOutputPageProps['entityType'],
  string
> = {
  workingGroup: 'working group',
  project: 'project',
};

const CreateOutputPage: React.FC<CreateOutputPageProps> = ({
  documentType,
  entityType,
  children,
}) => (
  <article>
    <PageBanner
      noBorderTop
      noLayoutPadding
      {...props(entityType, documentType)}
    />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default CreateOutputPage;

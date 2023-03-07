import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Model } from '@asap-hub/model';
import { PageBanner } from '../organisms';

const props = (
  entityType: CreateOutputPageProps['entityType'],
  documentType: CreateOutputPageProps['documentType'],
) => ({
  title: `Share a ${EntityMappper[entityType]} ${documentTypeMapper[
    documentType
  ].toLowerCase()}`,
  description: `Share your ${EntityMappper[entityType]} ${documentTypeMapper[
    documentType
  ].toLowerCase()} with the GP2 network.`,
});

type CreateOutputPageProps = {
  entityType: 'workingGroup' | 'project';
  documentType: gp2Routing.OutputDocumentTypeParameter;
};

export const EntityMappper: Record<
  CreateOutputPageProps['entityType'],
  string
> = {
  workingGroup: 'working group',
  project: 'project',
};

export const documentTypeMapper: Record<
  CreateOutputPageProps['documentType'],
  gp2Model.OutputDocumentType
> = {
  article: 'Article',
  'code/software': 'Code/Software',
  'data-release': 'Data Release',
  form: 'Form',
  'training-materials': 'Training Material',
  update: 'Update',
};

const CreateOutputPage: React.FC<CreateOutputPageProps> = ({
  documentType,
  entityType,
}) => (
  <article>
    <PageBanner
      noBorderTop
      noLayoutPadding
      {...props(entityType, documentType)}
    />
  </article>
);

export default CreateOutputPage;

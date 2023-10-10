import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  Card,
  Display,
  SharedResearchMetadata,
  pixels,
  UsersList,
  formatDate,
  lead,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { AssociationList } from '../molecules';

const { rem, mobileScreen } = pixels;

const containerStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const headerStyle = css({
  display: 'flex',
  marginBottom: rem(12),
});

const associationStyles = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: rem(6),
  gap: rem(6),
  margin: `${rem(4)} 0 ${rem(32)}`,
});

const timestampStyles = css({
  color: lead.rgb,
  display: 'flex',
  flexDirection: 'row',
  whiteSpace: 'pre',
  fontSize: rem(14),
  fontWeight: 400,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
  },
});

type OutputDetailPageHeaderProps = Pick<
  gp2Model.OutputResponse,
  | 'addedDate'
  | 'authors'
  | 'created'
  | 'documentType'
  | 'lastUpdatedPartial'
  | 'link'
  | 'mainEntity'
  | 'projects'
  | 'subtype'
  | 'title'
  | 'type'
  | 'workingGroups'
>;

const OutputDetailPageHeader = ({
  addedDate,
  authors,
  created,
  documentType,
  lastUpdatedPartial,
  link,
  mainEntity,
  projects,
  subtype,
  title,
  type,
  workingGroups,
}: OutputDetailPageHeaderProps) => (
  <Card padding={false}>
    <div css={containerStyles}>
      <SharedResearchMetadata
        pills={
          [
            mainEntity.type === 'WorkingGroups' ? 'Working Group' : 'Project',
            documentType,
            type,
            subtype,
          ].filter(Boolean) as string[]
        }
        link={link}
      />
      <span css={headerStyle}>
        <Display styleAsHeading={3}>{title}</Display>
      </span>
      <UsersList
        users={authors.map((author) => ({
          ...author,
          href: author.id && gp2Routing.users({}).user({ userId: author.id }).$,
        }))}
      />
      <div css={associationStyles}>
        {workingGroups?.length && (
          <AssociationList
            type="Working Group"
            inline
            associations={workingGroups}
          />
        )}
        {projects?.length && (
          <AssociationList type="Project" inline associations={projects} />
        )}
      </div>
      <div css={timestampStyles}>
        <span>Date added: {formatDate(new Date(addedDate || created))} · </span>
        <span>Last updated: {formatDate(new Date(lastUpdatedPartial))}</span>
      </div>
    </div>
  </Card>
);

export default OutputDetailPageHeader;

import React from 'react';
import css from '@emotion/css';
import { OrcidWork } from '@asap-hub/model';
import { format } from 'date-fns';
import {
  Card,
  Headline2,
  Headline3,
  TagLabel,
  Divider,
  Paragraph,
} from '../atoms';
import { perRem } from '../pixels';

const typeMap: { [key in OrcidWork['type']]: string } = {
  ANNOTATION: 'Other',
  ARTISTIC_PERFORMANCE: 'Other',
  BOOK_CHAPTER: 'Publication',
  BOOK_REVIEW: 'Publication',
  BOOK: 'Publication',
  CONFERENCE_ABSTRACT: 'Conference',
  CONFERENCE_PAPER: 'Conference',
  CONFERENCE_POSTER: 'Conference',
  DATA_SET: 'Other',
  DICTIONARY_ENTRY: 'Publication',
  DISCLOSURE: 'Intelectual Property',
  DISSERTATION: 'Publication',
  EDITED_BOOK: 'Publication',
  ENCYCLOPEDIA_ENTRY: 'Publication',
  INVENTION: 'Other',
  JOURNAL_ARTICLE: 'Publication',
  JOURNAL_ISSUE: 'Publication',
  LECTURE_SPEECH: 'Other',
  LICENSE: 'Intelectual Property',
  MAGAZINE_ARTICLE: 'Publication',
  MANUAL: 'Publication',
  NEWSLETTER_ARTICLE: 'Publication',
  NEWSPAPER_ARTICLE: 'Publication',
  ONLINE_RESOURCE: 'Publication',
  OTHER: 'Other',
  PATENT: 'Intelectual Property',
  PHYSICAL_OBJECT: 'Other',
  PREPRINT: 'Publication',
  REGISTERED_COPYRIGHT: 'Intelectual Property',
  REPORT: 'Publication',
  RESEARCH_TECHNIQUE: 'Other',
  RESEARCH_TOOL: 'Publication',
  SOFTWARE: 'Other',
  SPIN_OFF_COMPANY: 'Other',
  STANDARDS_AND_POLICY: 'Other',
  SUPERVISED_STUDENT_PUBLICATION: 'Publication',
  TECHNICAL_STANDARD: 'Other',
  TEST: 'Publication',
  TRADEMARK: 'Intelectual Property',
  TRANSLATION: 'Publication',
  WEBSITE: 'Publication',
  WORKING_PAPER: 'Publication',
  UNDEFINED: 'Other',
};

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${12 / perRem}em`,
});

const footerStyle = css({
  textAlign: 'right',
});

type RecentWorkProps = Omit<OrcidWork, 'id'>;

type RecentWorksProps = {
  readonly orcidWorks?: RecentWorkProps[];
};

const RecentWork: React.FC<RecentWorkProps> = ({
  title,
  type,
  publicationDate,
}) => {
  const { year, month = '01', day = '01' } = publicationDate;
  const date = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
  );

  return (
    <div>
      <TagLabel>{typeMap[type]}</TagLabel>
      <Headline3>{title}</Headline3>
      <div css={footerStyle}>
        <Paragraph accent="lead">
          {`Originally Published: ${format(
            date,
            `${publicationDate.day ? 'do ' : ''}${
              publicationDate.month ? 'MMMM ' : ''
            }yyyy`,
          )}`}
        </Paragraph>
      </div>
    </div>
  );
};

const RecentWorks: React.FC<RecentWorksProps> = ({ orcidWorks = [] }) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>
        Recent Publications ({orcidWorks.length})
      </Headline2>
      <div css={containerStyles}>
        {orcidWorks
          .flatMap((work, idx) => [
            <Divider key={`sep-${idx}`} />,
            <RecentWork key={`wrk-${idx}`} {...work} />,
          ])
          .slice(1)}
      </div>
    </Card>
  );
};

export default RecentWorks;

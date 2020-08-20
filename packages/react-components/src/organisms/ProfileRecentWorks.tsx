import React from 'react';
import css from '@emotion/css';
import { OrcidWork } from '@asap-hub/model';
import { format } from 'date-fns';
import { Card, Headline2, Headline3, TagLabel } from '../atoms';

type RecentWorksProps = {
  readonly orcidWorks?: OrcidWork[];
};

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
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginLeft: '-8px',
  marginRight: '-8px',
});

const elementStyle = css({
  paddingLeft: '8px',
  paddingRight: '8px',
});

const RecentWorks: React.FC<RecentWorksProps> = ({ orcidWorks = [] }) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>
        Recent Publications ({orcidWorks.length})
      </Headline2>
      <div css={containerStyles}>
        {orcidWorks.map(({ title, type, publicationDate }, index) => {
          const { year, month = '0', day = '1' } = publicationDate;
          const date = new Date(
            parseInt(year, 10),
            parseInt(month, 10),
            parseInt(day, 10),
          );

          return (
            <div key={index} css={elementStyle}>
              <TagLabel>{typeMap[type]}</TagLabel>
              <Headline3>{title}</Headline3>
              <p>
                Originally Published:{' '}
                {format(
                  date,
                  `${publicationDate.day ? 'Do ' : ''}${
                    publicationDate.month ? 'MMMM ' : ''
                  }yyyy`,
                )}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentWorks;

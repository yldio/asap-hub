import React from 'react';
import css from '@emotion/css';
import { format } from 'date-fns';
import { Card, Headline2, Headline3 } from '../atoms';

type RecentWorksProps = {
  readonly works: {
    readonly id: string;
    readonly doi: string;
    readonly title?: string;
    readonly type: string;
    readonly publicationDate: {
      readonly year: string;
      readonly month?: string;
      readonly day?: string;
    };
  }[];
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

const RecentWorks: React.FC<RecentWorksProps> = ({ works = [] }) => {
  return (
    <Card>
      <Headline2>Recent Publications ({works.length})</Headline2>
      <div css={containerStyles}>
        {works.map(({ doi, title, type, publicationDate, ...props }) => {
          const { year, month = '0', day = '1' } = publicationDate;
          const date = new Date(
            parseInt(year, 10),
            parseInt(month, 10),
            parseInt(day, 10),
          );

          return (
            <div css={elementStyle}>
              {type}
              <Headline3>{title}</Headline3>
              <p>
                Originally Published:{' '}
                {format(
                  date,
                  `${publicationDate.day ? 'Do ' : ''}${
                    publicationDate.month ? 'MMMM ' : ''
                  }${publicationDate.year ? 'yyyy' : ''}`,
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

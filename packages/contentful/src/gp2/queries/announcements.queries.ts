/* instanbul */

import { gql } from 'graphql-tag';

export const announcementsContentQueryFragment = gql`
  fragment AnnouncementsContentData on Announcements {
    description
    deadline
    link
  }
`;

export const FETCH_ANNOUNCEMENTS = gql`
  query FetchAnnouncements($limit: Int) {
    announcementsCollection(limit: $limit) {
      total
      items {
        ...AnnouncementsContentData
      }
    }
  }
  ${announcementsContentQueryFragment}
`;

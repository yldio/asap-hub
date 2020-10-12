export const query = `{
    queryDashboardContents {
      flatData {
        news {
          id
          created
          flatData {
            title
            subtitle
            text
            thumbnail {
              thumbnailUrl
            }
          }
        }
        pages {
          id
          created
          flatData {
            title
            text
          }
        }
      }
    }
  }`;

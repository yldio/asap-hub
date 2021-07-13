const algoliasearch = require('algoliasearch');
const fs = require('fs');
const StreamArray = require('stream-json/streamers/StreamArray');

const main = async () => {
  const index = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY,
  ).initIndex(process.env.ALGOLIA_INDEX);

  const stream = fs
    .createReadStream(process.env.ALGOLIA_BACKUP)
    .pipe(StreamArray.withParser());
  let chunks = [];

  await stream
    .on('data', ({ value }) => {
      chunks.push(value);
      if (chunks.length === 10000) {
        stream.pause();
        index
          .saveObjects(chunks, { autoGenerateObjectIDIfNotExist: true })
          .then(() => {
            chunks = [];
            stream.resume();
          })
          .catch(console.error);
      }
    })
    .on('end', () => {
      if (chunks.length) {
        index
          .saveObjects(chunks, {
            autoGenerateObjectIDIfNotExist: true,
          })
          .catch(console.error);
      }
    })
    .on('error', (err) => console.error(err));
};

main().catch(console.error);

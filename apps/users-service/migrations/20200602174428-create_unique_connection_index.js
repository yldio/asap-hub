module.exports = {
  async up(db) {
    await db
      .collection('users')
      .createIndex({ connections: 1 }, { unique: true, sparse: true });
  },

  async down(db) {
    const indexes = (await db.collection('users').listIndexes().toArray())
      .filter(({ key, unique }) => {
        if (unique !== true) {
          return false;
        }

        const [email, ...others] = Object.keys(key);
        if (email !== 'email' || others.length !== 0) {
          return false;
        }
      })
      .map((i) => i.name);

    await db.collection('users').dropIndexes(indexes);
  },
};

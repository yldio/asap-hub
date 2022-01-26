module.exports = (data, cb) => {
  if (!process.env.ENTITY_TYPE) {
    throw new Error('Missing ENTITY_TYPE environment variable');
  }

  try {
    const record = Object.assign({}, data);
    record.objectID = data.id;
    (record.__meta = { type: process.env.ENTITY_TYPE }), cb(null, record);
  } catch (e) {
    console.log('Transformation error:', e.message, e.stack);
    throw e;
  }
};

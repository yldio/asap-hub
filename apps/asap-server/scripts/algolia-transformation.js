module.exports = (data, cb) => {
  try {
    const record = Object.assign({}, data);
    record.objectID = data.id;
    cb(null, record);
  } catch (e) {
    console.log('Transformation error:', e.message, e.stack);
    throw e;
  }
};

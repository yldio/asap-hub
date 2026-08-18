// runs before any module loads; imports are hoisted above in-test assignments
process.env.SLS_STAGE = process.env.SLS_STAGE || 'local';
process.env.TABLE_NAME = process.env.TABLE_NAME || 'demo-hub-test-data';
process.env.BUCKET_NAME = process.env.BUCKET_NAME || 'demo-hub-test-storage';

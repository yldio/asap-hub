const SentryCli = require('@sentry/cli');

async function createReleaseAndUpload() {
  const release = process.env.CI_PIPELINE_ID;
  if (!release) {
    console.warn('CI_PIPELINE_ID is not set');
    return;
  }
  const cli = new SentryCli(null, {
    authToken: process.env.FRONTEND_SENTRY_RELEASE_AUTH_TOKEN,
    org: 'yld',
    project: 'asap-hub-frontend',
  });
  try {
    console.log('Creating sentry release ' + release);
    await cli.releases.new(release);
    console.log('Uploading source maps');
    await cli.releases.uploadSourceMaps(release, {
      include: ['build/static/js'],
      urlPrefix: '~/static/js',
      rewrite: false,
    });
    console.log('Finalizing release');
    await cli.releases.finalize(release);
  } catch (e) {
    console.error('Source maps uploading failed:', e);
  }
}
createReleaseAndUpload();

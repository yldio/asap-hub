const SentryCli = require('@sentry/cli');

async function createReleaseAndUpload() {
  if (!process.env.FRONTEND_SENTRY_RELEASE_AUTH_TOKEN) {
    console.warn(
      'This release will not be reported into sentry (hopefully because its a PR)',
    );
    return;
  }
  const cli = new SentryCli(null, {
    authToken: process.env.FRONTEND_SENTRY_RELEASE_AUTH_TOKEN,
    org: 'yld',
    project: 'asap-hub-frontend',
  });
  try {
    const release = process.env.CI_PIPELINE_ID;
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

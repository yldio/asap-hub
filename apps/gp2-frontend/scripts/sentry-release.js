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
    const release = process.env.REACT_APP_RELEASE;
    console.log('Creating sentry release ' + release);
    await cli.releases.new(release);
    console.log('Uploading source maps');
    cli.releases.setCommits(release, { auto: true });
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

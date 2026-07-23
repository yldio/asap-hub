// Repo jest runs have NODE_ENV=development (the dotenv yarn plugin loads .env
// for every yarn invocation), so the real ReactQueryDevtools would mount its
// solid-js app in jsdom (needing window.matchMedia and friends) whenever the
// QUERY_DEVTOOLS flag is on — and the flags jest setup resets overrides, which
// turns unlisted flags on. Tests never need the devtools UI, so stub it out.
module.exports = {
  ReactQueryDevtools: function MockReactQueryDevtools() {
    return null;
  },
  __esModule: true,
};

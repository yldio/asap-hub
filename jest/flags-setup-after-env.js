import '@testing-library/jest-dom';

afterEach(() => {
  // for tests in consumers of @asap-hub/flags
  require('@asap-hub/flags').reset();
  // for tests in @asap-hub/flags itself
  require('@asap-hub/flags/src').reset();
});

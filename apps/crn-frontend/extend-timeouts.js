import { configure } from '@testing-library/react';
configure({ asyncUtilTimeout: 5000 });

// Set Jest test timeout for complex React tests
jest.setTimeout(15000);

import {} from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useNotificationContext } from '../notification-message';

test('add and remove throw as default', () => {
  const { addNotification, removeNotification } = renderHook(
    useNotificationContext,
  ).result.current;

  expect(addNotification).toThrow();
  expect(removeNotification).toThrow();
});

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalStyles } from '@asap-hub/react-components/src';

let container = document.createElement('div');
let root ;
beforeAll(() => {
  container = document.body.appendChild(container);
  root = createRoot(container)
  root.render(createElement(GlobalStyles));
});
afterAll(() => {
  root.unmount();
  container.remove();
});

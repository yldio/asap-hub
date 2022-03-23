import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { GlobalStyles } from '@asap-hub/react-components/src';

let container = document.createElement('div');
beforeAll(() => {
  container = document.body.appendChild(container);
  render(createElement(GlobalStyles), container);
});
afterAll(() => {
  unmountComponentAtNode(container);
  container.remove();
});

import { renderToStaticMarkup } from 'react-dom/server';
import {
  BasicLayout,
  UnsupportedBrowserPage,
  GlobalStyles,
} from '@asap-hub/react-components';

const staticMarkup = renderToStaticMarkup(
  <>
    <GlobalStyles />
    <BasicLayout>
      <UnsupportedBrowserPage />
    </BasicLayout>
  </>,
);

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#34A270" />
    <meta
      name="description"
      content="The Hub application by ASAP: Aligning Science Across Parkinson's"
    />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <title>ASAP Hub</title>
  </head>
  <body>
    <div id="root">
      ${staticMarkup}
    </div>
  </body>
</html>
`;

export default html;

import { css, ThemeProvider } from '@emotion/react';
import colors from './colors';

const theme = {
  colors,
  navigationLinkStyles: css({
    borderRadius: 'unset',
  }),
};

const Theme: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;

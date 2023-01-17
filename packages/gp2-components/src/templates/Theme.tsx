import { ThemeProvider } from '@emotion/react';
import colors from './colors';

const theme = {
  colors,
  navigationLinkTheme: {
    svg: {
      fill: 'currentColor',
    },
  },
};

const Theme: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;

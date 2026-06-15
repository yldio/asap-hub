import { ThemeProvider } from '@emotion/react';
import colors from './colors';
import components from './components';

const theme = {
  colors,
  components,
};

const Theme: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div data-app="gp2">{children}</div>
  </ThemeProvider>
);

export default Theme;

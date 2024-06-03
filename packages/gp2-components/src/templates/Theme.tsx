import { ThemeProvider } from '@emotion/react';
import colors from './colors';
import components from './components';

const theme = {
  colors,
  components,
};

const Theme: React.FC<React.PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;

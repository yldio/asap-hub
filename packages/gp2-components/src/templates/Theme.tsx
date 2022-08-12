import { ThemeProvider } from '@emotion/react';
import colors from './colors';

const theme = {
  colors,
};

const Theme: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;

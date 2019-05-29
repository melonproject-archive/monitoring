import { createMuiTheme } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';

export const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      light: grey[600],
      main: grey[700],
      dark: grey[900],
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
});

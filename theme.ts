import { createMuiTheme } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: grey[500],
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

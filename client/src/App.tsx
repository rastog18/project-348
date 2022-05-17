import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import Root from 'views/Root'
import { Provider } from 'react-redux'
import ReduxStore from 'store'

function App() {
  // Set up MUI theme
  const theme = createTheme({
    components: {
      MuiButtonBase: {
        defaultProps: {
          // disable button ripple
          disableRipple: true,
        },
      },
    },
    typography: {
      // disable capitalization in buttons
      button: { textTransform: 'none' },
      // set default font to Nunito
      fontFamily: 'Open Sans',
    },
  })

  return (
    <Provider store={ReduxStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Root />
      </ThemeProvider>
    </Provider>
  )
}

export default App

import '~/index.css'

import { Toaster } from 'sonner'
import { BrowserRouter } from 'react-router-dom'

import SettingsProvider from '~/contexts/SettingsContext'
import Router from '~/routes'

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Router />
      </BrowserRouter>
    </SettingsProvider>
  )
}

export default App

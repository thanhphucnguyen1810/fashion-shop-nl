import { createRoot } from 'react-dom/client'
import App from '~/App.jsx'
import { Provider } from 'react-redux'
import store from '~/redux/store'

// Cấu hình React-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <ToastContainer position='bottom-left' theme='colored' />
  </Provider>
)

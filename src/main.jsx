import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  //qlgk4fzvy4lu2ih2qmhsboanfm5c2olwokras7rckv4l426fs72a
)
//serviceWorker.register();
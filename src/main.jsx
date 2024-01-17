import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider
 } from './context/AuthProvider.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(

    <AuthProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<App/>} />
          </Routes>
    </Router>
    </AuthProvider>

)

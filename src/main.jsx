import { safeString } from './utils/safeString';
// 🔒 Global Safe Guard
window.safeString = safeString;
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/SupabaseAuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
      <App />
    </AuthProvider>
  </>,
)

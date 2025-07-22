import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { QuestionProvider } from './contexts/QuestionContext'
import { AuthProvider } from './contexts/AuthContext'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <BrowserRouter>
      <QuestionProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QuestionProvider>
    </BrowserRouter>
  </StrictMode>
) 
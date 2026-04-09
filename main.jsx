import React from 'react'
import ReactDOM from 'react-dom/client'

const root = document.getElementById('root')
if (root) {
  const script = document.createElement('script')
  script.type = 'module'
  script.src = '/App.jsx'
  document.head.appendChild(script)
}

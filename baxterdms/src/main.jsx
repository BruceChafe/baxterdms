// Import necessary components and libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the main component of your application (App.jsx)
import App from './App.jsx';

// Import the main styling for your application
import './index.css';

// Use ReactDOM.createRoot to render the root component of the application
// and attach it to the HTML element with the id 'root'
ReactDOM.createRoot(document.getElementById('root')).render(
  // Wrap the main component (App) in React.StrictMode for additional development checks
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
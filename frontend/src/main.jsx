import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./css/Global.css";
import jobImage from './assets/hire.png';

// Set job.jpg as favicon
const favicon = document.querySelector("link[rel='icon']");
if (favicon) {
  favicon.href = jobImage;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
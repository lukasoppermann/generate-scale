import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App";
import ThemeContextProvider from "./contexts/themeContext";
import ConfigContextProvider from "./contexts/configContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <ConfigContextProvider>
        <App />
      </ConfigContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
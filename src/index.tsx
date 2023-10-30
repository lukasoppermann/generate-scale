import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App";
import ThemeContextProvider from "./contexts/themeContext";
// import ScaleContextProvider from "./contexts/scaleContext";
import ConfigContextProvider from "./contexts/configContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <ConfigContextProvider>
        {/* <ScaleContextProvider> */}
        <App />
        {/* </ScaleContextProvider> */}
      </ConfigContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
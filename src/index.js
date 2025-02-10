import React from "react";
import * as ReactDOM from "react-dom";
import i18next from "./utils/i18next";
import { I18nextProvider } from "react-i18next";
import App from "./App";
import "./index.css";
import { SubscriptionContextProvider } from "./contexts/subscriptionContext";

ReactDOM.render(
  <React.StrictMode>
    <SubscriptionContextProvider>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </SubscriptionContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

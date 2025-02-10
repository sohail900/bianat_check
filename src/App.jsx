import React, { createContext, useEffect } from "react";
import { Provider } from "react-redux";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./app/Store";
import { kuzzleSocket } from "./services/KuzzleSocket";
import { kuzzleHttp } from "./services/KuzzleHttp";
import { kuzzleConnected } from "./hooks/KuzzleConnection";

import { Toaster  } from 'react-hot-toast';

import "antd/dist/antd.less";
import "./App.less";
import "./Style.css";
import Routes from "./routes/routes";
import { statsAggregation } from "elastic-builder";
import { ReactLenis } from "@studio-freight/react-lenis";

export const KuzzleContext = createContext({ kuzzleSocket, kuzzleHttp });
const App = () => {
  const connected = kuzzleConnected();

  const toggleCaptchaBadge = (show) => {
    const badge = document.getElementsByClassName("grecaptcha-badge")[0];
    if(badge && badge instanceof HTMLElement){
      badge.style.visibility = show ? "visible" : "hidden";
    }
  };

  useEffect(() => {
    toggleCaptchaBadge(false);
    return () => toggleCaptchaBadge(false);
  }, []);

  return (
      <Provider store={store}>
          <PersistGate
              loading={
                  <Spin
                      size="large"
                      style={{
                          justifyContent: 'center',
                          marginTop: '25%',
                          display: 'flex',
                      }}
                  />
              }
              persistor={persistor}
          >
              <KuzzleContext.Provider value={{ kuzzleSocket, kuzzleHttp }}>
                  {!connected ? (
                      <Spin
                          size="large"
                          style={{
                              justifyContent: 'center',
                              marginTop: '25%',
                              display: 'flex',
                          }}
                      />
                  ) : (
                      <div className={'App'}>
                          <div className="font-cairo">
                              <Toaster />
                          </div>
                          {!store.getState().auth.isAuth ? (
                              <GoogleReCaptchaProvider
                                  reCaptchaKey="6Ld6vckeAAAAAJiHOE4496QEKUuhk62GYYKsR8on"
                                  scriptProps={{
                                      async: false,
                                      defer: false,
                                      appendTo: 'head',
                                      nonce: undefined,
                                  }}
                              >
                                  <BrowserRouter>
                                      <Routes />
                                  </BrowserRouter>
                              </GoogleReCaptchaProvider>
                          ) : (
                           
                                  <BrowserRouter>
                                     <Routes />
                                  </BrowserRouter>
                        
                          )}
                      </div>
                  )}
              </KuzzleContext.Provider>
          </PersistGate>
      </Provider>
  )
};

export default App;

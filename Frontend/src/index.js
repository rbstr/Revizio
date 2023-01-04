import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "react-confirm-alert/src/react-confirm-alert.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeContextProvider } from "context/ThemeContext";
import { SidebarContextProvider } from "context/SidebarContext";
import { ModalContextProvider } from "context/ModalContext";
import { AuthContextProvider } from "context/AuthContext";
import { store } from "redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeContextProvider>
        <SidebarContextProvider>
          <ModalContextProvider>
            <AuthContextProvider>
              <App />
            </AuthContextProvider>
          </ModalContextProvider>
        </SidebarContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </Provider>
);

serviceWorkerRegistration.register();

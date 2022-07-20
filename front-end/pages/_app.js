import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/bootstrap-custom.scss";
import "@/styles/global.scss";
import "@/styles/util.scss";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../shared/context/auth-context";
import { useAuth } from "../shared/hooks/auth-hook";

function MyApp({ Component, pageProps }) {
  const {
    currentLanguage,
    initialized,
    initializedHandler,
    language,
    login,
    logout,
    paid,
    paidHandler,
    planId,
    planIdHandler,
    startPage,
    startPageHandler,
    token,
    userId,
    userRole,
    userRoleHandler,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        currentLanguage: currentLanguage,
        initialized: initialized,
        initializedHandler: initializedHandler,
        isLoggedIn: !!token,
        language: language,
        login: login,
        logout: logout,
        paid,
        paidHandler: paidHandler,
        planId: planId,
        planIdHandler: planIdHandler,
        startPage: startPage,
        startPageHandler: startPageHandler,
        token: token,
        userId: userId,
        userRole,
        userRoleHandler: userRoleHandler,
      }}
    >
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default MyApp;

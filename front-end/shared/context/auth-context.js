import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: '',
  userId: null,
  token: null,
  startPage: null,
  language: 'en',
  userRole: '',
  planId: '0',
  paid: false,
  initialized: false,
  initializedHandler: () => {},
  login: () => {},
  logout: () => {},
  startPageHandler: () => {},
  currentLanguage: () => {},
  userRoleHandler: () => {},
  paidHandler: () => {},
  planIdHandler: () => {}
});


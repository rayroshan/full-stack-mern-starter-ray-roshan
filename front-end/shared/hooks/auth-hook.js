import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {

  const TWENTY_DAYS = 1000 * 60 * 60 * 24 * 20;
  const [initialized, setInitialized] = useState(false);
  const [paid, setPaid] = useState('');
  const [planId, setPlanId] = useState(null);
  const [startPage, setStartPage] = useState(null);
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [userRole, setUserRole] = useState('');

  const initializedHandler = useCallback((initialized) => {
    setInitialized(initialized);
    localStorage.setItem('initialized', JSON.stringify({
      initialized: initialized
    }));
  }, []);

  const paidHandler = useCallback((isPaid) => {
    setPaid(isPaid);
    localStorage.setItem('isPaid', JSON.stringify({
      paid: isPaid
    }))
  }, []);

  const planIdHandler = useCallback((planId) => {
    setPlanId(planId);
  }, []);

  const startPageHandler = useCallback((pagePath) => {
    setStartPage(pagePath);
  }, []);

  const userRoleHandler = useCallback((type) => {
    setUserRole(type);
    localStorage.setItem('userRole', JSON.stringify({
      userRole: type
    }));
  }, []);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + TWENTY_DAYS);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem('userData', JSON.stringify({
      userId: uid,
      token: token,
      expiration: tokenExpirationDate.toISOString()
    }))
  }, [])

  const logout = useCallback(() => {
    setInitialized(null);
    setPaid(null);
    setToken(null);
    setTokenExpirationDate(null);
    setUserRole(null);
    localStorage.removeItem('initialized');
    localStorage.removeItem('isPaid');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
  }, [])

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  }, [login]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userRole'));
    if (storedData && storedData.userRole) {
      userRoleHandler(storedData.userRole)
    }
  }, [userRoleHandler]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('initialized'));
    if (storedData && storedData.initialized) {
      initializedHandler(storedData.initialized)
    }
  }, [initializedHandler]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('isPaid'));
    if (storedData && storedData.paid) {
      paidHandler(storedData.paid)
    }
  }, [paidHandler]);

  return {
    token,
    userId,
    startPage,
    userRole,
    paid,
    planId,
    initialized,
    login,
    logout,
    startPageHandler,
    userRoleHandler,
    initializedHandler,
    paidHandler,
    planIdHandler
  };

};


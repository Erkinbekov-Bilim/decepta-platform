// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useTranslation } from 'react-i18next';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    checkAuth().catch(() => {
      setIsAuthenticated(false);
      setUserProfile(null);
    });
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthenticated(false);
      setUserProfile(null);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;
      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthenticated(true);
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      setIsAuthenticated(false);
      setUserProfile(null);
      return;
    }
    try {
      const response = await api.post('/api/user/token/refresh/', {
        refresh: refreshToken,
      });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      setIsAuthenticated(true);
      await fetchUserProfile();
    } catch (error) {
      console.error('Token refresh failed:', error);
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/user/profile/');
      console.log('Fetched userProfile:', response.data);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Profile fetch failed:', error);
      setUserProfile(null);
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  if (isAuthenticated === null) {
    return <div>{t('loading')}</div>;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userProfile, fetchUserProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 
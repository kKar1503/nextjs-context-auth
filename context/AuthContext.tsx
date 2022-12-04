import { useRouter } from 'next/router';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import type {
  LoginParam,
  User,
  UserWithToken,
  ErrorCallback,
  Error,
} from '../types';
import { consts } from '../config/auth';

type AuthValuesType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  isInitialized: boolean;
  setIsInitialized: (value: boolean) => void;
  user: User | null;
  setUser: (user: User) => void;
  login: (params: LoginParam, errorCallback: ErrorCallback) => void;
  logout: () => void;
};

const defaultProvider: AuthValuesType = {
  loading: true,
  setLoading: () => Boolean,
  isInitialized: false,
  setIsInitialized: () => Boolean,
  user: null,
  setUser: () => null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultProvider.isInitialized
  );

  const router = useRouter();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true);
      const storedToken = window.localStorage.getItem(consts.AuthTokenKey)!;
      const storedUser = JSON.parse(
        window.localStorage.getItem(consts.UserKey)!
      );
      if (storedToken) {
        setLoading(true);
        if (storedToken !== null || storedUser !== null) {
          // Verify token with if-else
          // or if there exists a /me route use it to verify
          // with .then().catch() or try-catch
          if (storedUser) setUser(storedUser as User);
          setLoading(false);
        } else {
          // When token somehow fails
          // This happens when localStorage stores an invalid token
          // i.e. expired.
          localStorage.removeItem(consts.AuthTokenKey);
          localStorage.removeItem(consts.UserKey);
          setUser(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = (params: LoginParam, errorCallback: ErrorCallback) => {
    fetch('/api/login', {
      body: JSON.stringify({
        username: params.username,
        password: params.password,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status !== 200) {
          const error: Error = await response.json();
          throw new Error(error.error);
        }
        // Return URL is used when user tried to go specific page via
        // URL but unable to go continue due to not logged in.
        // This betters the UX to have an easier time to go back to
        // the original page without added navigation.
        const returnUrl = router.query.returnUrl;

        const userData: UserWithToken = await response.json();
        const userDataWithoutToken: User = {
          username: userData.username,
          password: userData.password,
          role: userData.role,
        };

        setUser(userDataWithoutToken);

        window.localStorage.setItem(
          consts.UserKey,
          JSON.stringify(userDataWithoutToken)
        );
        window.localStorage.setItem(
          consts.AuthTokenKey,
          JSON.stringify(userData.token)
        );

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        // Using replace, so user doesn't go back to login page.
        // Since we rewrite the login page from the history state
        router.replace(redirectURL as string);
      })
      .catch((error) => errorCallback(error as Error));
  };

  const handleLogout = () => {
    setUser(null);
    setIsInitialized(false);
    window.localStorage.removeItem(consts.AuthTokenKey);
    window.localStorage.removeItem(consts.UserKey);
    router.push('/login');
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

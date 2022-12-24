import { useRouter } from 'next/router';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { consts } from '../config/auth';

/**
 * @typedef {Object} LoginParam
 * @property {string} username
 * @property {string} password
 */
/**
 * @typedef {Object} Role
 * @property {'admin' | 'user' | 'open'} role
 */
/**
 * @typedef {Object} UserToken
 * @property {string} token
 */
/**
 * @typedef {Object} CustomError
 * @property {string} error
 */
/**
 * @typedef {LoginParam & Role} User
 */
/**
 * @typedef {User & UserToken} UserWithToken
 */
/**
 * @callback ErrorCallback
 * @param {CustomError} error
 * @returns void
 */
/**
 * @typedef {Object} AuthValuesType
 * @property {boolean} loading
 * @property {(value:boolean) => void} setLoading
 * @property {boolean} isInitialized
 * @property {(value:boolean) => void} setIsInitialized
 * @property {User | null} user
 * @property {(user: User) => void} setUser
 * @property {(params: LoginParam, errorCallback: ErrorCallback) => void} login
 * @property {() => void} logout
 */

const defaultProvider = {
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

/**
 *
 * @param {{children: ReactNode}} props
 * @returns
 */
const AuthProvider = ({ children }) => {
  /** @type {[User|null, (user:User => void)]} */
  const [user, setUser] = useState(defaultProvider.user);

  /** @type {[boolean, (value:boolean => void)]} */
  const [loading, setLoading] = useState(defaultProvider.loading);

  /** @type {[boolean, (value:boolean => void)]} */
  const [isInitialized, setIsInitialized] = useState(
    defaultProvider.isInitialized
  );

  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setIsInitialized(true);
      const storedToken = window.localStorage.getItem(consts.AuthTokenKey);
      const storedUser = JSON.parse(
        window.localStorage.getItem(consts.UserKey)
      );
      if (storedToken) {
        setLoading(true);
        if (storedToken !== null || storedUser !== null) {
          // Verify token with if-else
          // or if there exists a /me route use it to verify
          // with .then().catch() or try-catch
          if (storedUser) setUser(storedUser);
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

  /**
   * HandleLogin
   * @param {LoginParam} params
   * @param {ErrorCallback} errorCallback
   */
  const handleLogin = (params, errorCallback) => {
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
          /** @type {CustomError} */
          const error = await response.json();
          throw new Error(error.error);
        }
        // Return URL is used when user tried to go specific page via
        // URL but unable to go continue due to not logged in.
        // This betters the UX to have an easier time to go back to
        // the original page without added navigation.
        const returnUrl = router.query.returnUrl;

        /** @type {UserWithToken} */
        const userData = await response.json();
        /** @type {User} */
        const userDataWithoutToken = {
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
        router.replace(redirectURL);
      })
      .catch((error) => errorCallback(error));
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

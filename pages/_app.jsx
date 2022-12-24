import '../styles/globals.css';
import React, { ReactNode } from 'react';

import { AuthProvider } from '../context/AuthContext';

import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import AclGuard from '../auth/AclGuard';
import Loader from '../components/Loading';
import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * @typedef {Object} GuardProps
 * @property {boolean} authGuard
 * @property {boolean} guestGuard
 * @property {ReactNode} children
 */

/**
 * @param {GuardProps}
 */
const Guard = ({ children, authGuard, guestGuard }) => {
  console.log('guard', { authGuard, guestGuard });
  if (guestGuard) {
    return <GuestGuard fallback={<Loader />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Loader />}>{children}</AuthGuard>;
  }
};

const App = ({ Component, pageProps }) => {
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;
  const aclAbilities = Component.acl ?? 'open';
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{router.asPath}</title>
      </Head>
      <AuthProvider>
        <Guard authGuard={authGuard} guestGuard={guestGuard}>
          <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
            <Component {...pageProps} />
          </AclGuard>
        </Guard>
      </AuthProvider>
    </>
  );
};

export default App;

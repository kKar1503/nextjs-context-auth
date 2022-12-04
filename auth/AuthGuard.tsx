import React, { ReactNode, ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import { consts } from '../config/auth';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();

  useEffect(
    () => {
      // Check if the router field is updated correctly yet on the client-side.
      if (!router.isReady) {
        return;
      }

      if (auth.user === null && !window.localStorage.getItem(consts.UserKey)) {
        // Validate if there's a need to store the returnUrl.
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath },
          });
        } else {
          router.replace('/login');
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  );

  // Fallback component during a loading
  if (auth.loading || auth.user === null) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;

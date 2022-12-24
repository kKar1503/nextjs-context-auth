import React, { ReactNode, ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import { consts } from '../config/auth';

// There's only 1 drawback in this GuestGuard design.
// It is that if you would like some pages that allow both guests and logged in user.
// This design would not support it. Since guestGuard now only supports boolean.
// If you would like to explore a more flexible version that allow more options, you
// may opt for a design that allow 3 values that allow the following behaviour:
//   • Guest Only
//   • Logged In Only
//   • Both
/**
 *
 * @param {{children: ReactNode, fallback: ReactElement | null}} props
 * @returns
 */
const GuestGuard = ({ children, fallback }) => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if the router field is updated correctly yet on the client-side.
    if (!router.isReady) {
      return;
    }

    // Just to check if they are guest or user
    if (window.localStorage.getItem(consts.UserKey)) {
      router.replace('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route]);

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;

import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import Forbidden from '../pages/403';

/**
 *
 * @param {{children: ReactNode, guestGuard: boolean, aclAbilities: 'admin' | 'user' | 'open'}} Props
 * @returns
 */
const AclGuard = ({ children, guestGuard, aclAbilities }) => {
  const router = useRouter();
  const auth = useAuth();

  if (
    guestGuard ||
    router.route === '/404' || // In the case there's a 404 page
    router.route === '/500' || // In the case there's a 500 page
    router.route === '/'
  ) {
    return <>{children}</>;
  }

  // You should have some sort of way to check for access here.
  if (aclAbilities === 'open' || aclAbilities === auth.user?.role) {
    return <>{children}</>;
  }

  // If no access
  return <Forbidden />;
};

export default AclGuard;

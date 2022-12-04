import React, { useEffect } from 'react';

import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';
import Loader from '../components/Loading';

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.user && auth.user.role) {
      // Redirect user to Home URL
      router.replace('/home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loader />;
}

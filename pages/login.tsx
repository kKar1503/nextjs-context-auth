import React, { useRef } from 'react';

import useAuth from '../hooks/useAuth';

const Login = () => {
  const auth = useAuth();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    auth.login(
      {
        username: usernameRef.current?.value!,
        password: passwordRef.current?.value!,
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <>
      <label htmlFor="username">Username</label>
      <input ref={usernameRef} id="username" type="text"></input>
      <label htmlFor="username">Password</label>
      <input ref={passwordRef} id="password" type="password"></input>
      <button onClick={handleLogin}>LOGIN</button>
    </>
  );
};

// We use these added props to declare if page allow guest
Login.guestGuard = true;

export default Login;

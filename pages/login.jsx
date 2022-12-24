import React, { useRef } from 'react';

import useAuth from '../hooks/useAuth';

const Login = () => {
  const auth = useAuth();

  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const usernameRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const passwordRef = useRef(null);

  /**
   * @param {React.MouseEvent<HTMLButtonElement>} e
   */
  const handleLogin = (e) => {
    e.preventDefault();
    auth.login(
      {
        username: usernameRef.current?.value,
        password: passwordRef.current?.value,
      },
      (error) => {
        alert(error);
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

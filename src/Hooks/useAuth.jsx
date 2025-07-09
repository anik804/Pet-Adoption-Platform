import React, { use } from 'react';
import { AuthContext } from '../Context/Auth Context/AuthContext';

const useAuth = () => {
  const authInfo = use(AuthContext);

  return authInfo;
};

export default useAuth;
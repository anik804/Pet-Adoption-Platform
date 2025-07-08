import React from 'react';
import { Outlet } from 'react-router';
import LogoSection from '../Pages/Shared/Logo Section/LogoSection';

const AuthLayout = () => {
  return (
    <div>
      <LogoSection></LogoSection>
      <Outlet></Outlet>
    </div>
  );
};

export default AuthLayout;
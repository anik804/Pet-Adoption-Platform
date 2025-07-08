import React from 'react';
import LogoSection from '../../Shared/Logo Section/LogoSection';
import bg from '../../../assets/login_bg.jpg';

const Login = () => {
  return (
    <div
      className="flex items-center justify-start min-h-screen bg-cover bg-center px-6 md:px-20"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div>
        {/* Optional: Add logo if you want it visible here */}
        {/* <LogoSection /> */}

        <div className="card bg-base-100 w-[300px] md:w-[350px] shadow-2xl">
          <div className="card-body">
            <h2 className="card-title text-center">Login to your account</h2>
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="Email" />
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="Password" />
              <div>
                <a className="link link-hover text-sm">Forgot password?</a>
              </div>
              <button className="btn btn-neutral mt-4">Login</button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

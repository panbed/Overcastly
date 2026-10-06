import { Button, buttonVariants } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { Link } from 'react-router-dom';
import Login from '../components/Login.tsx';
import { useState } from 'react';
import Register from '@/components/Register.tsx';
import Verify from '@/components/Verify.tsx';
import Recovery from '@/components/Recovery.tsx';

export function LoginPage() {
  const [loginState, setLoginState] = useState("login")

  function renderLogin() {
    if (loginState == "login") {
      return <Login setLoginState={setLoginState} />
    }
    else if (loginState == "register") {
      return <Register setLoginState={setLoginState} />
    }
    else if (loginState == "verify") {
      return <Verify setLoginState={setLoginState}/>
    }
    else if (loginState == "recovery") {
      return <Recovery setLoginState={setLoginState}/>
    }
  }

  function topRightButton() {
    if (loginState == "login") {
      return <Button variant="ghost" className='absolute right-4 top-4' onClick={() => setLoginState("register")}>Register</Button>
    }
    else if (loginState == "register" || loginState == "verify" || loginState == "recovery") {
      return <Button variant="ghost" className='absolute right-4 top-4' onClick={() => setLoginState("login")}>Login</Button>
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute z-20 h-32 flex items-center font-medium">
            <img src='/logo_light_min.png' className='w-12'/>
            <h1 className='scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl'>vercastly</h1>
          </div>
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-[url('/noaa_goes.jpg')] bg-cover bg-center bg-no-repeat opacity-50" />
          
          <div className="relative z-20 flex h-full items-center justify-center align-middle font-medium">
            <img src='/logo_pin.svg' className='absolute invert h-full'/>
          </div>
        </div>
        <div className="lg:p-8">
          {topRightButton()}
          <div className="mx-auto my-auto flex lg:w-1/2 xl:w-1/4 flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight capitalize">
                {loginState}
              </h1>
            </div>
            <div className='justify-center flex'>
              {renderLogin()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

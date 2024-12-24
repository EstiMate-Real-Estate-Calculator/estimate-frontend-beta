'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AlertBubble from '@components/AlertBubble'; // Make sure you have this component

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUsername(''); // used to allow build, need to implement username input

    const loginData = {
      password,
      ...(username ? { username } : {}),
      ...(email ? { email } : {}),
    };

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='text-center sm:mx-auto sm:w-full sm:max-w-sm'>
        <h1 className='text-5xl text-light-accent'>EstiMate</h1>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          Sign in to your account
        </h2>
      </div>

      {error && <AlertBubble message={error} type="error" />}

      <div className='mt-10 rounded-md border-2 border-solid border-[#EDEEEF] bg-[#FFFFFF] p-5 font-inter font-medium sm:mx-auto sm:w-full sm:max-w-sm'>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Email address / Username
            </label>
            <div className='mt-2'>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Password
              </label>
              <div className='text-sm'>
                <a
                  href='/forgot-password'
                  className='font-semibold text-indigo-600 hover:text-indigo-500'
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Sign in
            </button>
          </div>
        </form>

        <div>
          <div className='flex flex-row py-8'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 50 1'
              fill='none'
              stroke='currentColor'
            >
              <g>
                <line
                  strokeLinecap='round'
                  strokeWidth='.5'
                  y1='.5'
                  x2='50'
                  y2='.5'
                />
              </g>
            </svg>
            <p className='text-nowrap px-5'>Or continue with</p>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 50 1'
              fill='none'
              stroke='currentColor'
            >
              <g>
                <line
                  strokeLinecap='round'
                  strokeWidth='.5'
                  y1='.5'
                  x2='50'
                  y2='.5'
                />
              </g>
            </svg>
          </div>

          <div className='flex flex-row gap-2'>
            <button className='flex h-[46px] w-full max-w-[200px] flex-row items-center justify-center gap-3 rounded-md border-2 border-solid border-light-border'>
              <Image
                src='/icons/google.svg'
                width={24}
                height={24}
                alt='Google Icon'
              />
              <p>Google</p>
            </button>
            <button className='flex h-[46px] w-full max-w-[200px] flex-row items-center justify-center gap-3 rounded-md border-2 border-solid border-light-border'>
              <Image
                src='/icons/apple.svg'
                width={22}
                height={22}
                alt='Apple Icon'
              />
              <p>Apple</p>
            </button>
          </div>
        </div>

        <p className='mt-10 text-center text-sm text-gray-500'>
          Not a member? <span> </span>
          <a
            href='/sign-up'
            className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
          >
            Start a 3 day free trial
          </a>
        </p>
      </div>
    </div>
  );
}

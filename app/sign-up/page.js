'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AlertBubble from '@/components/AlertBubble';


export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      password,
      username,
      email,
    };

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (res.ok) {
      router.push('/sign-in');
    } else {
      const errorData = await res.json();
      setError(errorData.message || 'Sign up failed');
    }
  };

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      {error && <AlertBubble message={error} onClose={() => setError(null)} />}
      <div className='text-center sm:mx-auto sm:w-full sm:max-w-sm'>
        <h1 className='text-5xl text-light-accent'>EstiMate</h1>
        <p className='mt-10 text-center text-lg leading-9 tracking-tight text-gray-900'>
          Create an account or<span> </span>
          <a
            href='/sign-in'
            className='text-indigo-600 underline hover:text-indigo-500'
          >
            log in.
          </a>
        </p>
      </div>

      <div className='mt-10 rounded-md border-2 border-solid border-[#EDEEEF] bg-[#FFFFFF] p-5 font-inter font-medium sm:mx-auto sm:w-full sm:max-w-sm'>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Email address
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
            <label
              htmlFor='username'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Username
            </label>
            <div className='mt-2'>
              <input
                id='username'
                name='username'
                type='username'
                autoComplete='username'
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

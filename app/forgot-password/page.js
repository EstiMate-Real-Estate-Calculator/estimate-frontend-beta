'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AlertBubble from '@components/AlertBubble';

export default function Page() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
    };

    try {
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
        setError(errorData.message || 'Resetting your password has failed');
      }
    } catch (err) {
      setError(`An error occurred while trying to reset your password: ${err.message}`);
    }
  };

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='text-center sm:mx-auto sm:w-full sm:max-w-sm'>
        <h1 className='text-5xl text-light-accent'>EstiMate</h1>
        <p className='mt-10 text-center text-lg leading-9 tracking-tight text-gray-900'>
          Enter your email and we&apos;ll send instructions on how to reset your
          password.
        </p>
      </div>

      {error && <AlertBubble message={error} type="error" />}

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
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
      <p className='mt-10 text-center text-sm text-gray-500'>
        Go back to the <span> </span>
        <a
          href='/sign-in'
          className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
        >
          Sign-in Page
        </a>
      </p>
    </div>
  );
}

'use client'; // This marks the component as a client component

const SignOutButton = () => {
  return (
    <button
      onClick={() => {
        window.open('/sign-in', '_self'); // Opens in the same tab
      }}
      className='mt-2 rounded-md bg-light-primary px-3 py-2 text-lg text-white hover:bg-light-primary_light'
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;

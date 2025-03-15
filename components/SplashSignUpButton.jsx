'use client'; // This marks the component as a client component

const SignUpButton = () => {
  return (
    <button
      onClick={() => {
        window.open('/payment', '_self'); // Opens in the same tab
      }}
      className='mt-2 rounded-md bg-light-primary px-3 py-2 text-lg text-white hover:bg-light-primary_light'
    >
      Start Searching
    </button>
  );
};

export default SignUpButton;

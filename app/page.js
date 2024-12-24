import SplashNavBar from '@components/SplashNavBar.js';
import SignUpButton from '@components/SplashSignUpButton';

export default function Page() {
  return (
    <div className='xlg:bg-splash-background-xlarge xs: h-full w-auto bg-splash-background-small bg-cover bg-[center_top] bg-no-repeat sm:bg-splash-background-medium lg:bg-splash-background-large xl:bg-[center_top_-4rem]'>
      <div className='h-full w-full bg-black bg-opacity-5'>
        {/* Navigation */}
        <SplashNavBar />

        {/* Hero Statement */}
        <div className='pl-32 pt-36'>
          <h1 className='font-inter text-6xl font-black text-light-secondary'>
            Prospecting
          </h1>
          <h1 className='font-inter text-6xl font-black text-light-secondary'>
            Made Simple.
          </h1>
          <SignUpButton />
        </div>

        {/* Footer */}
        <div className='absolute bottom-0 flex w-full flex-row items-center justify-center gap-6 pb-3'>
          <p className="mb-2">© {new Date().getFullYear()} EstiMate. All rights reserved.</p>
          <a href='privacy-policy' className='text-white'>
            Privacy Policy
          </a>
          <a href='https://discord.gg/RXmpKUqz' className='text-white' target="_blank" rel="noopener noreferrer">
            Join our Discord
          </a>
        </div>
      </div>
    </div>
  );
}
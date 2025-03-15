'use client';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className='h-full w-[200px] bg-[#FAFAFA] px-3 flex flex-col items-center'>
      {/* EstiMate Logo */}
      <Link href='/dashboard'>
        <h1 className='text-3xl font-bold text-[#155E75] cursor-pointer my-4'>EstiMate</h1>
      </Link>
      
      {/* Extension Link */}
      <div className='hidden flex-row gap-5 md:flex lg:gap-8'>
        <a 
          href='https://chromewebstore.google.com/detail/estimate-demo/ibgdanpaoapljanhifdofglnibahljbe?authuser=1&hl=en' 
          target="_blank" 
          rel="noopener noreferrer" // Security best practice
          className='text-lg text-[#155E75] font-medium hover:underline hover:text-[#0E4B5C] transition duration-200'
        >
          Extension
        </a>
      </div>

      {/* Promotion Video Link */}
      <a
        href='https://www.youtube.com/watch?v=47sO3SZWVpc'
        target="_blank"
        rel="noopener noreferrer"
        className='text-lg text-[#155E75] font-medium hover:underline hover:text-[#0E4B5C] transition duration-200 mt-4'
      >
        Promo Video
      </a>
    </div>
  );
};

export default Sidebar;
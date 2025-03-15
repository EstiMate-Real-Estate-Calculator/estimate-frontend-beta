"use client";
import { useState } from "react";

const SplashNavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="flex w-full flex-row items-center justify-between bg-transparent px-2 py-8 md:px-20">
      {/* Logo */}
      <h1 className="text-5xl text-light-accent">EstiMate</h1>

      {/* Nav Menu - Large Screens */}
      <div className="rounded-md px-3 py-2 text-lg text-light-body">
        <a
          href="https://chromewebstore.google.com/detail/estimate-demo/ibgdanpaoapljanhifdofglnibahljbe?authuser=1&hl=en"
          target="_blank"
          rel="noopener noreferrer" // Security best practice
        >
          Extension
        </a>
        <a href="/FAQ" className="rounded-md px-3 py-2 text-lg text-light-body">
          FAQ
        </a>
        <a
          href="/sign-in"
          className="rounded-md px-3 py-2 text-lg text-light-primary"
        >
          Login
        </a>
        <a
          href="/payment"
          className="rounded-md bg-light-primary px-3 py-2 text-lg text-white hover:bg-light-primary_light"
        >
          Sign Up
        </a>
      </div>

      {/* Nav Menu Button - Small Screens */}
      <div className="absolute right-2 top-10 flex items-center md:hidden">
        <button
          className={`inline-flex items-center justify-center rounded-md p-2 text-light-body hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ${mobileMenuOpen ? "hidden" : "inline-flex"} `}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className={mobileMenuOpen ? "hidden" : "block h-6 w-6"}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Nav Menu - Small Screens */}
      <div
        className={`fixed inset-0 z-20 bg-gray-800 bg-opacity-75 transition-opacity ${mobileMenuOpen ? "block" : "hidden"}`}
        aria-hidden="true"
      >
        <div className="fixed inset-0 flex justify-center p-2">
          <div className="max-w-xl flex-1 divide-y-2 divide-gray-600 bg-gray-800 text-white">
            <div className="flex items-center justify-between p-4">
              <div>
                <h1 className="text-4xl text-light-accent">EstiMate</h1>
              </div>
              <div className="-mr-2">
                <button
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700"
              >
                Extension
              </a>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700"
              >
                FAQ
              </a>
              {/* New section for promotional video */}
              <a
                href="https://www.youtube.com/watch?v=47sO3SZWVpc"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 text-lg text-light-body"
              >
                Promo Video
              </a>
              <a
                href="/sign-in"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700"
              >
                Login
              </a>
              <a
                href="/sign-up"
                className="block rounded-md bg-blue-500 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
              >
                Signup
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SplashNavBar;

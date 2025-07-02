import React from "react";
// Assuming 'link' import was a typo and not needed, removed it.
// import { link } from "fs";

const LinkClass =
  "dark:text-gray-100 hover:text-cyan-200 transition-colors hover:bg-gradient-to-r hover:from-cyan-50 hover:to-cyan-200 dark:hover:bg-gradient-to-r dark:hover:from-cyan-50 dark:hover:to-cyan-200 hover:bg-clip-text"; // Updated LinkClass for dark mode hover

const Footer = () => {
  return (
    <footer
      className="bg-cyan-900 py-12 text-cyan-50 text-md
    dark:bg-gray-900 dark:text-gray-300"
    >
      {" "}
      {/* Dark mode background and text */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h6
            className="font-semibold text-3xl text-cyan-200 mb-2
          dark:text-cyan-300"
          >
            {" "}
            {/* Dark mode heading color */}
            <span className="bg-gradient-to-r from-cyan-50 to-cyan-200 text-transparent bg-clip-text">
              EquaLab
            </span>
          </h6>
          <p className="mb-1">
            EquaLab is a free platform with online tools for engineers and
            scientists.
          </p>
        </div>

        <div>
          <h6
            className="font-semibold text-cyan-100 mb-2
          dark:text-gray-200"
          >
            {" "}
            {/* Dark mode heading color */}
            Contact Us
          </h6>
          <p className="mb-1">
            <a href="mailto:info@equalab.uk" className={LinkClass}>
              info@equalab.uk
            </a>
          </p>

          <p>Milton Keynes, </p>
          <p>Buckinghamshire</p>
        </div>

        <div>
          <h6
            className="font-semibold text-cyan-100 mb-2
          dark:text-gray-200"
          >
            {" "}
            {/* Dark mode heading color */}
            Quick Links
          </h6>
          <ul className="list-none space-y-1">
            <li>
              <a href="/" className={LinkClass}>
                Library
              </a>
            </li>
            <li>
              <a href="/add" className={LinkClass}>
                Add Equations
              </a>
            </li>
            <li>
              <a href="/settings" className={LinkClass}>
                Settings
              </a>
            </li>
            <li>
              <a href="https://equalab.uk" className={LinkClass}>
                EquaLab Home
              </a>
            </li>

            {/* Add more quick links as needed */}
          </ul>
        </div>
      </div>
      <div className="mt-6 py-4 text-center">
        <hr
          className="border-t border-cyan-500 w-1/2 mx-auto
        dark:border-gray-700"
        />{" "}
        {/* Dark mode border color */}
        <p
          className="text-sm text-cyan-50 mt-6
        dark:text-gray-400"
        >
          {" "}
          {/* Dark mode text color */}
          &copy; {new Date().getFullYear()} EquaLab. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

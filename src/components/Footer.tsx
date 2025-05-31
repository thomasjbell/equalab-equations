import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 text-gray-600 text-md">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h6 className="font-semibold text-gray-800 mb-2">Quick Links</h6>
          <ul className="list-none space-y-1">
            <li>
              <a href="/" className="hover:text-indigo-500">
                Library
              </a>
            </li>
            <li>
              <a href="/add" className="hover:text-indigo-500">
                Add Equations
              </a>
            </li>
            <li>
              <a href="/settings" className="hover:text-indigo-500">
                Settings
              </a>
            </li>

            {/* Add more quick links as needed */}
          </ul>
        </div>
        <div>
          <h6 className="font-semibold text-gray-800 mb-2">Contact Us</h6>
          <p className="mb-1">
            Email:{" "}
            <a href="mailto:info@equalab.uk" className="hover:text-indigo-500">
              info@equalab.uk
            </a>
          </p>

          <p>Address: 123 Main Street, Anytown, UK</p>
        </div>
        <div>
          <h6 className="font-semibold text-gray-800 mb-2">Follow Us</h6>
          <ul className="list-none space-y-1">
            <li>
              <a
                href="https://facebook.com"
                className="hover:text-indigo-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                className="hover:text-indigo-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                className="hover:text-indigo-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            {/* Add more social media links as needed */}
          </ul>
        </div>
      </div>
      <div className="mt-6 py-4 text-center border-t border-gray-200">
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} EquaLab. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

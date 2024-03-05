import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white p-8 box-border shadow-md">
      <ul className=" flex justify-center gap-24 font-semibold">
        <li>
          <Link to="/" className="text-black hover:text-gray-300">Home</Link>
        </li>
        <li>
          <Link to="/about" className="text-black hover:text-gray-300">About</Link>
        </li>
        <li>
          <Link to="/contact" className="text-black hover:text-gray-300">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

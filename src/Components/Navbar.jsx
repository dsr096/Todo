import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import './Navbar.css';

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="navbar">
      {/* Left side - Brand */}
      <div className="navbar-left">
        <span className="navbar-logo">🌟 MyToDoApp</span>
      </div>

      {/* Right side - Auth Buttons */}
      <div className="navbar-right">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <span className="welcome-text">Welcome, {user?.firstName || 'User'} 👋</span>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;



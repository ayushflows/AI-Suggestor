'use client';

import Link from 'next/link';
import { Sparkles, Rocket, LogOut, MessageCircle } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const Navbar = () => {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' }); // Redirect to homepage after sign out
  };

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    } else if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return 'U'; // Default initial
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 border-b border-gray-700/50 bg-gray-900/40 shadow-2xl">
      <div className="container mx-auto px-6 sm:px-10 py-3.5 flex justify-between items-center">
        <Link href="/" className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-pink-500 hover:to-purple-500 transition duration-500 ease-in-out transform hover:scale-105">
          AIProductiv
        </Link>
        <div className="flex items-center space-x-4 md:space-x-5">
          {status === 'loading' ? (
            <div className="w-9 h-9 bg-gray-700 rounded-full animate-pulse"></div> // Loading placeholder
          ) : session ? (
            // User is logged in
            <>
              <Link href="/chat" className="flex items-center text-gray-200 hover:text-white transition-colors duration-300 group text-sm sm:text-base">
                <MessageCircle className="w-5 h-5 mr-1.5 text-sky-400 group-hover:text-sky-300 transition-colors duration-300" />
                Chat
              </Link>
              {session.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  width={36} 
                  height={36} 
                  className="rounded-full border-2 border-purple-500/70" 
                />
              ) : (
                <div className="w-9 h-9 flex items-center justify-center bg-purple-600 text-white rounded-full text-sm font-semibold border-2 border-purple-500/70">
                  {getUserInitials()}
                </div>
              )}
              <span className="text-sm text-gray-300 hidden md:block truncate max-w-[150px]" title={session.user?.name || session.user?.email || 'User'}>
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <LogOut className="w-4 h-4 mr-1 sm:mr-1.5" />
                Logout
              </button>
            </>
          ) : (
            // User is not logged in
            <>
              <Link href="/#features" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group text-sm sm:text-base">
                <Sparkles className="w-5 h-5 mr-1.5 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
                Features
              </Link>
              <Link href="/login" className="flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-sm sm:text-base">
                <Rocket className="w-5 h-5 mr-1.5" />
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
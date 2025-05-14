import Link from 'next/link';
import { Sparkles, Rocket } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 border-b border-gray-700/50 bg-gray-900/40 shadow-2xl">
      <div className="container mx-auto px-8 sm:px-12 py-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-pink-500 hover:to-purple-500 transition duration-500 ease-in-out transform hover:scale-105">
          AIProductiv
        </Link>
        <div className="flex items-center space-x-6 md:space-x-8">
          <Link href="#features" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
            Features
          </Link>
          <Link href="/login" className="flex items-center px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out">
            <Rocket className="w-5 h-5 mr-2" />
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
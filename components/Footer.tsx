import Link from 'next/link';
import { Sparkle } from 'lucide-react'; // Example icon, can be changed or removed

const Footer = () => {
  return (
    <footer className="bg-gray-900/70 border-t border-gray-700/50 py-12 backdrop-blur-sm mt-10">
      <div className="container mx-auto px-6 text-center">
        <Link href="/" className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 hover:from-pink-500 hover:to-purple-500 transition duration-300 ease-in-out mb-6 inline-flex items-center">
          <Sparkle className="w-7 h-7 mr-2 opacity-80" /> AIProductiv
        </Link>
        <p className="text-gray-400 text-sm mb-3 max-w-md mx-auto">
          &copy; {new Date().getFullYear()} AIProductiv. Elevating your productivity and well-being, one intelligent suggestion at a time.
        </p>
        <p className="text-gray-500 text-xs">
          Built with Next.js, Tailwind CSS, and Lucide Icons. Designed for focus & flow.
        </p>
        {/* Optional: Add social media links or other footer links here */}
        {/* Example for social links:
        <div className="mt-6 flex justify-center space-x-5">
          <Link href="#" className="text-gray-400 hover:text-purple-400"><Github size={20} /></Link>
          <Link href="#" className="text-gray-400 hover:text-sky-400"><Twitter size={20} /></Link>
        </div>
        */}
      </div>
    </footer>
  );
};

export default Footer; 
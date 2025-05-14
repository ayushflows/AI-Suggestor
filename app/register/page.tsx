import Link from 'next/link';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

// Using a simple Google icon component
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56,12.25C22.56,11.47 22.49,10.72 22.36,10H12.27V14.44H18.07C17.78,15.93 16.93,17.22 15.57,18.12V20.86H19.2C21.36,18.92 22.56,15.93 22.56,12.25Z" />
    <path d="M12.27,24C15.3,24 17.82,23.04 19.2,21.36L15.57,18.12C14.57,18.82 13.47,19.22 12.27,19.22C9.97,19.22 8,17.63 7.27,15.41H3.58V18.21C5.13,21.55 8.48,24 12.27,24Z" />
    <path d="M7.27,15.41C7.07,14.82 6.95,14.19 6.95,13.5C6.95,12.81 7.07,12.18 7.27,11.59V8.79H3.58C2.88,10.09 2.44,11.73 2.44,13.5C2.44,15.27 2.88,16.91 3.58,18.21L7.27,15.41Z" />
    <path d="M12.27,6.78C13.75,6.78 14.97,7.28 15.88,8.14L19.26,4.86C17.82,3.49 15.3,2.56 12.27,2.56C8.48,2.56 5.13,5.04 3.58,8.79L7.27,11.59C8,9.37 9.97,6.78 12.27,6.78Z" />
  </svg>
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-black p-6 sm:p-8">
      <div className="w-full max-w-lg p-8 sm:p-10 space-y-8 bg-gray-800/60 backdrop-blur-lg shadow-2xl rounded-xl border border-gray-700/80">
        <div className="text-center space-y-2">
          <Link href="/" className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 hover:from-pink-500 hover:to-purple-500 transition duration-300 ease-in-out inline-block">
            AIProductiv
          </Link>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100">Create Your Account</h2>
          <p className="text-sm text-gray-400">Join us and unlock your full potential.</p>
        </div>

        <form className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="block w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-700/80 text-white"
                placeholder="Your Name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-700/80 text-white"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-700/80 text-white"
                placeholder="Choose a strong password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-700/80 text-white"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-5 h-5 mr-2.5" /> Create Account
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-600/70"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-800 text-gray-400">Or sign up with</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-700/60 hover:bg-gray-700/80 text-sm font-medium text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300"
          >
            <GoogleIcon /> Sign up with Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{
            ' '
          }
          <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
} 
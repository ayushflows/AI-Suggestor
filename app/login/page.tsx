'use client';

import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import React, { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginMessages() {
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registration successful! Please log in.');
    }
    if (searchParams.get('error')) {
      // This can be used if NextAuth redirects with an error query param
      // For now, we handle errors from signIn directly
    }
  }, [searchParams]);

  if (successMessage) {
    return <p className="text-center text-green-400 bg-green-900/30 p-3 rounded-md mb-4">{successMessage}</p>;
  }
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/chat' });
    // setIsLoading(false); // signIn will redirect
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn('credentials', {
      redirect: false, // Handle redirect manually to show errors on this page
      email,
      password,
      // callbackUrl: '/chat' // We will manually redirect on success
    });

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "Invalid email or password." : result.error);
    } else if (result?.ok) {
      // Sign-in successful
      router.push('/chat'); // Redirect to chat page
    } else {
      setError("An unexpected error occurred during sign-in. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-black p-6 sm:p-8">
      <div className="w-full max-w-lg p-8 sm:p-10 space-y-7 bg-gray-800/60 backdrop-blur-lg shadow-2xl rounded-xl border border-gray-700/80">
        <div className="text-center space-y-2">
          <Link href="/" className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 hover:from-pink-500 hover:to-purple-500 transition duration-300 ease-in-out inline-block">
            AIProductiv
          </Link>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100">Welcome Back!</h2>
          <p className="text-sm text-gray-400">Sign in to elevate your productivity.</p>
        </div>
        
        <Suspense fallback={<div>Loading messages...</div>}>
            <LoginMessages />
        </Suspense>

        {error && <p className="text-center text-red-400 bg-red-900/30 p-3 rounded-md mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="block w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-700/80 text-white disabled:opacity-70"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="block w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-700/80 text-white disabled:opacity-70"
                placeholder="••••••••"
              />
            </div>
            <div className="text-right mt-2.5">
              <a href="#" className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && !email.includes('@') ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <><LogIn className="w-5 h-5 mr-2.5" /> Sign In</>
              )}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-600/70"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-800 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-700/60 hover:bg-gray-700/80 text-sm font-medium text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading && email.includes('@') ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting...
                </>
            ) : (
                <><Image src="https://authjs.dev/img/providers/google.svg" alt="Google icon" width={20} height={20} className="mr-3" /> Sign in with Google</>
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don&apos;t have an account?{
            ' '
          }
          <Link href="/register" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
} 
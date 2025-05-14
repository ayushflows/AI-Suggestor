'use client'; // Make this a Client Component

import { BrainCircuit } from 'lucide-react'; // Or Bot, Zap, etc.
import { useSession } from 'next-auth/react'; // Import useSession
import { useRouter } from 'next/navigation'; // Import useRouter

const HeroSection = () => {
  const { status } = useSession(); // Get session data and status
  const router = useRouter(); // Initialize router

  const handleUnlockClick = () => {
    if (status === 'authenticated') {
      router.push('/chat'); // Redirect to /chat if authenticated
    } else {
      router.push('/login'); // Redirect to /login if not authenticated
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-20 sm:pt-24 md:pt-28 bg-gradient-to-br from-black via-purple-950/50 to-black">
      {/* Optional: A very subtle, almost invisible pattern or noise layer if needed for texture */}
      {/* <div className="absolute inset-0 z-0 opacity-5" style={{backgroundImage: 'url(...)'}}></div> */}

      <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 relative z-10 flex-grow flex items-center">
        {/* Adjusted grid for 60/40 split: md:grid-cols-5, content md:col-span-3, illustration md:col-span-2 */}
        <div className="grid md:grid-cols-5 gap-x-8 lg:gap-x-12 items-center w-full">
          {/* Left Column: Content (60%) */}
          <div className="md:col-span-3 text-center md:text-left">
            {/* Reduced font size for headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 lg:mb-8 leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 animate-text-pop">
                Elevate Your Focus.
              </span>
              <span className="block text-gray-300 mt-2 sm:mt-3">
                Conquer Your Day, Intelligently.
              </span>
            </h1>
            {/* Reduced font size for paragraph */}
            <p className="text-base sm:text-lg text-gray-400 mb-8 lg:mb-10 max-w-xl mx-auto md:mx-0">
              AIProductiv is your personalized command center for peak performance. Seamlessly switch modes, get smart suggestions, and unlock your true potential with AI-driven insights.
            </p>
            {/* Updated button: Use onClick handler instead of href */}
            <button 
              onClick={handleUnlockClick} 
              className="px-6 py-3 text-md sm:px-8 sm:py-3.5 sm:text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out inline-block"
            >
              {status === 'loading' ? 'Loading...' : 'Unlock Productivity Now'}
            </button>
          </div>

          {/* Right Column: Illustration Placeholder (40%) */}
          <div className="md:col-span-2 hidden md:flex justify-center items-center relative mt-12 md:mt-0">
            <BrainCircuit className="w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 text-purple-500/50 animate-float" />
            {/* Pulsing circles - kept subtle */}
            <div className="absolute w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-purple-700/10 rounded-full animate-ping-slow -z-10"></div>
            <div className="absolute w-48 h-48 sm:w-52 sm:h-52 lg:w-72 bg-pink-700/05 rounded-full animate-ping-slower -z-10" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 
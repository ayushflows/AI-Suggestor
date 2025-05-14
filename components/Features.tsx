import { Zap, Brain, Gamepad2 } from 'lucide-react'; // Example icons

const Features = () => {
  const featuresData = [
    {
      title: "Dynamic Modes",
      description: "Instantly switch your digital environment for Gaming, Deep Work, or Study. Tailored suggestions and app blocking included.",
      icon: <Gamepad2 className="w-10 h-10 mb-4 text-pink-400 group-hover:text-pink-300 transition-all duration-300" />,
      gradient: "from-pink-500/30 to-purple-600/30"
    },
    {
      title: "AI-Powered Insights",
      description: "Leverage AI to understand your peak times, get smart break reminders, and receive motivational nudges.",
      icon: <Brain className="w-10 h-10 mb-4 text-purple-400 group-hover:text-purple-300 transition-all duration-300" />,
      gradient: "from-purple-500/30 to-indigo-600/30"
    },
    {
      title: "Actionable Suggestions",
      description: "Not just what to do, but how. Get direct links to apps, sites, or even pre-filled Lo-Fi playlists.",
      icon: <Zap className="w-10 h-10 mb-4 text-sky-400 group-hover:text-sky-300 transition-all duration-300" />,
      gradient: "from-sky-500/30 to-teal-600/30"
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative bg-gray-900 overflow-hidden">
      {/* Subtle background pattern or texture */}
      <div className="absolute inset-0 opacity-5 z-0"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A0AEC0' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
            Supercharge Your Productivity
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            AIProductiv isn't just an assistant; it's your strategic partner in achieving more with less stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative p-8 rounded-2xl bg-gray-800/60 backdrop-blur-md shadow-2xl border border-gray-700/80 overflow-hidden transition-all duration-500 hover:shadow-purple-500/30 hover:border-purple-600/70 transform hover:-translate-y-2`}
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="text-2xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
               {/* Inner glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 
const HeroSection = () => {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Boost Your Productivity</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Your personal AI assistant to help you focus and achieve more.
        </p>
        <a href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded">
          Get Started Now
        </a>
      </div>
    </section>
  );
};

export default HeroSection; 
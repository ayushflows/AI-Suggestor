const Features = () => {
  return (
    <section id="features" className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Personalized Modes</h3>
            <p>Switch between Gaming, Study, or Work modes for tailored suggestions.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Smart Suggestions</h3>
            <p>Get recommendations based on time, mood, and your habits.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p>Receive AI-generated quotes and advice to stay motivated.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 
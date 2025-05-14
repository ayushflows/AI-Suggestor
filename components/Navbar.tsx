const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Productivity Assistant</div>
        <div>
          <a href="#features" className="px-3 hover:text-gray-300">Features</a>
          <a href="/login" className="px-3 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white">Get Started</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
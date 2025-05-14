const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 text-center">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Productivity Assistant. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">
          Made with ❤️ for your focus
        </p>
      </div>
    </footer>
  );
};

export default Footer; 
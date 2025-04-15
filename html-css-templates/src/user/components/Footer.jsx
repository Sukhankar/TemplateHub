const Footer = () => {
    return (
      <footer className="bg-gray-800 text-gray-300 py-10 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Subhan Templates. All rights reserved.</p>
          <p className="text-sm mt-2">Built with ❤️ using React + Tailwind</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  
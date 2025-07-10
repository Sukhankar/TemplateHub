const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-10 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-base font-medium">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
            DevCanvas
          </span>
          . All rights reserved.
        </p>
        <p className="text-sm mt-2 opacity-80">
          Built with <span className="text-red-500">❤️</span> using{" "}
          <span className="font-semibold text-blue-500 dark:text-blue-400">
            React
          </span>{" "}
          +
          <span className="font-semibold text-cyan-500 dark:text-cyan-400">
            {" "}
            Tailwind CSS
          </span>
        </p>

        <div className="mt-6 flex justify-center gap-6 text-xl">
          <a
            href="https://github.com/Sukhankar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://twitter.com"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="mailto:contact@devcanvas.com"
            className="hover:text-red-500 dark:hover:text-red-400 transition"
            aria-label="Email"
          >
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

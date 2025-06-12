const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
        
        {/* Left Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left" data-aos="fade-right">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Craft Stunning Websites with Ease
          </h1>
          <p className="text-lg mb-8 text-indigo-100">
            Discover premium HTML/CSS templates and get custom development — all under one roof.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <a
              href="/templates"
              className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
              data-aos="zoom-in"
            >
              Browse Templates
            </a>
            <a
              href="/services"
              className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-indigo-600 transition"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              Hire a Freelancer
            </a>
          </div>
        </div>

        {/* Right Hero Graphic */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end" data-aos="fade-left">
          <img
            src="/assets/hero-devcanvas.png"
            alt="DevCanvas hero graphic"
            className="w-full max-w-md rounded-lg shadow-2xl"
          />
        </div>
      </div>

      {/* Decorative SVG overlay for more visual depth */}
      <svg
        className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 opacity-30"
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="200" fill="white" />
      </svg>
    </section>
  );
};

export default HeroSection;

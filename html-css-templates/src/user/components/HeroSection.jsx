const HeroSection = () => {
    return (
      <section className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white py-24">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6" data-aos="fade-up">Premium HTML & CSS Templates</h1>
          <p className="text-lg mb-8" data-aos="fade-up" data-aos-delay="200">
            Clean, modern, and responsive templates built for developers, startups, and designers.
          </p>
          <a
            href="/templates"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
            data-aos="zoom-in" data-aos-delay="400"
          >
            Browse Templates
          </a>
        </div>
      </section>
    );
  };
  
  export default HeroSection;
import { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import { SendHorizonal } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      await axios.post("http://localhost:5000/api/contact", form);
<<<<<<< HEAD
      setStatus("✅ Message sent successfully!");
=======
      setStatus("Message sent successfully!");
>>>>>>> 143feb2afe79937a57602d99a94d5b41856189d7
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send message. Try again.");
    }
  };

  return (
<<<<<<< HEAD
    <>
      <Navbar />
      <section className="pt-28 px-4 pb-20 bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen">
        <div
          className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-10 border border-indigo-100"
          data-aos="fade-up"
        >
          <h1 className="text-4xl font-extrabold mb-4 text-center text-indigo-700">
            Contact Us
          </h1>
          <p className="text-gray-600 mb-8 text-center text-lg">
            Got a question, suggestion, or just want to say hi? Drop us a message below!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <Textarea
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
            />

            {status && (
              <p
                className={`text-center text-sm font-medium ${
                  status.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
=======
    <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Info Panel */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-8 sm:p-10 flex flex-col justify-between" data-aos="fade-right">
            <div>
              <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">Get in Touch</h2>
              <p className="text-sm opacity-90 mb-8" data-aos="fade-up" data-aos-delay="100">
                We'd love to hear from you! Whether you have a question about features, pricing, or anything else — our team is ready to help.
              </p>
            </div>
            <div className="mt-8 space-y-4 text-sm">
              <div data-aos="fade-up" data-aos-delay="200">
                <p className="font-semibold">Email:</p>
                <p>support@example.com</p>
              </div>
              <div data-aos="fade-up" data-aos-delay="300">
                <p className="font-semibold">Phone:</p>
                <p>+1 234 567 8900</p>
              </div>
              <div data-aos="fade-up" data-aos-delay="400">
                <p className="font-semibold">Address:</p>
                <p>123 Street Name, City, Country</p>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <form
            className="p-6 sm:p-8 md:p-10 bg-white space-y-6"
            onSubmit={handleSubmit}
            data-aos="fade-left"
          >
            <h2 className="text-2xl font-bold text-gray-800" data-aos="fade-up">Contact Us</h2>

            <div data-aos="fade-up" data-aos-delay="100">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="300">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                name="message"
                placeholder="Your message"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {status && (
              <p className="text-sm text-center text-gray-600" data-aos="fade-up" data-aos-delay="400">
>>>>>>> 143feb2afe79937a57602d99a94d5b41856189d7
                {status}
              </p>
            )}

            <button
              type="submit"
<<<<<<< HEAD
              className="group relative w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 hover:scale-[1.02] transition-all duration-300"
=======
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              data-aos="fade-up"
              data-aos-delay="500"
>>>>>>> 143feb2afe79937a57602d99a94d5b41856189d7
            >
              Send Message
              <SendHorizonal className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

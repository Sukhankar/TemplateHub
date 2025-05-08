import { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("Failed to send message. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="pt-28 pb-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto bg-gray-50 p-8 shadow-sm rounded-lg" data-aos="fade-up">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Contact Us</h1>
          <p className="text-gray-600 mb-6 text-center">
            Got a question, suggestion, or just want to say hi? Drop us a message below!
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Type your message..."
                className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            {status && <p className="text-sm text-center text-gray-600">{status}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;

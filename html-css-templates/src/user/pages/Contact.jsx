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
      setStatus("✅ Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send message. Try again.");
    }
  };

  return (
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
                {status}
              </p>
            )}

            <button
              type="submit"
              className="group relative w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 hover:scale-[1.02] transition-all duration-300"
            >
              Send Message
              <SendHorizonal className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </section>
      {/* <Footer /> */}
    </>
  );
};

export default Contact;

import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Loader from "../components/Loading";

const Profile = () => {
  const { user } = useAuth();
  const [downloadedTemplates, setDownloadedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        if (user?.user?.id) {
          const response = await fetch(`/api/users/${user.user.id}/downloads`);
          if (!response.ok) throw new Error("Failed to fetch downloads.");
          const data = await response.json();
          setDownloadedTemplates(data);
        }
      } catch (err) {
        console.error("Error fetching downloads:", err);
        setError("Unable to load downloads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [user]);

  if (loading) return <Loader />;

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="pt-28 min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
          <p className="text-lg text-gray-700">Please log in to view your profile.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 px-4 min-h-screen bg-gray-50">
        <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <header className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">👤 Profile</h2>
            <p className="text-gray-700"><strong>Name:</strong> {user?.name || "No name available"}</p>
            <p className="text-gray-700"><strong>Email:</strong> {user?.email || "No email available"}</p>
          </header>

          <section className="mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">📥 Downloads</h3>

            {error && (
              <p className="text-red-600 text-sm mb-3">{error}</p>
            )}

            {downloadedTemplates.length === 0 ? (
              <div className="text-center text-gray-500 border rounded p-6 bg-gray-100">
                <p>No templates downloaded yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {downloadedTemplates.map((template) => (
                  <li key={template._id} className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{template.title}</h4>
                      <p className="text-sm text-gray-500">{template.category}</p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to={`/template/${template._id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </Link>
                      <a
                        href={template.zipfile}
                        download
                        className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Profile;

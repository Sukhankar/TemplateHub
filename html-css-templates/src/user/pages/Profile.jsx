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

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        if (user?.user?.id) {
          const response = await fetch(`/api/users/${user.user.id}/downloads`);
          const data = await response.json();
          setDownloadedTemplates(data);
        }
      } catch (error) {
        console.error("Error fetching downloads:", error);
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
        <div className="pt-28 text-center min-h-screen">
          <p>Please log in to view your profile.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="pt-28 px-4 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
          <p><strong>Name:</strong> {user?.name || "No name available"}</p>
          <p><strong>Email:</strong> {user?.email || "No email available"}</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">📥 Downloads</h3>
          {downloadedTemplates.length === 0 ? (
            <p className="text-gray-500">No templates downloaded yet.</p>
          ) : (
            <ul className="space-y-4 mt-3">
              {downloadedTemplates.map((t) => (
                <li key={t._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="font-semibold">{t.title}</h4>
                    <p className="text-sm text-gray-500">{t.category}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/template/${t._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                    <a
                      href={t.zipfile}
                      download
                      className="bg-green-500 text-white text-sm px-3 py-1 rounded"
                    >
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Profile;

import React, { useState } from 'react';

const defaultAvatars = [
  'bg-gradient-to-br from-purple-200 to-blue-200',
  'bg-gradient-to-br from-pink-200 to-purple-200',
  'bg-gradient-to-br from-green-200 to-blue-200',
  'bg-gradient-to-br from-yellow-200 to-pink-200',
  'bg-gradient-to-br from-blue-300 to-pink-300',
  'bg-gradient-to-br from-green-200 to-white',
];

const ProfileSetup = () => {
  const [location, setLocation] = useState("Shirol, Maharashtra");
  const [selectedColor, setSelectedColor] = useState('');
  const [image, setImage] = useState(null);
  const [showAvatars, setShowAvatars] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setSelectedColor('');
    }
  };

  return (
    <main className="step-view-main min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="step-view-main-container w-full max-w-xl bg-white p-8 rounded-lg shadow-sm">
        <header className="step-view-header mb-6">
          <h1 className="step-view-header-title text-3xl font-bold text-gray-800">
            Welcome! Let's create your profile
          </h1>
          <p className="step-view-header-subtitle text-gray-600 mt-1">
            Let others get to know you better!
          </p>
        </header>

        <section className="step-view-content">
          <div className="avatar-upload mb-8">
            <label className="text-lg font-semibold text-gray-800 block mb-2">
              Add an avatar
            </label>

            <div className="avatar-upload-container flex items-center gap-4">
              <div className="avatar-upload-dropzone relative w-28 h-28 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                {image ? (
                  <img src={image} alt="avatar" className="w-full h-full object-cover" />
                ) : selectedColor ? (
                  <div className={`w-full h-full rounded-full ${selectedColor}`} />
                ) : (
                  <div className="drop-area-content text-gray-400 text-center">
                    <svg
                      className="mx-auto mb-1"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10l4.553-4.553a1 1 0 00-1.414-1.414L13.586 8.586a1 1 0 01-1.414 0L6.88 3.88A1 1 0 105.466 5.293L10.88 10.707a1 1 0 001.414 0z"
                      />
                    </svg>
                    <span className="text-xs">Drop your <br /> image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <div>
                <button
                  className="inline-block bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  onClick={() => document.querySelector('#fileInput')?.click()}
                >
                  Choose image
                </button>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="avatar-select mt-4">
                  <button
                    type="button"
                    className="avatar-select-trigger flex items-center text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => setShowAvatars(!showAvatars)}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <path d="M4.47 1.154a.814.814 0 00-1.149 0 .806.806 0 000 1.143l3.636 3.62-3.636 3.62a.806.806 0 000 1.143.814.814 0 001.148 0L8.667 6.5a.817.817 0 00.224-.381.806.806 0 00-.228-.79L4.47 1.155z"></path>
                    </svg>
                    Or choose one of our defaults
                  </button>

                  {showAvatars && (
                    <ul className="avatar-select-list flex gap-2 mt-2">
                      {defaultAvatars.map((color, index) => (
                        <li key={index}>
                          <div
                            className={`default-avatar-image w-8 h-8 rounded-full cursor-pointer border-2 border-white hover:scale-110 transition ${color}`}
                            onClick={() => {
                              setSelectedColor(color);
                              setImage(null);
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="location-input mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Add your location</h2>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border-b border-gray-200 focus:outline-none focus:border-gray-400 py-2 text-gray-700 bg-transparent"
            />
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Continue
          </button>
        </section>
      </div>
    </main>
  );
};

export default ProfileSetup;

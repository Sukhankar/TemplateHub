const BackButton = ({ navigate }) => (
    <button
      className="mb-4 text-blue-600 underline"
      onClick={() => navigate("/templates")}
    >
      ← Back to Templates
    </button>
  );
  
  export default BackButton;
  
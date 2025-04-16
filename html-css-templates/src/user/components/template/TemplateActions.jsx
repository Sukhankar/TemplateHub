const TemplateActions = ({
  user,
  template,
  handleAddToCart,
  handleBuyNow
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = template.zipfile;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    if (template.demoUrl) {
      window.open(template.demoUrl, "_blank");
    } else {
      alert("Demo URL not available.");
    }
  };

  return (
    <div className="flex gap-4 flex-wrap">
      {template.price === 0 ? (
        <button
          onClick={handleDownload}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
        >
          Download Free
        </button>
      ) : (
        <>
          <button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
          >
            Buy Now
          </button>
        </>
      )}
      <button
        onClick={handlePreview}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
      >
        Live Preview
      </button>
    </div>
  );
};

export default TemplateActions;

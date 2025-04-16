const LivePreview = ({ previewUrl, width, height }) => {
    if (!previewUrl) return null;
  
    return (
      <div className="mt-6 border rounded overflow-hidden">
        <iframe
          src={previewUrl}
          title="Template Preview"
          style={{
            width: `${width}px`,
            height: `${height}px`
          }}
        />
      </div>
    );
  };
  
  export default LivePreview;
  
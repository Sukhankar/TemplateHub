const ImageDisplay = ({ image, title, width, height }) => (
    <img
      src={image}
      alt={title}
      className="rounded-xl shadow-lg"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        objectFit: 'cover'
      }}
    />
  );
  
  export default ImageDisplay;
  
import React, { useState } from 'react';

const ImageCarousel = ({ photos }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleDotClick = (index) => {
    setCurrentPhotoIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="image-carousel">
      <button className="prev-button" title="poprzednie zdjęcie" onClick={handlePrevClick}>
        &lt;
      </button>
      <div className="carousel-container">
        <img className="carousel-image" src={photos[currentPhotoIndex].url} alt={photos[currentPhotoIndex].title} />
        <div className="dots-container">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              className={`dot ${index === currentPhotoIndex ? 'active' : ''}`}
              title='wybierz zdjęcie'
              onClick={() => handleDotClick(index)}
            ></button>
          ))}
        </div>
      </div>
      <button className="next-button" title='następne zdjęcie' onClick={handleNextClick}>
        &gt;
      </button>
    </div>
  );
};

export default ImageCarousel;
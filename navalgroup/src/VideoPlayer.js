import React, { useState, useRef } from 'react';
import './VideoPlayer.css';

// Fontion pour l'affichage des vidéos 
function VideoPlayer({ numVideos }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRefs = useRef(new Array(numVideos).fill(null).map(() => React.createRef()));

  const openPopup = (videoIndex) => {
    setSelectedVideo(videoIndex);
    setShowPopup(true);
  };

  const closePopup = () => {
    if (selectedVideo !== null) {
      videoRefs.current[selectedVideo].current.pause();
    }
    setShowPopup(false);
    setSelectedVideo(null);
  };

  return (
    <div>
      <div className="videos">
        <h2>Régie vidéo</h2>
        <div className="video-grid">
          {[...Array(numVideos).keys()].map((index) => (
            <div className="video-container" key={index}>
              <div className="zoomable-video">
                <video
                  ref={videoRefs.current[index]}
                  autoPlay
                  muted
                  loop
                  controls={false}
                  onMouseOver={(e) => e.target.controls = true}
                  onMouseOut={(e) => e.target.controls = false}
                  onClick={() => openPopup(index)}
                  width="300"
                >
                  <source src={`http://localhost:7001/video_${index + 1}.mp4`} type="video/mp4" />
                  Votre navigateur ne prend pas en charge la lecture de vidéos.
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="zoomable-video">
              <video
                ref={videoRefs.current[selectedVideo]}
                autoPlay
                controls={false}
                onClick={(e) => e.stopPropagation()}
              >
                <source src={`http://localhost:7001/video_${selectedVideo + 1}.mp4`} type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture de vidéos.
              </video>
            </div>
            <button onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}

      {showPopup && <div className="popup-overlay" onClick={closePopup} />}
    </div>
  );
}

export default VideoPlayer;

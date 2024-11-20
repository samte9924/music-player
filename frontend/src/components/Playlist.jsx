import { X } from "lucide-react";
import { useState } from "react";

export default function Playlist({ name, songs }) {
  const [showPlaylist, setShowPlaylist] = useState(false);

  return (
    <>
      <div onClick={() => setShowPlaylist(true)} className="playlist">
        <span className="name">{name}</span>
      </div>

      {showPlaylist && (
        <div onClick={() => setShowPlaylist(false)} className="backdrop">
          <div
            onClick={(e) => e.stopPropagation()}
            className="playlist-songs-container"
          >
            <button
              title="Close"
              onClick={() => setShowPlaylist(false)}
              className="close-playlist"
            >
              <X size={24} />
            </button>
            <h3>{name}</h3>
            {songs.map((song, index) => (
              <div key={index} className="playlist-song">
                {song}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

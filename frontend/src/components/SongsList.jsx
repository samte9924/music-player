import { Play } from "lucide-react";

export default function SongsList({ songs, handleSongChange }) {
  return (
    <div className="songs-container">
      {songs.map((song, index) => (
        <div key={index} title={song} className="song">
          <span>{song.length > 30 ? song.slice(0, 27) + "..." : song}</span>
          <button
            onClick={() => handleSongChange(song)}
            className="select-song-button"
          >
            <Play size={24} />
          </button>
        </div>
      ))}
    </div>
  );
}

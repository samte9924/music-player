import { Play, Plus } from "lucide-react";

export default function SongsList({ songs, handleSongChange, enqueue }) {
  return (
    <div className="songs-container">
      <h2>Songs List</h2>
      {songs.map((song, index) => (
        <div key={index} title={song} className="song">
          <span>
            {song.length > 30
              ? song.slice(0, 27) + "..."
              : song.replace(".mp3", "")}
          </span>
          <div className="actions-container">
            <button
              title="Play this song"
              onClick={() => handleSongChange(song)}
              className="select-song-button"
            >
              <Play size={24} />
            </button>
            <button
              title="Add to queue"
              onClick={() => enqueue(song)}
              className="add-to-queue-button"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

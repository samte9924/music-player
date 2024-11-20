import Song from "./Song";

export default function SongsList({ songs, setCurrentSong, setQueue }) {
  const handleSongChange = (newSong) => {
    setCurrentSong(newSong);
  };

  const enqueue = (song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
  };

  return (
    <div className="songs-container">
      <h2>Songs List</h2>
      {songs.map((song, index) => (
        <Song
          key={index}
          song={song}
          handleSongChange={handleSongChange}
          enqueue={enqueue}
        />
      ))}
    </div>
  );
}

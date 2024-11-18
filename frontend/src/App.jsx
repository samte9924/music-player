import { useEffect, useState } from "react";
import SongsList from "./components/SongsList";
import PlayingSong from "./components/PlayingSong";
import "./App.css";
import { Queue } from "./utils/Queue";
import { Minus } from "lucide-react";

function App() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [queue, setQueue] = useState(new Queue());

  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/songs/");
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        setSongs(data.songs);
      } catch (error) {
        console.error(error);
        setError("Error fetching songs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleSongChange = (newSong) => {
    setCurrentSong(newSong);
  };

  const enqueue = (song) => {
    const updatedQueue = new Queue(queue.songs);
    updatedQueue.enqueue(song);
    setQueue(updatedQueue);
  };

  const dequeue = () => {
    const updatedQueue = new Queue(queue.songs);
    const nextSong = updatedQueue.dequeue();
    setQueue(updatedQueue);
    return nextSong;
  };

  const dequeueIndex = (index) => {
    const updatedQueue = new Queue(queue.songs);
    updatedQueue.dequeueIndex(index);
    setQueue(updatedQueue);
  };

  if (error) return <div>{error}</div>;
  if (isLoading) return <div>Loading</div>;

  return (
    <>
      <SongsList
        songs={songs}
        handleSongChange={handleSongChange}
        enqueue={enqueue}
      />
      <hr />
      <div className="queue">
        <h2>Songs queue</h2>
        {queue.songs.map((song, index) => (
          <div key={index} className="song">
            <span>
              {song.length > 30
                ? song.slice(0, 27) + "..."
                : song.replace(".mp3", "")}
            </span>
            <button
              title="Remove from queue"
              onClick={() => dequeueIndex(index)}
              className="remove-from-queue-button"
            >
              <Minus size={24} />
            </button>
          </div>
        ))}
      </div>
      <hr />
      <PlayingSong currentSong={currentSong} />
    </>
  );
}

export default App;

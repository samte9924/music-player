import { useEffect, useState } from "react";
import SongsList from "./components/SongsList";
import PlayingSong from "./components/PlayingSong";
import "./App.css";
import Queue from "./components/Queue";

function App() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [queue, setQueue] = useState([]);

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

  const handleSongEnded = () => {
    if (queue.length === 0) {
      setCurrentSong(null);
    } else {
      const nextSong = dequeue();
      setCurrentSong(nextSong);
    }
  };

  const enqueue = (song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
  };

  const dequeue = () => {
    setQueue((prevQueue) => prevQueue.slice(1));
    return queue[0];
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
      <Queue
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        queue={queue}
        setQueue={setQueue}
      />
      <hr />
      <PlayingSong
        currentSong={currentSong}
        handleSongEnded={handleSongEnded}
      />
    </>
  );
}

export default App;

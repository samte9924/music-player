import React, { useEffect, useState } from "react";
import SongsList from "./components/SongsList";
import PlayingSong from "./components/PlayingSong";
import { Minus, Play, Shuffle, Trash2 } from "lucide-react";
import "./App.css";

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
    enqueue(newSong);
    setCurrentSong(newSong);
  };

  const handleSongEnded = () => {
    if (queue.length === 0) {
      setCurrentSong(null);
    } else {
      let nextSong = dequeue();
      setCurrentSong(nextSong);
    }
  };

  const enqueue = (song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
  };

  const dequeue = () => {
    setQueue((prevQueue) => prevQueue.slice(1));
    return queue(0);
  };

  const dequeueIndex = (index) => {
    setQueue((prevQueue) => prevQueue.filter((_, i) => i !== index));
  };

  const shuffleQueue = () => {
    setQueue((prevQueue) => [...prevQueue].sort(() => Math.random() - 0.5));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const playNowFromQueue = (index) => {
    setQueue((prevQueue) => [...prevQueue].slice(index + 1));
    setCurrentSong(queue[index]);
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
        <div className="header">
          <h2>Songs queue</h2>
          <div className="actions-container">
            <button
              title="Shuffle queue"
              onClick={shuffleQueue}
              className="suffle-button"
              disabled={queue.length <= 1}
            >
              <Shuffle size={24} />
            </button>
            <button
              title="Clear queue"
              onClick={clearQueue}
              className="clear-queue-button"
              disabled={queue.length === 0}
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>
        <h3>Listening to</h3>
        <p>{currentSong || "-"}</p>
        <h3>Next up</h3>
        {queue.length === 0 ? (
          <i>Queue is empty</i>
        ) : (
          queue.map((song, index) => (
            <React.Fragment key={index}>
              <div className="song">
                <span>
                  {song.length > 30
                    ? song.slice(0, 27) + "..."
                    : song.replace(".mp3", "")}
                </span>
                <div className="actions-container">
                  <button
                    title="Play now"
                    onClick={() => playNowFromQueue(index)}
                    className="play-now-button"
                  >
                    <Play size={24} />
                  </button>
                  <button
                    title="Remove from queue"
                    onClick={() => dequeueIndex(index)}
                    className="remove-from-queue-button"
                  >
                    <Minus size={24} />
                  </button>
                </div>
              </div>
            </React.Fragment>
          ))
        )}
      </div>
      <hr />
      <PlayingSong
        currentSong={currentSong}
        handleSongEnded={handleSongEnded}
      />
    </>
  );
}

export default App;

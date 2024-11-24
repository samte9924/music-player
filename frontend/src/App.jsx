import { useEffect, useState } from "react";
import SongsList from "./components/SongsList";
import PlayingSong from "./components/PlayingSong";
import Queue from "./components/Queue";
import "./App.css";
import Playlist from "./components/Playlist";
import { Plus } from "lucide-react";

function App() {
  const [playlists, setPlaylists] = useState(["Playlist 1", "Playlist 2"]);
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

  if (error) return <div>{error}</div>;
  if (isLoading) return <div>Loading</div>;

  return (
    <>
      <SongsList
        songs={songs}
        setCurrentSong={setCurrentSong}
        setQueue={setQueue}
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
        setCurrentSong={setCurrentSong}
        queue={queue}
        setQueue={setQueue}
      />
      <div className="playlists-header">
        <h2>Playlists</h2>
        <button>
          <Plus size={24} />
        </button>
      </div>
      <div className="playlists-container">
        {playlists.map((playlist, index) => (
          <Playlist key={index} name={playlist} songs={["Song 1", "Song 2"]} />
        ))}
      </div>
      <hr />
    </>
  );
}

export default App;

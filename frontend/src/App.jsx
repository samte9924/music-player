import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import "./App.css";

function App() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [sliderMax, setSliderMax] = useState(100);
  const [bufferedAmount, setBufferedAmount] = useState(100);
  const [seekableAmount, setSeekableAmount] = useState(100);

  const songRef = useRef(null);

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

  useEffect(() => {
    const handleMetadataLoaded = () => {
      setDuration(calculateTime(song.duration));
      setSliderMax(Math.floor(song.duration));
    };

    const handleProgress = () => {
      if (song.buffered.length > 0) {
        setBufferedAmount(song.buffered.end(song.buffered.length - 1));
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(calculateTime(song.currentTime));
    };

    const song = songRef.current;
    if (song) {
      song.addEventListener("loadedmetadata", handleMetadataLoaded);
      song.addEventListener("progress", handleProgress);
      song.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (song) {
        song.addEventListener("loadedmetadata", handleMetadataLoaded);
        song.addEventListener("progress", handleProgress);
        song.addEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  const calculateTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    const fixedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutes}:${fixedSeconds}`;
  };

  if (error) return <div>{error}</div>;

  if (isLoading) return <div>Loading</div>;

  return (
    <>
      <div className="songs-container">
        {songs.map((song, index) => (
          <div key={index} title={song} className="song">
            <span>{song.length > 30 ? song.slice(0, 27) + "..." : song}</span>
            <button className="select-song-button">
              <Play size={24} />
            </button>
          </div>
        ))}
      </div>
      <hr />
      <div className="playing-song">
        <span className="song-name">Now playing - Song 1</span>
        <div className="progress-container">
          <button className="restart-song-button">
            <RotateCw className="icon" />
          </button>
          <span className="current-time time">{currentTime}</span>
          {/* To-do: make custom slider with buffer color */}
          <input
            type="range"
            max={sliderMax}
            value={Math.floor(songRef.current?.currentTime || 0)}
            onChange={(e) => {
              const updatedTime = e.target.value;
              songRef.current.currentTime = updatedTime;
              setCurrentTime(calculateTime(updatedTime));
            }}
            className="song-progress"
          />
          <span className="duration time">{duration}</span>
          <button>
            <Volume2 className="icon" />
          </button>
        </div>
        <div className="controls">
          <button className="skip-back-button">
            <SkipBack className="icon" />
          </button>
          <button className="pause-button">
            <Pause className="icon" />
          </button>
          <button className="skip-forward-button">
            <SkipForward className="icon" />
          </button>
        </div>
      </div>
      <hr />
      <audio
        ref={songRef}
        src={`http://localhost:3000/songs/Far Out - Origin.mp3`}
        preload="metadata"
      ></audio>
    </>
  );
}

export default App;

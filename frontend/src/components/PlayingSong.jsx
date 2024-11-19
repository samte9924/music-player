import { useRef, useState } from "react";
import {
  Pause,
  Play,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeOff,
} from "lucide-react";

export default function PlayingSong({ currentSong, handleSongEnded }) {
  const [currentTime, setCurrentTime] = useState("--:--");
  const [duration, setDuration] = useState("--:--");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [sliderMax, setSliderMax] = useState(100);
  const [bufferedAmount, setBufferedAmount] = useState(100);

  const songRef = useRef(null);

  const calculateTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    const fixedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutes}:${fixedSeconds}`;
  };
  const handleMetadataLoaded = () => {
    setDuration(calculateTime(songRef.current.duration));
    setSliderMax(Math.floor(songRef.current.duration));
  };

  const handleProgress = () => {
    if (songRef.current.buffered.length > 0) {
      setBufferedAmount(
        songRef.current.buffered.end(songRef.current.buffered.length - 1)
      );
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(calculateTime(songRef.current.currentTime));
  };

  const handleCanPlay = () => {
    setIsPlaying(true);
    songRef.current
      .play()
      .catch((err) => console.error("Playback failed: ", err));
  };

  const handlePause = () => {
    const song = songRef.current;

    if (song && currentSong) {
      setIsPlaying((prev) => !prev);
      if (!isPlaying && song.paused) {
        song.play().catch((err) => console.error("Playback failed: ", err));
      } else {
        song.pause();
      }
    }
  };

  const restartSong = () => {
    if (songRef.current) {
      songRef.current.currentTime = 0;
    }
  };

  const handleMute = () => {
    const song = songRef.current;

    if (song && currentSong) {
      setIsMuted((prev) => !prev);
      if (!isMuted && song.volume > 0) {
        song.volume = 0;
      } else {
        song.volume = 1;
      }
    }
  };
  return (
    <>
      <div className="playing-song">
        <span className="song-name">
          {currentSong
            ? `Now playing - ${currentSong.replace(".mp4", "")}`
            : "No song selected"}
        </span>
        <div className="progress-container">
          <button
            onClick={restartSong}
            disabled={!currentSong}
            className="restart-song-button"
          >
            <RotateCw className="icon" />
          </button>
          <span className="current-time time">
            {currentSong ? currentTime : "--:--"}
          </span>
          <input
            type="range"
            max={sliderMax}
            value={Math.floor(songRef.current?.currentTime || 0)}
            onChange={(e) => {
              const updatedTime = e.target.value;
              //console.log(updatedTime);
              songRef.current.currentTime = updatedTime;
              setCurrentTime(calculateTime(updatedTime));
            }}
            disabled={!currentSong}
            className="song-progress"
          />
          <span className="duration time">
            {currentSong ? duration : "--:--"}
          </span>
          <button onClick={handleMute} disabled={!currentSong}>
            {isMuted ? (
              <VolumeOff className="icon" />
            ) : (
              <Volume2 className="icon" />
            )}
          </button>
        </div>
        <div className="controls">
          <button disabled={!currentSong} className="skip-back-button">
            <SkipBack className="icon" />
          </button>
          <button
            onClick={handlePause}
            disabled={!currentSong}
            className="pause-button"
          >
            {isPlaying ? <Pause className="icon" /> : <Play className="icon" />}
          </button>
          <button
            disabled={!currentSong}
            onClick={handleSongEnded}
            className="skip-forward-button"
          >
            <SkipForward className="icon" />
          </button>
        </div>
      </div>
      <audio
        ref={songRef}
        src={`http://localhost:3000/songs/${currentSong}`}
        preload="metadata"
        onLoadedMetadata={handleMetadataLoaded}
        onProgress={handleProgress}
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={handleCanPlay}
        onEnded={handleSongEnded}
      ></audio>
    </>
  );
}

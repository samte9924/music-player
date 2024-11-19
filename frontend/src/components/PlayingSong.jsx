import { useRef, useState } from "react";
import {
  Pause,
  Play,
  RotateCw,
  SkipBack,
  SkipForward,
  Star,
  Volume,
  Volume1,
  Volume2,
  VolumeOff,
} from "lucide-react";

export default function PlayingSong({ currentSong, handleSongEnded }) {
  const [currentTime, setCurrentTime] = useState("--:--");
  const [duration, setDuration] = useState("--:--");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

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
    songRef.current.volume = volume;
    songRef.current
      .play()
      .catch((err) => console.error("Playback failed: ", err));
    setIsPlaying(true);
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
    if (songRef.current && currentSong) {
      songRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange = (e) => {
    const song = songRef.current;
    const newVolume = parseFloat(e.target.value);
    if (song && currentSong) {
      if (!song.muted) {
        song.volume = newVolume;
      }
      setVolume(newVolume);
    }
  };

  const handleMute = () => {
    const song = songRef.current;

    if (song && currentSong) {
      song.muted = !song.muted;
      setIsMuted(song.muted);
      if (!song.muted) {
        song.volume = volume;
      }
    }
  };

  const handleSkipBack = () => {};

  const handleAddToFavourites = () => {
    console.log(currentSong);
  };

  return (
    <>
      <div className="playing-song">
        <div className="song-name">
          <span>
            {currentSong
              ? `${
                  currentSong.length > 33
                    ? currentSong.slice(0, 30) + "..."
                    : currentSong.replace(".mp3", "")
                }`
              : "No song selected"}
          </span>
        </div>
        <div className="main-container">
          <div className="controls-container">
            <button
              title="Add to favourites"
              onClick={handleAddToFavourites}
              className="add-to-favourites-button"
              disabled={!currentSong}
            >
              <Star size={24} />
            </button>
            <button
              title="Previous"
              onClick={handleSkipBack}
              className="skip-back-button"
              disabled={!currentSong}
            >
              <SkipBack className="icon" />
            </button>
            <button
              title={isPlaying ? "Pause" : "Play"}
              onClick={handlePause}
              className="pause-button"
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="icon" />
              ) : (
                <Play className="icon" />
              )}
            </button>
            <button
              title="Next"
              onClick={handleSongEnded}
              className="skip-forward-button"
              disabled={!currentSong}
            >
              <SkipForward className="icon" />
            </button>
            <button
              title="Play again"
              onClick={restartSong}
              className="restart-song-button"
              disabled={!currentSong}
            >
              <RotateCw className="icon" />
            </button>
          </div>
          <div className="progress-container">
            <span className="current-time time">
              {currentSong ? currentTime : "--:--"}
            </span>
            <input
              type="range"
              max={sliderMax}
              value={Math.floor(songRef.current?.currentTime || 0)}
              onChange={(e) => {
                if (songRef.current) {
                  const updatedTime = e.target.value;
                  songRef.current.currentTime = updatedTime;
                  setCurrentTime(calculateTime(updatedTime));
                }
              }}
              disabled={!currentSong}
              className="song-progress"
            />
            <span className="duration time">
              {currentSong ? duration : "--:--"}
            </span>
          </div>
        </div>
        <div className="volume-container">
          <button
            title={isMuted ? "Unmute" : "Mute"}
            onClick={handleMute}
            className="mute-button"
            disabled={!currentSong}
          >
            {isMuted ? (
              <VolumeOff className="icon" />
            ) : volume === 0 ? (
              <Volume className="icon" />
            ) : volume <= 0.5 ? (
              <Volume1 className="icon" />
            ) : (
              <Volume2 className="icon" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            disabled={!currentSong}
            className="song-volume"
          />
        </div>
      </div>
      {currentSong && (
        <audio
          ref={songRef}
          src={`http://localhost:3000/songs/${currentSong}`}
          preload="metadata"
          onLoadedMetadata={handleMetadataLoaded}
          onProgress={handleProgress}
          onTimeUpdate={handleTimeUpdate}
          onCanPlay={handleCanPlay}
          onEnded={handleSongEnded}
          onError={(e) => console.error(e)}
        ></audio>
      )}
    </>
  );
}

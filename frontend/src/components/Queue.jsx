import { Minus, Play, Shuffle, Trash2 } from "lucide-react";
import React from "react";

export default function Queue({
  currentSong,
  queue,
  dequeueIndex,
  playNowFromQueue,
  clearQueue,
  shuffleQueue,
}) {
  return (
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
      <div className="current-song">{currentSong || "-"}</div>
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
  );
}

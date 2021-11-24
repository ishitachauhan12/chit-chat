import { CircularProgress } from "@material-ui/core";
import { PauseRounded, PlayArrowRounded } from "@material-ui/icons";
import React from "react";
import "./AudioPlayer.css";

export default function AudioPlayer({
  sender,
  audioUrl,
  id,
  setAudioId,
  audioId,
}) {
  const [isPlaying, setPlaying] = React.useState(false);
  const [isMediaLoaded, setMediaLoaded] = React.useState(false);
  const [isLoaded, setLoaded] = React.useState(false);
  const [isMetadataLoaded, setMetadataLoaded] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [duration, setDuration] = React.useState("");

  const totalDuration = React.useRef("");
  const audio = React.useRef(new Audio(audioUrl));
  const interval = React.useRef();
  const isUploading = React.useRef(audioUrl === "uploading");

  React.useEffect(() => {
    if (isUploading.current && audioUrl !== "uploading") {
      audio.current = new Audio(audioUrl);
      audio.current.load();
      setLoaded(true);
    } else if (isUploading.current === false) {
      setLoaded(true);
    }
  }, [audioUrl]);

  function getAudioDuration(media) {
    return new Promise((resolve) => {
      media.onLoadedmetadata = () => {
        media.currentTime = Number.MAX_SAFE_INTEGER;

        media.ontimeupdate = () => {
          media.ontimeupdate = () => {};

          media.currentTime = 0.1;
          resolve(media.duration);
        };
      };
    });
  }

  React.useEffect(() => {
    if (isLoaded) {
      getAudioDuration(audio.current).then(() => {
        setMetadataLoaded(true);
      });
    }
  }, [isLoaded]);

  React.useEffect(() => {
    if (isMetadataLoaded) {
      audio.current.addEventListener("canplaythrough", () => {
        if (!totalDuration.current) {
          setMediaLoaded(true);
          const time = formatTime(audio.current.duration);
          totalDuration.current = time;
          setDuration(totalDuration.current);
          
        }
      });
      audio.current.addEventListener("ended", () => {
        clearInterval(interval.current);
        setDuration(totalDuration.current);
        setSliderValue(0);
        setPlaying(false);
      });
    }
  }, [isMetadataLoaded]);

  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    console.log("duration",`${minutes}:${seconds}`)
    return `${minutes}:${seconds}`;
  }

  return (
    <>
      <div className={`audioplayer ${sender ? "" : "audioplayer__alt"}`}>
        {!isMediaLoaded ? (
          <CircularProgress />
        ) : isPlaying ? (
          <PauseRounded className="pause" />
        ) : !isPlaying ? (
          <PlayArrowRounded />
        ) : null}

        <div>
          <span
            style={{ width: `${sliderValue}%` }}
            className="audioplayer__slider--played"
          />
          <input
            type="range"
            min="1"
            max="100"
            value={sliderValue}
            className="audioplayer__slider"
            readOnly
          />
        </div>
      </div>
      <span className="chat__timestamp audioplayer__time">{duration}</span>
    </>
  );
}

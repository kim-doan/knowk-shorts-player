import setScreenHeight from "@/core/utils/setScreenHeight";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import { styled } from "styled-components";

const ReactPlayerComponent = dynamic(() => import("react-player/lazy"), {
  ssr: false,
});

const Home = () => {
  const router = useRouter();

  const [player, setPlayer] = useState<ReactPlayer | null>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    setScreenHeight();

    window.addEventListener("resize", setScreenHeight);
    return () => window.removeEventListener("resize", setScreenHeight);
  }, []);

  useEffect(() => {
    window.play = (play: boolean) => {
      setPlaying(play);
      console.log(`play: ${play}`);
    };
    window.mute = (mute: boolean) => {
      setMuted(mute);
      console.log(`mute: ${mute}`);
    };
    window.seekTo = (time: number, type?: "seconds" | "fraction") => {
      player?.seekTo(time, type);
    };
    window.getCurrentTime = () => player.getCurrentTime();
  }, [player]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!player || !playing || error) return;

      const userAgent = navigator.userAgent.toLowerCase();

      if (userAgent.indexOf("android") > -1) {
        window.AndroidBridge.progressTime(player.getCurrentTime());
      } else if (
        userAgent.indexOf("iphone") > -1 ||
        userAgent.indexOf("ipad") > -1
      ) {
        window.webkit.messageHandlers.progressTime.postMessage(
          player.getCurrentTime()
        );
      }
    }, 100);

    return () => clearInterval(timer);
  }, [player, playing]);

  const videoUrl = router.query.url as string;

  const handleReady = (player: ReactPlayer) => {
    try {
      setPlayer(player);
      const userAgent = navigator.userAgent.toLowerCase();

      const preparedVideoParam = JSON.stringify({
        result: ReactPlayer.canPlay(videoUrl),
        duration: player.getDuration(),
      });

      if (userAgent.indexOf("android") > -1) {
        window.AndroidBridge.preparedVideo(preparedVideoParam);
      } else if (
        userAgent.indexOf("iphone") > -1 ||
        userAgent.indexOf("ipad") > -1
      ) {
        window.webkit.messageHandlers.preparedVideo.postMessage(
          preparedVideoParam
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlay = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("android") > -1) {
      window.AndroidBridge.changedStatus("onPlay");
    } else if (
      userAgent.indexOf("iphone") > -1 ||
      userAgent.indexOf("ipad") > -1
    ) {
      window.webkit.messageHandlers.changedStatus.postMessage("onPlay");
    }
  };

  const handlePause = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("android") > -1) {
      window.AndroidBridge.changedStatus("onPause");
    } else if (
      userAgent.indexOf("iphone") > -1 ||
      userAgent.indexOf("ipad") > -1
    ) {
      window.webkit.messageHandlers.changedStatus.postMessage("onPause");
    }
  };

  const handleStart = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("android") > -1) {
      window.AndroidBridge.changedStatus("onStart");
    } else if (
      userAgent.indexOf("iphone") > -1 ||
      userAgent.indexOf("ipad") > -1
    ) {
      window.webkit.messageHandlers.changedStatus.postMessage("onStart");
    }
  };

  const handleProgress = (state: OnProgressProps) => {
    try {
      setPlayer(player);
      setPlayed(state.played);

      const userAgent = navigator.userAgent.toLowerCase();

      if (userAgent.indexOf("android") > -1) {
        window.AndroidBridge.seek(JSON.stringify(state));
      } else if (
        userAgent.indexOf("iphone") > -1 ||
        userAgent.indexOf("ipad") > -1
      ) {
        window.webkit.messageHandlers.seek.postMessage(JSON.stringify(state));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleError = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("android") > -1) {
      window.AndroidBridge.changedStatus("onError");
    } else if (
      userAgent.indexOf("iphone") > -1 ||
      userAgent.indexOf("ipad") > -1
    ) {
      window.webkit.messageHandlers.changedStatus.postMessage("onError");
    }

    setError(true);
  };

  const handleBuffer = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("android") > -1) {
      window.AndroidBridge.changedStatus("onBuffer");
    } else if (
      userAgent.indexOf("iphone") > -1 ||
      userAgent.indexOf("ipad") > -1
    ) {
      window.webkit.messageHandlers.changedStatus.postMessage("onBuffer");
    }
  };

  const handleBufferEnd = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("android") > -1) {
      window.AndroidBridge.changedStatus("onBufferEnd");
    } else if (
      userAgent.indexOf("iphone") > -1 ||
      userAgent.indexOf("ipad") > -1
    ) {
      window.webkit.messageHandlers.changedStatus.postMessage("onBufferEnd");
    }
  };

  return (
    <Wrapper>
      <ReactPlayerComponent
        url={videoUrl}
        width="100%"
        height="100%"
        muted={muted}
        controls={false}
        playing={playing}
        playsinline
        volume={0.5}
        loop={true}
        onReady={handleReady}
        onPlay={handlePlay}
        onStart={handleStart}
        onPause={handlePause}
        onError={handleError}
        onProgress={handleProgress}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
      />
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;

  .video-stream {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

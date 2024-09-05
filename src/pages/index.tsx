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

  useEffect(() => {
    window.play = (play: boolean) => setPlaying(play);
    window.mute = (mute: boolean) => setMuted(mute);
    window.seekTo = (time: number) => {
      player?.seekTo(time);
    };
  }, [player]);

  useEffect(() => {
    setScreenHeight();

    window.addEventListener("resize", setScreenHeight);
    return () => window.removeEventListener("resize", setScreenHeight);
  }, []);

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

  const handleProgress = (state: OnProgressProps) => {
    try {
      if (state.played > 0.9) {
        player.seekTo(0);
        setTimeout(() => {
          setPlaying(true);
        }, 100);
      }

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
        onProgress={handleProgress}
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
`;

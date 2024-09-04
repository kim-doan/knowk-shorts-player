import setScreenHeight from "@/core/utils/setScreenHeight";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
});

const Home = () => {
  const router = useRouter();

  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // @ts-ignore
    window.shortsPlay = (play: boolean) => {
      setIsPlaying(play);
    };
  }, []);

  useEffect(() => {
    setScreenHeight();

    window.addEventListener("resize", setScreenHeight);
    return () => window.removeEventListener("resize", setScreenHeight);
  }, []);

  const videoUrl = router.query.url;

  return (
    <Wrapper>
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        muted={muted}
        controls={false}
        playing={isPlaying}
        playsinline
        pip={false}
        volume={0.5}
        loop
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

const TestBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: red;
`;

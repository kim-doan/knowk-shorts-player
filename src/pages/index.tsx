import setScreenHeight from "@/core/utils/setScreenHeight";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
});

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    setScreenHeight();

    window.addEventListener("resize", setScreenHeight);
    return () => window.removeEventListener("resize", setScreenHeight);
  }, []);

  const videoUrl = router.query.videoUrl;

  return (
    <Wrapper>
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        controls={true}
        playing={true}
        pip={false}
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

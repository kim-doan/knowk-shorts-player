declare global {
  interface Window {
    webkit: webkit;
    AndroidBridge: AndroidBridge;
    play: (play: boolean) => void;
    mute: (mute: boolean) => void;
    seekTo: (time: number, type?: "seconds" | "fraction") => void;
    getCurrentTime: () => number;
  }

  interface webkit {
    messageHandlers: MessageHandlers;
  }

  interface MessageHandlers {
    preparedVideo: {
      postMessage: (state: string) => void;
    };
    seek: {
      postMessage: (state: string) => void;
    };
    progressTime: {
      postMessage: (currentTime: number) => void;
    };
    changedStatus: {
      postMessage: (
        state:
          | "onPlay"
          | "onStart"
          | "onPause"
          | "onError"
          | "onBuffer"
          | "onBufferEnd"
      ) => void;
    };
  }

  interface AndroidBridge {
    preparedVideo: (state: string) => void;
    seek: (state: string) => void;
    progressTime: (currentTime: number) => void;
    changedStatus: (
      state:
        | "onPlay"
        | "onStart"
        | "onPause"
        | "onError"
        | "onBuffer"
        | "onBufferEnd"
    ) => void;
  }

  interface PreparedVideoState {
    result: boolean;
    duration: number;
  }

  interface SeekState {
    loaded: number;
    loadedSeconds: number;
    played: number;
    playedSeconds: number;
  }
}

export default global;

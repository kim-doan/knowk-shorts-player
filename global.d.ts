declare global {
  interface Window {
    webkit: webkit;
    AndroidBridge: AndroidBridge;
    play: (play: boolean) => void;
    mute: (mute: boolean) => void;
    seekTo: (time: number) => void;
  }

  interface webkit {
    messageHandlers: MessageHandlers;
  }

  interface MessageHandlers {
    preparedVideo: {
      postMessage: (state: PreparedVideoState) => void;
    };
    seek: {
      postMessage: (state: SeekState) => void;
    };
  }

  interface AndroidBridge {
    preparedVideo: (state: PreparedVideoState) => void;
    seek: (state: SeekState) => void;
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

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
      postMessage: (state: string) => void;
    };
    seek: {
      postMessage: (state: string) => void;
    };
  }

  interface AndroidBridge {
    preparedVideo: (state: string) => void;
    seek: (state: string) => void;
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

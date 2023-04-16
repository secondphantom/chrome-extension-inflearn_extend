import { Utils } from "../../util/utils";

export class CourseService {
  static instance: CourseService | undefined;

  private playerNodeObserver: MutationObserver;
  private isEnabled = {
    autoSkip: false,
  };

  private url = {
    autoSkipHandler: "",
  };

  constructor() {
    this.playerNodeObserver = this.initPlayerNodeObserver();
  }

  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new CourseService();
    return this.instance;
  };

  private initPlayerNodeObserver = () => {
    const playerNodeObserver = new MutationObserver(() => {
      if (!this.isEnabled.autoSkip) return;
      document
        .querySelector('[data-testid="video-overlay"]')
        ?.querySelectorAll("button")
        .forEach((ele) => {
          if (ele.innerText === "다음 수업보기") {
            ele.click();
          }
        });
    });
    return playerNodeObserver;
  };

  setPlayerNodeObserver = () => {
    const observerOptions = {
      childList: true,
    };
    const videoEle = document.querySelector("video");
    if (!videoEle) return;
    const targetNode = videoEle.parentElement;
    this.playerNodeObserver.observe(targetNode!, observerOptions);
  };

  autoSkipHandler = ({
    id,
    isEnabled,
    url,
  }: {
    id: string;
    isEnabled: boolean;
    url?: string;
  }) => {
    if (this.url.autoSkipHandler !== url) {
      this.url.autoSkipHandler = url!;
      if (this.playerNodeObserver) {
        this.playerNodeObserver.disconnect();
      }
      setTimeout(() => {
        this.setPlayerNodeObserver();
      }, 500);
    }

    Utils.setStorage(id, isEnabled);

    this.isEnabled.autoSkip = isEnabled;
    return { isEnabled: this.isEnabled.autoSkip };
  };

  speedHandler = ({
    isUp,
    videoEle,
  }: {
    isUp: boolean;
    videoEle: HTMLVideoElement;
  }) => {
    let playbackRate = videoEle.playbackRate;
    playbackRate = Math.floor(playbackRate / 0.25) * 0.25;
    if (isUp) {
      const result = playbackRate + 0.25 > 5 ? 5 : playbackRate + 0.25;
      videoEle.playbackRate = result;
      return {
        playbackRate: result,
      };
    }
    const result = playbackRate - 0.25 < 0.5 ? 0.5 : playbackRate - 0.25;
    videoEle.playbackRate = result;
    return {
      playbackRate: result,
    };
  };
}

import { CourseRepo } from "../interface/course.repo";

export class CourseService {
  static instance: CourseService | undefined;

  private playerNodeObserver: MutationObserver;
  private isEnabled = {
    autoSkip: false,
  };

  private url = {
    autoSkipHandler: "",
  };

  constructor(private courseRepo: CourseRepo) {
    this.playerNodeObserver = this.initPlayerNodeObserver();
  }

  static getInstance = (courseRepo: CourseRepo) => {
    if (this.instance) return this.instance;
    this.instance = new CourseService(courseRepo);
    return this.instance;
  };

  private initPlayerNodeObserver = () => {
    const playerNodeObserver = new MutationObserver(() => {
      if (!this.isEnabled.autoSkip) return;
      document
        .querySelector(".mantine-Modal-root")
        ?.querySelectorAll("button")
        .forEach((ele) => {
          if (
            ele.innerText === "다음 수업보기" ||
            ele.innerText === "다음 수업"
          ) {
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
    const targetNode = document.querySelector(".mantine-Modal-root");
    if (!targetNode) return;
    this.playerNodeObserver.observe(targetNode!, observerOptions);
  };

  initAutoSkip = async ({
    button,
    url,
  }: {
    button: HTMLButtonElement;
    url: string;
  }) => {
    const id = button.getAttribute("id")!;
    const isEnabled = await this.courseRepo.getAutoSkipIsEnabled(id);
    if (this.url.autoSkipHandler !== url) {
      this.url.autoSkipHandler = url!;
      if (this.playerNodeObserver) {
        this.playerNodeObserver.disconnect();
      }
      setTimeout(() => {
        this.setPlayerNodeObserver();
      }, 500);
    }
    this.isEnabled.autoSkip = isEnabled;
    this.setAutoSkipStyle({ button, isEnabled });
  };

  setAutoSkipStyle = ({
    button,
    isEnabled,
  }: {
    button: HTMLButtonElement;
    isEnabled: boolean;
  }) => {
    if (isEnabled) {
      button.style.color = "white";
      button.style.backgroundColor = "rgb(0, 196, 113)";
      button.innerText = "자동 재생중";
      button.setAttribute("data-button", "true");
    } else {
      button.style.color = "rgb(0, 196, 113)";
      button.style.backgroundColor = "transparent";
      button.innerText = "자동 재생";
      button.setAttribute("data-button", "false");
    }
  };

  autoSkipHandler = ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
    this.courseRepo.setAutoSkipIsEnabled(id, isEnabled);

    this.isEnabled.autoSkip = isEnabled;
    return { isEnabled: this.isEnabled.autoSkip };
  };

  initSpeed = async ({
    controller,
    videoEle,
  }: {
    controller: HTMLDivElement;
    videoEle: HTMLVideoElement | null;
  }) => {
    if (videoEle === null) return;
    const id = controller.id;
    let playbackRate = await this.courseRepo.getVideoSpeed(id);
    if (playbackRate === null) {
      playbackRate = videoEle.playbackRate;
      this.courseRepo.setVideoSpeed(id, playbackRate);
    }
    videoEle.playbackRate = playbackRate;
    this.setSpeedDiv({ controller, playbackRate });
  };

  setSpeedDiv = ({
    controller,
    playbackRate,
  }: {
    controller: HTMLDivElement;
    playbackRate: number;
  }) => {
    const speedDiv = controller.querySelector("div");
    if (!speedDiv) return;
    speedDiv.innerText = playbackRate.toString() + "X";
  };

  speedHandler = ({
    isUp,
    videoEle,
    controller,
  }: {
    isUp: boolean;
    videoEle: HTMLVideoElement;
    controller: HTMLDivElement;
  }) => {
    let playbackRate = videoEle.playbackRate;
    playbackRate = Math.floor(playbackRate / 0.25) * 0.25;

    if (isUp) {
      playbackRate = playbackRate + 0.25 > 5 ? 5 : playbackRate + 0.25;
    } else {
      playbackRate = playbackRate - 0.25 < 0.5 ? 0.5 : playbackRate - 0.25;
    }
    videoEle.playbackRate = playbackRate;
    const id = controller.id;
    this.courseRepo.setVideoSpeed(id, playbackRate);
    this.setSpeedDiv({ controller, playbackRate });
  };
}

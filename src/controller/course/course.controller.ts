import { CourseService } from "src/application/service/course.service";

export class CourseController {
  static instance: CourseController | undefined;

  constructor(private courseService: CourseService) {}

  static getInstance = (courseService: CourseService) => {
    if (this.instance) return this.instance;
    this.instance = new CourseController(courseService);
    return this.instance;
  };

  initAutoSkip = ({
    button,
    isEnabled,
    url,
  }: {
    button: HTMLButtonElement;
    isEnabled: boolean;
    url: string;
  }) => {
    const id = button.getAttribute("id")!;
    try {
      const result = this.courseService.autoSkipHandler({
        id,
        isEnabled: isEnabled,
        url,
      });
      this.setAutoSkipStyle({ button, isEnabled: result.isEnabled });
    } catch (error) {
      console.warn(error);
    }
  };

  private setAutoSkipStyle = ({
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

  autoSkipHandler = async ({ button }: { button: HTMLButtonElement }) => {
    const id = button.getAttribute("id")!;
    const isEnabled =
      button.getAttribute("data-button") === "false" ? false : true;
    try {
      const result = this.courseService.autoSkipHandler({
        id,
        isEnabled: !isEnabled,
      });
      this.setAutoSkipStyle({ button, isEnabled: result.isEnabled });
    } catch (error) {
      console.warn(error);
    }
  };

  private setSpeedDiv = ({
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

  speedHandler = async ({
    isUp,
    controller,
  }: {
    isUp: boolean;
    controller: HTMLDivElement;
  }) => {
    try {
      const videoEle = document.querySelector("video");
      if (!videoEle) return;
      const result = this.courseService.speedHandler({ isUp, videoEle });
      this.setSpeedDiv({
        controller,
        playbackRate: result.playbackRate ? result.playbackRate : 1,
      });
    } catch (error) {
      console.warn(error);
    }
  };
}

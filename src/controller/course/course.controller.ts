import { CourseService } from "../../application/service/course.service";

export class CourseController {
  static instance: CourseController | undefined;

  constructor(private courseService: CourseService) {}

  static getInstance = (courseService: CourseService) => {
    if (this.instance) return this.instance;
    this.instance = new CourseController(courseService);
    return this.instance;
  };

  initAutoSkip = async ({
    button,
    url,
  }: {
    button: HTMLButtonElement;
    url: string;
  }) => {
    try {
      await this.courseService.initAutoSkip({ button, url });
    } catch (error) {
      console.warn(error);
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
      this.courseService.setAutoSkipStyle({
        button,
        isEnabled: result.isEnabled,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  initSpeed = async ({
    controller,
    videoEle,
  }: {
    controller: HTMLDivElement;
    videoEle: HTMLVideoElement | null;
  }) => {
    try {
      if (!videoEle) return;
      await this.courseService.initSpeed({ controller, videoEle });
    } catch (error) {
      console.warn(error);
    }
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
      this.courseService.speedHandler({
        isUp,
        videoEle,
        controller,
      });
    } catch (error) {
      console.warn(error);
    }
  };
}

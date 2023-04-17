import { CourseController } from "./course.controller";

export class CourseEntry {
  static instance: CourseEntry | undefined;
  private button = {
    autoSkip: false,
  };

  private _id = {
    autoSkip: "inflearn-extra-course-auto_skip",
    videoSpeed: "inflearn-extra-course-video_speed",
  };

  get id() {
    return this._id;
  }

  constructor(private courseController: CourseController) {}

  static getInstance = (courseController: CourseController) => {
    if (this.instance) return this.instance;
    this.instance = new CourseEntry(courseController);
    return this.instance;
  };

  autoSkip = async (url: string) => {
    const id = this._id.autoSkip;
    let ele = document.querySelector(`#${id}`) as HTMLButtonElement;
    if (!ele) {
      ele = this.createAutoSkpButton(url);
    }
    this.courseController.initAutoSkip({ button: ele, url });
  };

  private createAutoSkpButton = (url: string) => {
    const id = this._id.autoSkip;
    const button = document.createElement("button");
    button.id = id;
    button.type = "button";

    button.style.height = "36px";
    button.style.marginLeft = "8px";
    button.style.fontSize = "14px";
    button.style.border = "none";
    button.style.fontWeight = "500";
    button.style.borderRadius = "8px";
    button.style.border = "1px solid rgb(0, 196, 113)";
    button.style.padding = "0px 5px";
    button.style.fontFamily = `retendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-seri`;
    button.style.width = "100px";

    button.addEventListener("click", () => {
      this.courseController.autoSkipHandler({ button });
    });

    const insertedEle = document.querySelector(".mantine-Group-root")!;
    insertedEle.prepend(button);
    this.button.autoSkip = true;

    return button;
  };

  videoSpeed = async () => {
    const id = this._id.videoSpeed;
    let ele = document.querySelector(`#${id}`) as HTMLDivElement;
    if (!ele) {
      ele = this.createVideoSpeedButton();
    }
    setTimeout(() => {
      const videoEle = document.querySelector("video");
      this.courseController.initSpeed({ controller: ele, videoEle });
    }, 500);
  };

  private createVideoSpeedButton = () => {
    const id = this._id.videoSpeed;
    const speedController = document.createElement("div");
    speedController.id = id;
    speedController.setAttribute("data-speed", "1");
    speedController.style.display = "flex";
    speedController.style.height = "36px";
    speedController.style.color = "white";
    speedController.style.alignItems = "center";
    speedController.style.justifyContent = "center";
    speedController.style.fontSize = "15px";
    speedController.style.border = "1px solid rgb(0, 196, 113)";
    speedController.style.padding = "0px 0px";
    speedController.style.borderRadius = "8px";
    speedController.style.fontFamily = `retendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-seri`;

    const speedUpButton = document.createElement("button");
    speedUpButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
		<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
	</svg>`;
    speedUpButton.style.backgroundColor = "transparent";
    speedUpButton.style.border = "none";
    speedUpButton.style.padding = "3px";
    speedUpButton.style.display = "flex";
    speedUpButton.style.justifyContent = "center";
    speedUpButton.style.alignItems = "center";

    const upSvg = speedUpButton.querySelector("svg")!;
    upSvg.style.height = "25px";
    upSvg.style.fill = "transparent";
    upSvg.style.stroke = "rgb(0, 196, 113)";

    const speedDownButton = document.createElement("button");
    speedDownButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
		<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
	</svg>
	`;
    speedDownButton.style.backgroundColor = "transparent";
    speedDownButton.style.border = "none";
    speedDownButton.style.padding = "3px";
    speedDownButton.style.display = "flex";
    speedDownButton.style.justifyContent = "center";
    speedDownButton.style.alignItems = "center";

    const downSvg = speedDownButton.querySelector("svg")!;
    downSvg.style.height = "25px";
    downSvg.style.fill = "transparent";
    downSvg.style.stroke = "rgb(0, 196, 113)";

    const speedDiv = document.createElement("div");

    speedDiv.style.width = "35px";
    speedDiv.style.textAlign = "center";

    speedUpButton.addEventListener("click", () => {
      this.courseController.speedHandler({
        isUp: true,
        controller: speedController,
      });
    });

    speedDownButton.addEventListener("click", () => {
      this.courseController.speedHandler({
        isUp: false,
        controller: speedController,
      });
    });

    speedController.appendChild(speedDownButton);
    speedController.appendChild(speedDiv);
    speedController.appendChild(speedUpButton);

    const insertedEle = document.querySelector(".mantine-Group-root")!;
    insertedEle.prepend(speedController);

    return speedController;
  };
}

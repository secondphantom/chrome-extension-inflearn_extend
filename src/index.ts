import { CourseService } from "./application/service/course.service";
import { HomeService } from "./application/service/home.service";
import { CourseController } from "./controller/course/course.controller";
import { CourseEntry } from "./controller/course/course.entry";
import { HomeController } from "./controller/home/home.controller";
import { HomeEntry } from "./controller/home/home.entry";
import { ConfigRepo } from "./infrastructure/db/config.repo";
import { CourseChromeStorageSyncRepo } from "./infrastructure/db/course.repo";

let isInit = false;
let oldUrl = "";
chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
  const url = new URL(obj.url);

  if (isInit && oldUrl === obj.url) return;
  const config = await ConfigRepo.getInstance().getConfig();
  if (document.querySelector("#searchbar-input")) {
    const entry = HomeEntry.getInstance(
      HomeController.getInstance(HomeService.getInstance())
    );

    if (config === null) {
      await entry.searchMyCourse();
      return;
    }
    if (config["home-search_my_course"]) {
      await entry.searchMyCourse();
    }
  } else if (url.pathname.includes("/course/lecture")) {
    const entry = CourseEntry.getInstance(
      CourseController.getInstance(
        CourseService.getInstance(CourseChromeStorageSyncRepo.getInstance())
      )
    );
    if (config === null) {
      await entry.autoSkip(obj.url);
      await entry.videoSpeed();
      return;
    }
    if (config["course-auto_skip"]) {
      await entry.autoSkip(obj.url);
    }
    if (config["course-video_speed"]) {
      await entry.videoSpeed();
    }
  }
  oldUrl = obj.url;
  isInit = true;
});

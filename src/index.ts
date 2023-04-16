import { CourseService } from "./application/service/course.service";
import { HomeService } from "./application/service/home.service";
import { CourseController } from "./controller/course/course.controller";
import { CourseEntry } from "./controller/course/course.entry";
import { HomeController } from "./controller/home/home.controller";
import { HomeEntry } from "./controller/home/home.entry";
chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
  const url = new URL(obj.url);
  if (document.querySelector("#searchbar-input")) {
    const entry = HomeEntry.getInstance(
      HomeController.getInstance(HomeService.getInstance())
    );
    await entry.searchMyCourse();
  } else if (url.pathname.includes("/course/lecture")) {
    const entry = CourseEntry.getInstance(
      CourseController.getInstance(CourseService.getInstance())
    );
    await entry.autoSkip(obj.url);
    await entry.videoSpeed();
  }
});

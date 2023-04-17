import { HomeController } from "./home.controller";

export class HomeEntry {
  static instance: HomeEntry | undefined;

  private id = {
    searchMyCourse: "inflearn-extra-home-search_my_course",
  };

  constructor(private homeController: HomeController) {}

  static getInstance = (homeController: HomeController) => {
    if (this.instance) return this.instance;
    this.instance = new HomeEntry(homeController);
    return this.instance;
  };

  searchMyCourse = async () => {
    const id = this.id.searchMyCourse;
    const ele = document.querySelector(`#${id}`);
    if (ele) return;
    this.createSearchMyCourseEle();
  };

  createSearchMyCourseEle = () => {
    const searchDiv = document.createElement("div");
    searchDiv.id = this.id.searchMyCourse;
    searchDiv.className = "search search_bar navbar-item header_search";
    // searchDiv.style.color = "white";
    searchDiv.innerHTML = `
    <label class="visually-hidden" for="searchbar-input">내 강의 검색</label>
    <input type="text" id="mycourse-searchbar-input" enterkeyhint="go" class="input" placeholder="내 강의 검색" data-kv="headerSearchWord">
    <div class="search__icon e-header-search"><i class="far fa-search"></i></div>
  `;
    const inputEle = searchDiv.querySelector("input")!;
    inputEle.style.backgroundColor = `rgb(216, 255, 239)`;
    const insertedEle = document.querySelector(".navbar-right")!;
    insertedEle.prepend(searchDiv);
    const searchIconEle = document.querySelector("div")!;

    searchIconEle.addEventListener("click", () => {
      this.homeController.searchMyCourse({ searchDiv });
    });

    inputEle.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.homeController.searchMyCourse({ searchDiv });
      }
    });

    return searchDiv;
  };
}

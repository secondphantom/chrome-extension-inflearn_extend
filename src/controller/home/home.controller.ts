import { HomeService } from "../../application/service/home.service";

export class HomeController {
  static instance: HomeController | undefined;

  constructor(private homeService: HomeService) {}

  static getInstance = (homeService: HomeService) => {
    if (this.instance) return this.instance;
    this.instance = new HomeController(homeService);
    return this.instance;
  };

  searchMyCourse = ({ searchDiv }: { searchDiv: HTMLDivElement }) => {
    try {
      const inputValue = searchDiv.querySelector("input")!.value;
      this.homeService.searchMyCourse(inputValue);
    } catch (error) {
      console.warn(error);
    }
  };
}

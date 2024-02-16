import { HomeScreen } from "@src/gui/HomeScreen";
import { SplashScreen } from "@src/gui/SplashScreen";
import { render } from "lit-html";

export default class Splash {

  public start() {
    const homescreen = new SplashScreen();
    render(homescreen, document.getElementById('app'));
  }

  public addFakeLoader() {
    setTimeout(() => {
      const homescreen = new HomeScreen();
      render(homescreen, document.getElementById('app'));
    }, 2000);
  }

}
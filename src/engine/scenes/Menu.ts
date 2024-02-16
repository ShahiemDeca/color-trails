import { HomeScreen } from "@src/gui/HomeScreen";
import { render } from "lit-html";

export default class Menu {

  public start() {
    const homescreen = new HomeScreen();
    render(homescreen, document.getElementById('app'));
  }

}
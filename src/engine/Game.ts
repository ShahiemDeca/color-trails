import GameMode from "./scenes/GameMode";
import Menu from "./scenes/Menu";
import Splash from "./scenes/Splash";

export default class Game {

  constructor() {
  }

  public start(): void {
    const splash = new Splash();
    splash.start();
    splash.addFakeLoader();
  }

}

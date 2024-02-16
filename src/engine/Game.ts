import Splash from "./scenes/Splash";
export default class Game {

  public start(): void {
    const splash = new Splash();
    splash.start();
    splash.addFakeLoader();
  }

}

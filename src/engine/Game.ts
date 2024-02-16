import Splash from "./scenes/Splash";
export default class Game {

  static audioEnabled: boolean = true;

  public start(): void {
    const splash = new Splash();
    splash.start();
    splash.addFakeLoader();
  }

}

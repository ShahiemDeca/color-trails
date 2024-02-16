import { HighScore } from "@src/gui/HighScore";
import { render } from "lit-html";

export default class Score {

  public start({ score }: { score: number }) {
    const highscore = new HighScore();
    highscore.updateScore(score);

    render(highscore, document.getElementById('app'));
  }
}
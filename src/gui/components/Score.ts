import { LitElement, html, render } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { HighScore } from "../HighScore";
import { PauseScreen } from "../PauseScreen";

@customElement('my-score')
class Score extends LitElement {
  @property({ type: Number }) score = 0;

  render() {
    return html`
      <div class="header">
        <div @click=${this.onPause} class="wheel"><img src="assets/settings.png" alt="Pause"></div>
        <div class="level">${this.score}</div>
      </div>
    `;
  }

  protected createRenderRoot() {
    return this;
  }

  public onPause() {
    document.dispatchEvent(new CustomEvent('pause-game'));

    const pauseScreen = new PauseScreen();
    render(pauseScreen, document.getElementById('#app'));
  }
}

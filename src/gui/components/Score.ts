import { LitElement, html, render } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { PauseScreen } from "../PauseScreen";
import settings from '../../assets/settings.png';

@customElement('my-score')
class Score extends LitElement {
  @property({ type: Number }) score = 0;

  render() {
    return html`
      <div class="header">
        <div @click=${this.onPause} class="wheel"><img src=${settings} alt="Pause"></div>
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
    render(pauseScreen, document.getElementById('app'));
  }
}

import { LitElement, css, html } from "lit";
import { customElement, property } from 'lit/decorators.js';
import "./components/Score";

@customElement('game-mode-screen')
export default class GameModeScreen extends LitElement {

  @property({ type: Number }) score = 0;

  render() {
    return html`
    <div class="app is-splash">
      <my-score score=${this.score}></my-score>
    </div>
    `;
  }

  protected createRenderRoot() {
    return this;
  }

  public selectGameMode() {
    alert('dd')
  }

}

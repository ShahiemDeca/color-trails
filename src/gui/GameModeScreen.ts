import { LitElement, html } from "lit";
import { customElement, property } from 'lit/decorators.js';
import heartFull from '../assets/heart-full.png';
import heartEmpty from '../assets/heart-empty.png';

import "./components/Score";

@customElement('game-mode-screen')
export default class GameModeScreen extends LitElement {

  @property({ type: Number }) score = 0;
  @property({ type: Number }) hp = 3;

  public renderHearts() {
    const hearts = [];
    for (let i = 0; i < 3; i++) {
      const image = i < this.hp ? heartFull : heartEmpty;
      hearts.push(html`<img src=${image} alt="Heart">`);
    }

    return hearts;
  }

  public render() {
    return html`
    <div class="app is-splash">
      <div class="hearts">
        ${this.renderHearts()}
      </div>
      <my-score score=${this.score}></my-score>
      <div class="footer">Tap to move the platform</div>
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

import { LitElement, html } from "lit";
import { customElement } from 'lit/decorators.js';

@customElement('high-scrore')
export class HighScore extends LitElement {

  public score: number = 0;

  public render() {
    return html`
    <div class="app">
      <div class="container">
        <div class="message">
          <span class="message-icon">🎉</span>
          <div class="score-bar">
            Score
            <span>${this.score}</span>
          </div>

          <button class="is-small" @click=${this.onRetry}><span>Retry</span></button>
        </div>
      </div>
    </div>
    `;
  }

  public updateScore(score: number) {
    this.score = score;
  }

  protected createRenderRoot() {
    return this;
  }

  private onRetry() {
    document.dispatchEvent(new CustomEvent('reset-game'));
  }

}
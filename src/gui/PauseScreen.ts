import { LitElement, html, render } from "lit";
import { customElement } from 'lit/decorators.js';
import { HomeScreen } from "./HomeScreen";

@customElement('pause-screen')
export class PauseScreen extends LitElement {

  public render() {
    return html`
    <div class="app">
      <div class="container">
        <div class="message">
          <span class="message-icon">💆‍♂️</span>

          <div class="button-list">
            <button class="is-small" @click=${this.onResume}><span>Resume</span></button>
            <button class="is-small" @click=${this.onQuitGame}><span>Quit game</span></button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  protected createRenderRoot() {
    return this;
  }

  private onResume() {
    document.dispatchEvent(new CustomEvent('pause-game'));
  }

  private onQuitGame() {
    document.dispatchEvent(new CustomEvent('quit-game'));

    const homeScreen = new HomeScreen();
    render(homeScreen, document.getElementById('app'));
  }

}
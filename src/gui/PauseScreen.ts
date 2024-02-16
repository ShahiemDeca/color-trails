import { LitElement, html, render } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { HomeScreen } from "./HomeScreen";
import Game from "@src/engine/Game";

@customElement('pause-screen')
export class PauseScreen extends LitElement {

  @property({ type: Boolean }) audioStatus = true;

  public render() {
    return html`
    <div class="app">
      <div class="container">
        <div class="message">
          <span class="message-icon">💆‍♂️</span>

          <div class="button-list">
            <button class="is-small" @click=${this.onAudioToggle}><span>Audio: ${this.audioStatus ? 'on' : 'off'}</span></button>
            <button class="is-small" @click=${this.onResume}><span>Resume</span></button>
            <button class="is-small" @click=${this.onQuitGame}><span>Quit game</span></button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  constructor() {
    super();

    this.audioStatus = Game.audioEnabled;
  }

  protected createRenderRoot() {
    return this;
  }

  private onAudioToggle() {
    document.dispatchEvent(new CustomEvent('audio-toggle'));

    Game.audioEnabled = !Game.audioEnabled;
    this.audioStatus = Game.audioEnabled;
  }

  private onResume() {
    document.dispatchEvent(new CustomEvent('pause-game'));
  }

  private onQuitGame() {
    document.dispatchEvent(new CustomEvent('quit-game'));

    // Show homescreen when quiting game
    const homeScreen = new HomeScreen();
    render(homeScreen, document.getElementById('app'));
  }

}
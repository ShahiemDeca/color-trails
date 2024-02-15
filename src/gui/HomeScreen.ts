import { LitElement, html } from "lit";
import { customElement } from 'lit/decorators.js';
import GameMode from "@src/engine/scenes/GameMode";

@customElement('home-screen')
export class HomeScreen extends LitElement {

  render() {
    return html`
    <div class="app">
      <div class="container">
        <img src="assets/logo.png" alt="Logo">

        <div class="button-list">
          <button @click=${this.onSelectGameMode}><span>Match</span></button>
          <button @click=${this.onSelectGameMode}><span>Brains</span></button>
          <button @click=${this.onSelectGameMode}><span>Trail</span></button>
        </div>
      </div>
    </div>
    `;
  }

  protected createRenderRoot() {
    return this;
  }

  private onSelectGameMode() {
    const gameMode = new GameMode();
    gameMode.start();
  }

}
import { LitElement, html } from "lit";
import { customElement } from 'lit/decorators.js';
import GameMode from "@src/engine/scenes/GameMode";
import logo from '../assets/logo.png';

@customElement('home-screen')
export class HomeScreen extends LitElement {

  render() {
    return html`
    <div class="app">
      <div class="container">
        <img src="${logo}" alt="Logo" class="logo">
        <div class="button-list">
          <button @click=${this.onSelectGameMode}><span>Play Game</span></button>
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
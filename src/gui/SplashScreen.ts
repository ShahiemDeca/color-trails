import { LitElement, html } from "lit";
import { customElement } from 'lit/decorators.js';
import logo from '../assets/logo.png';

@customElement('splash-screen')
export class SplashScreen extends LitElement {

  render() {
    return html`
      <div class="app is-splash">
        <div class="container">
          <img src="${logo}" alt="Logo" class="logo is-animated">
          <span class="loading">loading</span>
        </div>
      </div>
    `;
  }

  protected createRenderRoot() {
    return this;
  }

}

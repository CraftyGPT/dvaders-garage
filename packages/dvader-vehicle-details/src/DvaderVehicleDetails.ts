import { html, css, LitElement, property } from '@lion/core';

export class DvaderVehicleDetails extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: white;
      margin: .5em;
      padding: 1em;
      border: 1px solid #333;
      border-radius: 5px;
      position: relative;
    }

    #close {
      position: absolute;
      top: .5em;
      right: .5em;
      cursor: pointer;
    }

    #close::before {
      content: "⨯";
    }
  `;

  @property({type: String, reflect: true})
  shortname!:string;

  onClickClose() {
    this.dispatchEvent(new CustomEvent("close-details"));
  }

  render() {
    return html`
      <h2>
        ${this.shortname}
      </h2>
      <dl>
        <dt>Make:</dt><dd><slot name="vehicle-make"></slot></dd>
        <dt>Model:</dt><dd><slot name="vehicle-model"></slot></dd>
        <dt>Model year:</dt><dd><slot name="vehicle-year-model"></slot></dd>
        <dt>Price:</dt><dd><slot name="vehicle-price"></slot></dd>
        <dt>Date added:</dt><dd><slot name="vehicle-date-added"></slot></dd>
      </dl>
      <h2>Location</h2>
      <slot name="location"></slot>
      <button id="close" title="Close" aria-label="Close" @click=${this.onClickClose}></button>
    `;
  }
}

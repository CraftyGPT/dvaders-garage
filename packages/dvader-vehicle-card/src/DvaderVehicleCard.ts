import { html, css, LitElement, property } from '@lion/core';

export class DvaderVehicleCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: .5em;
      padding: 1em;
      border: 1px solid #333;
      border-radius: 5px;
    }

    :host([data-licensed=true]) {
      cursor: pointer;
      position: relative;
    }

    :host([data-licensed=false]) {
      cursor: pointer;
      position: relative;
    }

    :host([data-licensed=false])::before {
      content: "⨯";
      color: red;
      text-shadow: 0 0 1px black;
      position: absolute;
      top: .5em;
      left: 1em;
    }

    :host([data-licensed=true])::before {
      content: "★";
      color: gold;
      text-shadow: 0 0 1px black;
      position: absolute;
      top: .5em;
      left: 1em;
    }
  `;

  render() {
    return html`
      <h2>
        <slot name="vehicle-name"></slot>
        <slot name="vehicle-make"></slot>
        (<slot name="vehicle-year-model"></slot>)
      </h2>
      <h3>Price:
        <slot name="vehicle-price-currency"></slot>
        <slot name="vehicle-price"></slot>
      </h3>
      <h5>Added: <slot name="vehicle-date-added"></slot></h5>
    `;
  }
}

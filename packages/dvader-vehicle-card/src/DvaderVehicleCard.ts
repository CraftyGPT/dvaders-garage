import { html, css, LitElement, property } from 'lit-element';

export class DvaderVehicleCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
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

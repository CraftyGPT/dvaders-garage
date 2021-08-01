import { LitElement, html, css, property } from '@lion/core';
import '@lion/tabs/define';
import DvaderWarehouse from './models/DvaderWarehouseModel';
import DvaderVehicle from './models/DvaderVehicleModel';
import { DvaderVehicleCard } from '../packages/dvader-vehicle-card';

export class DvadersGarage extends LitElement {
  @property({ type: String, reflect: true })
  src = "";

  @property({ type: Array })
  warehouses:DvaderWarehouse[] = [];

  static styles = css`
    :host {
    }
  `;

  async firstUpdated() {
    if (this.src) {
      const response = await fetch(this.src);
      this.warehouses = await response.json();
    }
  }

  _generateVehicleCards(vehicles:DvaderVehicle[]) {
    // Generate vehicle card markup with microdata
    return vehicles.map((vehicle, i) => {
      return html`<dvader-vehicle-card 
        itemscope
        itemtype="https://schema.org/Product"
        data-index="${i}"
        data-id="${vehicle._id}"
        data-licensed="${vehicle.licensed}">
          <span itemprop="manufacturer" slot="vehicle-make">${vehicle.make}</span>
          <span itemprop="model" slot="vehicle-model">${vehicle.model}</span>
          <span itemprop="releaseDate" slot="vehicle-year-model">${vehicle.year_model}</span>
          <span itemprop="purchaseDate" slot="vehicle-date-added">${vehicle.date_added}</span>
          <span itemprop="priceCurrency" content="USD" slot="vehicle-price-currency">$</span>
          <span itemprop="price" content="${vehicle.price}" slot="vehicle-price">${vehicle.price}</span>
        </dvader-vehicle-card>`
    })
  }

  _generateWarehouseTabs(warehouses:DvaderWarehouse[]) {
    return warehouses.map(warehouse => {
      return html`
        <button slot="tab">${warehouse.name}</button>
        <div slot="panel">
          <dvader-grid-gallery current="1" size="12" columns="3">
            ${this._generateVehicleCards(warehouse.cars.vehicles)}
          </dvader-grid-gallery>
        </div>
      `;
    });
  }

  render() {
    return html`
      <lion-tabs>
        ${this._generateWarehouseTabs(this.warehouses)}
      </lion-tabs>
    `;
  }
}

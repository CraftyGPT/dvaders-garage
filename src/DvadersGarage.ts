import { LitElement, html, css, property, query, render, customElement } from '@lion/core';
import { parseWarehouseList, DvaderWarehouse } from './models/DvaderWarehouseModel';
import { sortedListByAttribute, sortedVehiclesByDate, DvaderVehicle, findVehicleById } from './models/DvaderVehicleModel';
import { withModalDialogConfig, OverlayController } from '@lion/overlays';

import '@lion/tabs/define';
import '@lion/select/define';


export class DvadersGarage extends LitElement {
  static styles = css`
    :host {
    }

    #detailsDialog {
      display: none
    }
  `;

  @property({ type: String, reflect: true })
  src!:string;

  @property({ type: Array })
  warehouses:DvaderWarehouse[] = [];

  details!:any;

  @query("#detailsDialog")
  detailsDialog!:HTMLElement;

  async firstUpdated() {
    if (this.src) {
      const response = await fetch(this.src);
      const warehouses = parseWarehouseList(await response.json());

      // Default sorting by date
      warehouses.forEach(warehouse => {
        warehouse.cars.vehicles = sortedVehiclesByDate(warehouse.cars.vehicles, "asc");
      });
      this.warehouses = warehouses;
    }
  }

  sortingChangeHandler(e:any) {
    const select = e.target;
    if (select) {
      const tab = parseInt(select.name.replace("sortby-tab-", ""), 10);
      const [ value, direction ] = select.value.split("-");
      
      if (value !== "date") {
        this.warehouses[tab].cars.vehicles = sortedListByAttribute(this.warehouses[tab].cars.vehicles, value, direction);
      } else {
        this.warehouses[tab].cars.vehicles = sortedVehiclesByDate(this.warehouses[tab].cars.vehicles, direction);
      }
      this.requestUpdate();
    }
  }

  handleVehicleCardClick(e:any) {
    if (e.currentTarget.dataset.licensed === "true") {
      const result = findVehicleById(this.warehouses, parseInt(e.currentTarget.dataset.id, 10));
      if (result) {
        this.details = this._generateVehicleDetails(result.vehicle, result.warehouse);
        this.requestUpdate();
      }
    }
  }

  updated() {
    if (this.detailsDialog) {
      this._updateDetailsDialog();
    }
  }

  vehicleBookingSubmitted(e:any) {
    console.log("SUBMIT", e.target.dataset.id, e.target.date, e.target.time);
  }

  _updateDetailsDialog() {
    const dialog = this.detailsDialog;
    const ctrl = new OverlayController({
      ...withModalDialogConfig(),
      invokerNode: this,
      contentNode: dialog,
    });
    ctrl.show();
    ctrl.addEventListener("hide", () => {
      this.details = undefined;
      this.requestUpdate();
    })
    dialog.addEventListener("close-details", () => {
      ctrl.hide();
    }, {once: true});
  }

  _generateVehicleDetails(vehicle:DvaderVehicle, warehouse:DvaderWarehouse) {
    return html`<dvader-vehicle-details
        @submitted=${this.vehicleBookingSubmitted}
        id="detailsDialog"
        itemscope
        itemtype="https://schema.org/Product"
        shortname="${vehicle.make} ${vehicle.model} (${vehicle.year_model})"
        data-licensed="${vehicle.licensed}"
        data-id="${vehicle._id}">
          <span itemprop="manufacturer" slot="vehicle-make">${vehicle.make}</span>
          <span itemprop="model" slot="vehicle-model">${vehicle.model}</span>
          <span itemprop="releaseDate" slot="vehicle-year-model">${vehicle.year_model}</span>
          <span itemprop="purchaseDate" slot="vehicle-date-added">${vehicle.date_added.toLocaleString()}</span>
          <span itemprop="priceCurrency" content="USD" slot="vehicle-price-currency">$</span>
          <span itemprop="price" content="${vehicle.price}" slot="vehicle-price">${vehicle.price}</span>

          <div slot="location" itemscope itemtype="https://schema.org/Place">
            Warehouse: <span itemprop="name">${warehouse.name}</span>
            <div itemprop="geo" itemscope itemtype="https://schema.org/GeoCoordinates">
              Lat: ${warehouse.location.lat}, Long: ${warehouse.location.long}
              <meta itemprop="latitude" content="${warehouse.location.lat}" />
              <meta itemprop="longitude" content="${warehouse.location.long}" />
            </div>
          </div>
        </dvader-vehicle-details>
      `
  }

  _generateVehicleCards(vehicles:DvaderVehicle[]) {
    // Generate vehicle card markup with microdata
    return vehicles.map((vehicle, i) => {
      return html`<dvader-vehicle-card 
        @click="${this.handleVehicleCardClick}"
        itemscope
        itemtype="https://schema.org/Product"
        data-licensed="${vehicle.licensed}"
        data-index="${i}"
        data-id="${vehicle._id}">
          <span itemprop="manufacturer" slot="vehicle-make">${vehicle.make}</span>
          <span itemprop="model" slot="vehicle-model">${vehicle.model}</span>
          <span itemprop="releaseDate" slot="vehicle-year-model">${vehicle.year_model}</span>
          <span itemprop="purchaseDate" slot="vehicle-date-added">${vehicle.date_added.toLocaleDateString()}</span>
          <span itemprop="priceCurrency" content="USD" slot="vehicle-price-currency">$</span>
          <span itemprop="price" content="${vehicle.price}" slot="vehicle-price">${vehicle.price}</span>
        </dvader-vehicle-card>`
    })
  }

  _generateWarehouseTabs(warehouses:DvaderWarehouse[]) {
    return warehouses.map((warehouse, i) => {
      return html`
        <button slot="tab">${warehouse.name}</button>
        <div slot="panel">
          <lion-select name="sortby-tab-${i}" label="Sort by">
            <select slot="input">
              <option selected value="date-asc">Date Asc</option>
              <option value="date-dsc">Date Desc</option>
              <option value="price-asc">Price Asc</option>
              <option value="price-dsc">Price Desc</option>
              <option value="year_model-asc">Year Asc</option>
              <option value="year_model-dsc">Year Desc</option>
            </select>
          </lion-select>
          <dvader-grid-gallery current="1" size="12" columns="3">
            ${this._generateVehicleCards(warehouse.cars.vehicles)}
          </dvader-grid-gallery>
        </div>
      `;
    });
  }

  render() {
    return html`
      ${this.details ? this.details : ""} 
      <h1 role="heading" aria-level="1">Anakin Skywalker's garage</h1>
      <h3 role="heading" aria-level="2">Used cars... and more!</h3>
      <lion-tabs @change="${this.sortingChangeHandler}">
        ${this._generateWarehouseTabs(this.warehouses)}
      </lion-tabs>
    `;
  }
}

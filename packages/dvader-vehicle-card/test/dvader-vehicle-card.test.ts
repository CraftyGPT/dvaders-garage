import { html, fixture, expect } from '@open-wc/testing';

import { DvaderVehicleCard } from '../src/DvaderVehicleCard.js';
import '../dvader-vehicle-card.js';
/*
describe('DvaderVehicleCard', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<DvaderVehicleCard>(html`<dvader-vehicle-card></dvader-vehicle-card>`);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<DvaderVehicleCard>(html`<dvader-vehicle-card></dvader-vehicle-card>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<DvaderVehicleCard>(html`<dvader-vehicle-card title="attribute title"></dvader-vehicle-card>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<DvaderVehicleCard>(html`<dvader-vehicle-card></dvader-vehicle-card>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
*/
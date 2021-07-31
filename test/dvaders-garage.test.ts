import { html, fixture, expect } from '@open-wc/testing';

import { DvadersGarage } from '../src/DvadersGarage.js';
import '../src/dvaders-garage.js';

describe('DvadersGarage', () => {
  let element: DvadersGarage;
  beforeEach(async () => {
    element = await fixture(html`<dvaders-garage></dvaders-garage>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

import { html, fixture, expect } from '@open-wc/testing';

import { DvaderGridGallery } from '../src/DvaderGridGallery.js';
import '../dvader-grid-gallery.js';

describe('DvaderGridGallery', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<DvaderGridGallery>(html`<dvader-grid-gallery></dvader-grid-gallery>`);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<DvaderGridGallery>(html`<dvader-grid-gallery></dvader-grid-gallery>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<DvaderGridGallery>(html`<dvader-grid-gallery title="attribute title"></dvader-grid-gallery>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<DvaderGridGallery>(html`<dvader-grid-gallery></dvader-grid-gallery>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});

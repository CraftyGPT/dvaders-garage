import { html, css, property, queryAssignedNodes, LitElement, styleMap, query } from '@lion/core';
import { LionPagination } from '@lion/pagination';
import '@lion/pagination/define';

function range(start:number, end:number) {
  return Array.from({length: (end - start)}, (v, k) => k + start);
}

export class DvaderGridGallery extends LitElement {
  static styles = css`
    :host {
    }

    ::slotted(*) {
      display: none;
    }

    ::slotted(.visible) {
      display: block;
    }

    #grid {
      display: grid;
    }
  `

  // firstIndex defines which data-index attribute is the first one
  // this is used for calculating page numbers
  @property({type: Number, reflect: true})
  firstIndex = 0;

  // lastIndex defines which data-index attribute is the first one
  // this is used for calculating page numbers
  // if lastIndex is 0, then autodetect based on slots
  @property({type: Number, reflect: true})
  lastIndex = 0;

  // count reflects the total number of items in the gallery
  get count() {
    return this.lastIndex - this.firstIndex;
  }

  // current tracks the currently visible page
  @property({type: Number, reflect: true})
  get current() {
    return this.__current || 1;
  }

  set current(value:number) {
    if (value !== this.current) {
      const oldValue = this.current;
      this.__current = value;
      this.dispatchEvent(new Event('current-changed'));
      this.requestUpdate('current', oldValue);
    }
  }

  // size tracks the number of items per page
  @property({type: Number, reflect: true})
  get size() {
    return this.__size || 1;
  }

  set size(value:number) {
    if (value !== this.size) {
      const oldValue = this.size;
      this.__size = value;
      this.dispatchEvent(new Event('page-size-changed'));
      this.requestUpdate('size', oldValue);
    }
  }

  // columns tracks the number of grid columns
  @property({type: Number, reflect: true})
  get columns() {
    return this.__columns || 1;
  }

  set columns(value:number) {
    if (value !== this.current) {
      const oldValue = this.columns;
      this.__columns = value;
      this.dispatchEvent(new Event('columns-changed'));
      this.requestUpdate('columns', oldValue);
    }
  }

  // items tracks the HTML Elements to be paginated into the gallery
  // cache what comes from slots into a map here
  items!: { [key: number]: HTMLElement };

  @queryAssignedNodes()
  _defaultSlotNodes!:NodeListOf<HTMLElement>;

  @query("#pagination")
  _pagination!: LionPagination;

  _gridStyles = {
    gridTemplateColumns: "repeat(3, 1fr)"
  };

  __columns!:number;
  __size!:number;
  __current!:number;

  constructor() {
    super();
  }

  update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("current")) {
      const oldValue = changedProperties.get("current") as number;
      const newValue = this.current;
      this.updateCurrentPage(oldValue, newValue);
    }

    if (changedProperties.has("size")) {
      this.updatePageSize(this.size);     
    }

    if (changedProperties.has("columns")) {
      this.updateColumns(this.columns);
    }

    super.update(changedProperties);
  }

  updateCurrentPage(oldValue:number, newValue:number) {
    this._hidePage(oldValue);
    this._showPage(newValue);
    this._pagination.current = newValue;
  }

  updateColumns(newValue:number) {
    this._gridStyles.gridTemplateColumns = `repeat(${newValue}, 1fr)`;
  }

  updatePageSize(newValue:number) {
    if (this._pagination) {
      this._hideAll();
      this._pagination.count = Math.ceil(this.count / newValue);
      this._showPage(this.current);
    }
  }

  handleSlotChange(e:Event) {
    // Create a map of the slotted elements that have the data-index attribute
    this.items = Array.prototype.reduce.call(
      this._defaultSlotNodes,
      (accu:any, curr:any) => {
        if (curr.dataset && curr.dataset.index) {
          accu[curr.dataset.index] = curr;
        }
        return accu;
      }, {}) as HTMLElement[];

    if (this.lastIndex === 0) {
      this.lastIndex = this.__autodetectLastIndex();
    }

    this._pagination.count = Math.ceil(this.count / this.size);
    this.updateCurrentPage(this.current, this.current);
  }

  handlePageChange(e:Event) {
    this.current = this._pagination.current;
  }

  _getPage(index:number): any[] {
    const start = (index - 1) * this.size;
    const end = start + this.size;

    return this.items ? range(start, end).map((i) => this.items[i]) : [];
  }

  _hideAll() {
    Object.values(this.items).forEach(item => item ? item.classList.remove("visible"): "")
  }

  _hidePage(index:number) {
    this._getPage(index).forEach(item => item ? item.classList.remove("visible") : "");
  }

  _showPage(index:number) {
    this._getPage(index).forEach(item => item ? item.classList.add("visible") : "");
  }

  __autodetectLastIndex():number {
      const indices = Object.keys(this.items).map(i => parseInt(i, 10));
      indices.sort((a, b) => a - b);
      return indices[indices.length - 1];
  }

  render() {
    return html`
      <div id="grid" style=${styleMap(this._gridStyles)}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
      <lion-pagination @current-changed=${this.handlePageChange} id="pagination"></lion-pagination>
    `;
  }
}

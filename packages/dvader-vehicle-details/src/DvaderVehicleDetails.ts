import { html, css, LitElement, property, query } from '@lion/core';
import { LionSteps, LionStep } from '@lion/steps';
import '@lion/calendar/define';
import '@lion/steps/define';
import '@lion/listbox/define';

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
      display: flex;
    }

    div.flex {
      flex-grow: 1;
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

    lion-steps {
      margin-bottom: 1em;
    }

    lion-listbox {
      height: 300px;
      overflow-y: scroll;
    }
  `;

  @property({type: String, reflect: true})
  shortname!:string;

  @property({type: Date})
  date!:Date;

  @property({type: String})
  time!:String;

  @property({type: String})
  timeSlot!:String;

  @property({type: Boolean})
  showDatePicker = true;

  @property({type: Array})
  bookings!:string[];

  @property({type: Boolean})
  get showTimePicker() {
    return !this.showDatePicker;
  }

  @query("#steps")
  steps!:LionSteps;

  @query("#time")
  timeListbox!:any;

  get isFormValid() {
    return !!(this.time && this.date && !this.isTimeSlotBooked(this.date, this.time));
  }

  onClickClose() {
    this.dispatchEvent(new CustomEvent("close-details"));
  }

  onDateSelected(e:CustomEvent) {
    this.date = e.detail.selectedDate;
    this.showDatePicker = false;

    this.steps.next();
    this.requestUpdate();
  }

  onTimeSelected(e:CustomEvent) {
    this.time = this.timeListbox.modelValue;
    this.requestUpdate();
  }

  goNext() {
    if (this.steps) {
      this.steps.next()
      this.showDatePicker = this.steps.current === 0;
      this.requestUpdate();
    }
  }

  goPrev() {
    if (this.steps) {
      this.steps.previous()
      this.showDatePicker = this.steps.current === 0;
      this.requestUpdate();
    }
  }

  submit() {
    this.bookings.push(`${this.date.toDateString()},${this.time}`)
    this.dispatchEvent(new CustomEvent('submitted'));
    this.requestUpdate();
  }

  isTimeSlotBooked(date:Date, time:String) {
    return this.bookings.indexOf(`${date.toDateString()},${time}`) > -1;
  }

  _generateTimeSlots() {
    // Return time slots in 24h format, 30 minutes per slot, for example 23:30
    const times = Array.from(Array(24*2)).map((a, i) => {
      return `${Math.floor(i / 2).toString().padStart(2, '0')}:${((i % 2) * 30).toString().padEnd(2, '0')}`;
    });
    const options = times.map(time => html`<lion-option ?disabled=${this.isTimeSlotBooked(this.date, time)} .choiceValue="${time}">${time}</lion-option>`);
    return html`<lion-listbox id="time" @model-value-changed=${this.onTimeSelected} name="time" label="Select time">${options}</lion-listbox>`;
  }

  _getSubmitButton() {
    return html`<button ?disabled=${!this.isFormValid} @click=${this.submit}>Book</button>`;
  }

  constructor() {
    super();
    this.bookings = [];
  }

  render() {
    return html`
      <div class="flex">
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
      </div>
      <div class="flex">
        <h2>Book a test drive</h2>
        <lion-steps id="steps">
          <lion-step initial-step>
            <button disabled>Previous</button>
            Step 1: Select Date
            <button @click=${this.goNext} ?disabled=${!this.date}>Next</button>
          </lion-step>
          <lion-step>
            <button @click=${this.goPrev}>Previous</button>
            Step 2: Select Time
            <button disabled>Next</button>
          </lion-step>
        </lion-steps>

        ${this.showDatePicker ? html`<lion-calendar @user-selected-date-changed=${this.onDateSelected}></lion-calendar>` : ""}
        ${this.showTimePicker ? html`<h4>Date: ${this.date ? this.date.toLocaleDateString() : "Not selected"}</h4>${this._generateTimeSlots()} ${this._getSubmitButton()}` : ""}
      </div>
    `;
  }
}

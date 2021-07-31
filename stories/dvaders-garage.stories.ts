import { html, TemplateResult } from 'lit-html';
import '../src/dvaders-garage.js';

export default {
  title: 'DvadersGarage',
  component: 'dvaders-garage',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ title, backgroundColor = 'white' }: ArgTypes) => html`
  <dvaders-garage style="--dvaders-garage-background-color: ${backgroundColor}" .title=${title}></dvaders-garage>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app',
};

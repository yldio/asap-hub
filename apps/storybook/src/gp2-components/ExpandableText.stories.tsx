import { ExpandableText } from '@asap-hub/react-components';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ExpandableText> = {
  title: 'Molecules / ExpandableText',
  component: ExpandableText,
  argTypes: {
    variant: { control: 'select', options: ['chevron', 'arrow'] },
    expandOnce: { control: 'radio', options: [true, false] },
  },
};

type Story = StoryObj<typeof ExpandableText>;

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec lorem ac lacus tincidunt imperdiet pulvinar et odio. Morbi magna est, rutrum sed mi quis, ultrices tristique augue. Proin rhoncus nulla in nisl accumsan, vitae iaculis lectus sagittis. Proin et posuere ante. Vestibulum eu nulla eget justo interdum bibendum quis aliquam neque. In sagittis justo et urna auctor pulvinar. Nam lacinia enim sit amet ligula auctor, ut suscipit diam volutpat. Quisque suscipit elit arcu, maximus lobortis tortor rutrum eu. In ornare orci vitae libero viverra fermentum. Sed aliquam consectetur vulputate. Vivamus ultrices, elit in interdum pharetra, justo ipsum lobortis diam, et vehicula mi odio id est. In ut turpis augue. Aliquam rutrum commodo est id sollicitudin.

Vestibulum metus augue, consequat id libero elementum, dictum tincidunt nisl. Curabitur non imperdiet elit, vel volutpat ex. Praesent hendrerit rhoncus est quis commodo. Pellentesque lobortis, mauris non condimentum eleifend, metus erat accumsan sapien, sed vehicula est ante id lorem. Nam sit amet neque neque. Etiam in lectus vel sem aliquam condimentum non a enim. Suspendisse vitae libero at nibh accumsan gravida. Duis non mattis ante, molestie aliquam nunc.

Nullam id tempor arcu, eget fringilla tortor. Aliquam ornare semper ipsum ac condimentum. In rhoncus nec enim pellentesque vulputate. Integer consectetur mauris justo, eget blandit dolor bibendum ut. Nam vel vestibulum orci, sit amet ornare lacus. Nam nunc nulla, tempus id faucibus at, iaculis sit amet velit. Donec varius purus neque, quis lacinia risus ultricies eget. Etiam non ipsum bibendum, ullamcorper ante laoreet, fringilla odio. Integer eget ante magna. Vivamus tincidunt felis libero, sed laoreet odio varius ut. Duis convallis faucibus purus non auctor. Integer faucibus libero at ante accumsan iaculis et sit amet mi.

Proin pellentesque tempus risus. Aenean rutrum porta eros vel fringilla. Quisque porta hendrerit ipsum, eu porta orci aliquam ut. Fusce vulputate risus sapien. Suspendisse aliquam, mauris nec vehicula gravida, elit mi iaculis orci, ac commodo lacus metus sed nisi. Cras in egestas nisi. Pellentesque diam enim, faucibus quis elementum et, accumsan quis libero. Curabitur in nisi ligula. Morbi eu orci eget nisl lacinia lacinia.`;

export const Normal: Story = {
  args: {
    children: text,
  },
};

export const Arrow: Story = {
  args: {
    children: text,
    variant: 'arrow',
  },
};

export const ExpandOnce: Story = {
  args: {
    children: text,
    expandOnce: true,
  },
};

export default meta;

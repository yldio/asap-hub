# react-components

## Structure

`react-components` consists of the atom, molecule, organism, and template layers. A layer must never import a later layer, and should minimize imports within itself.
Only templates are used by the consumers, except for Storybook, which may show more granular components.

There are also shared files defining shared styles, values, utils, or other shared code.

Every component is tested in JSDOM. Some components are additionally tested in a real browser environment (`*.browser-test.tsx`) for when things that JSDOM does not support are needed, e.g. pseudo-elements or actual layouting with bounding boxes.

The browser tests are currently implemented using playwright and jsdom. Using the `react-testing-library` jsdom for components is generated and then the jsdom is
converted into real dom using `domToPlaywright`. Because the components are rendered into jsdom first, it does not mirror real conditions exactly. For example, the drag and drop
of the `MultiSelect` component does not work because of this.

`icons` are React `svg` elements.
`images` are binary and are copied as-is by the build process. It is up to the consumer to handle them. This is because different target environments of `react-components` (e.g. the `frontend`s, `storybook`, `unsupported-browser-page`, `messages`) need to handle them differently.

## Principles

`react-components` is mostly responsible for visual behavior, not for e.g. routing or network requests.

We do not shallow test or use similar mocking techniques. Tests for parent components must as much as possible avoid relying on details of their children, which are instead covered in the tests for their children themselves.

Tests are to be written as resilient as possible, e.g. without relying on exact texts or values that a component contains or. For example, a test could instead of relying on an exact value check that a `<Button small>` has a lower height than a `<Button>`.

At the same time, tests also need to avoid falsely passing. For example, when you check that a `disabled` prop makes an element grey, in the same test also check that it was not grey in the first place without the prop before re-rendering it with the prop.

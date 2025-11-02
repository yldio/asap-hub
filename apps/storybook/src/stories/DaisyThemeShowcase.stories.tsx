import type { Meta, StoryObj } from '@storybook/react-vite'

const ThemeShowcase = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">DaisyUI Theme Showcase</h1>
        <p className="text-lg">
          Comprehensive display of DaisyUI theming system with Tailwind CSS utility classes
        </p>
      </div>

      {/* Typography Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Typography</h2>
          <p>
            Font families, sizes, weights, line heights, and letter spacing
          </p>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Font Families</h3>
            <div className="space-y-2">
              <p className="font-sans">
                Sans-serif (Default) - The quick brown fox jumps over the lazy dog
              </p>
              <p className="font-serif">
                Serif - The quick brown fox jumps over the lazy dog
              </p>
              <p className="font-mono text-sm">
                Monospace - const theme = "daisyui"; // 123456
              </p>
              <p className="text-xs ">
                DaisyUI uses system fonts for optimal performance
              </p>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Font Sizes</h3>
            <div className="space-y-3">
              <p className="text-xs">text-xs - Extra small text (0.75rem / 12px)</p>
              <p className="text-sm">text-sm - Small text (0.875rem / 14px)</p>
              <p className="text-base">text-base - Base text (1rem / 16px)</p>
              <p className="text-lg">text-lg - Large text (1.125rem / 18px)</p>
              <p className="text-xl">text-xl - Extra large text (1.25rem / 20px)</p>
              <p className="text-2xl">text-2xl - 2X large text (1.5rem / 24px)</p>
              <p className="text-3xl">text-3xl - 3X large text (1.875rem / 30px)</p>
              <p className="text-4xl">text-4xl - 4X large text (2.25rem / 36px)</p>
              <p className="text-5xl">text-5xl - 5X large text (3rem / 48px)</p>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Font Weights</h3>
            <div className="space-y-2">
              <p className="font-thin">font-thin - Thin weight (100)</p>
              <p className="font-extralight">font-extralight - Extra light weight (200)</p>
              <p className="font-light">font-light - Light weight (300)</p>
              <p className="font-normal">font-normal - Normal weight (400)</p>
              <p className="font-medium">font-medium - Medium weight (500)</p>
              <p className="font-semibold">font-semibold - Semi-bold weight (600)</p>
              <p className="font-bold">font-bold - Bold weight (700)</p>
              <p className="font-extrabold">font-extrabold - Extra bold weight (800)</p>
              <p className="font-black">font-black - Black weight (900)</p>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Line Heights & Letter Spacing</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs  mb-1">leading-tight (1.25)</p>
                <p className="leading-tight text-sm">
                  This paragraph uses tight line height. It's useful for headings or when you need
                  compact text layout. The lines are closer together for a condensed appearance.
                </p>
              </div>
              <div>
                <p className="text-xs  mb-1">leading-normal (1.5)</p>
                <p className="leading-normal text-sm">
                  This paragraph uses normal line height. It's the default and provides good
                  readability for most body text. The spacing is balanced and comfortable to read.
                </p>
              </div>
              <div>
                <p className="text-xs  mb-1">leading-relaxed (1.625)</p>
                <p className="leading-relaxed text-sm">
                  This paragraph uses relaxed line height. It provides more breathing room between
                  lines, which can improve readability for longer text blocks and content.
                </p>
              </div>
              <div>
                <p className="text-xs  mb-1">Letter Spacing</p>
                <div className="space-y-2">
                  <p className="tracking-tighter text-sm">tracking-tighter - Tighter letter spacing</p>
                  <p className="tracking-tight text-sm">tracking-tight - Tight letter spacing</p>
                  <p className="tracking-normal text-sm">tracking-normal - Normal letter spacing</p>
                  <p className="tracking-wide text-sm">tracking-wide - Wide letter spacing</p>
                  <p className="tracking-wider text-sm">tracking-wider - Wider letter spacing</p>
                  <p className="tracking-widest text-sm">tracking-widest - Widest letter spacing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Spacing System</h2>
          <p className="">
            Padding, margin, gap utilities based on Tailwind's spacing scale
          </p>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Padding Scale</h3>
            <div className="space-y-2">
              <div className="border border-base-300 rounded">
                <div className="bg-primary/10 p-0">
                  <div className="bg-primary/20 p-2 text-xs">p-0 (0px)</div>
                </div>
              </div>
              <div className="border border-base-300 rounded">
                <div className="bg-primary/10 p-1">
                  <div className="bg-primary/20 p-2 text-xs">p-1 (0.25rem / 4px)</div>
                </div>
              </div>
              <div className="border border-base-300 rounded">
                <div className="bg-primary/10 p-2">
                  <div className="bg-primary/20 p-2 text-xs">p-2 (0.5rem / 8px)</div>
                </div>
              </div>
              <div className="border border-base-300 rounded">
                <div className="bg-primary/10 p-4">
                  <div className="bg-primary/20 p-2 text-xs">p-4 (1rem / 16px)</div>
                </div>
              </div>
              <div className="border border-base-300 rounded">
                <div className="bg-primary/10 p-6">
                  <div className="bg-primary/20 p-2 text-xs">p-6 (1.5rem / 24px)</div>
                </div>
              </div>
              <div className="border border-base-300 rounded">
                <div className="bg-primary/10 p-8">
                  <div className="bg-primary/20 p-2 text-xs">p-8 (2rem / 32px)</div>
                </div>
              </div>
              <div className="border border-base-300 rounded">
                <div className="bg-primary/10 p-12">
                  <div className="bg-primary/20 p-2 text-xs">p-12 (3rem / 48px)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Margin Scale</h3>
            <div className="border border-base-300 rounded p-4 space-y-0">
              <div className="bg-success/20 p-2 m-0 text-xs">m-0 (0px)</div>
              <div className="bg-success/20 p-2 m-1 text-xs">m-1 (0.25rem / 4px)</div>
              <div className="bg-success/20 p-2 m-2 text-xs">m-2 (0.5rem / 8px)</div>
              <div className="bg-success/20 p-2 m-4 text-xs">m-4 (1rem / 16px)</div>
              <div className="bg-success/20 p-2 m-6 text-xs">m-6 (1.5rem / 24px)</div>
              <div className="bg-success/20 p-2 m-8 text-xs">m-8 (2rem / 32px)</div>
              <div className="bg-success/20 p-2 m-12 text-xs">m-12 (3rem / 48px)</div>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Gap Utilities</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs  mb-2">gap-1 (0.25rem / 4px)</p>
                <div className="flex gap-1">
                  <div className="h-12 w-12 bg-primary rounded"></div>
                  <div className="h-12 w-12 bg-primary rounded"></div>
                  <div className="h-12 w-12 bg-primary rounded"></div>
                </div>
              </div>
              <div>
                <p className="text-xs  mb-2">gap-2 (0.5rem / 8px)</p>
                <div className="flex gap-2">
                  <div className="h-12 w-12 bg-secondary rounded"></div>
                  <div className="h-12 w-12 bg-secondary rounded"></div>
                  <div className="h-12 w-12 bg-secondary rounded"></div>
                </div>
              </div>
              <div>
                <p className="text-xs  mb-2">gap-4 (1rem / 16px)</p>
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-accent rounded"></div>
                  <div className="h-12 w-12 bg-accent rounded"></div>
                  <div className="h-12 w-12 bg-accent rounded"></div>
                </div>
              </div>
              <div>
                <p className="text-xs  mb-2">gap-8 (2rem / 32px)</p>
                <div className="flex gap-8">
                  <div className="h-12 w-12 bg-info rounded"></div>
                  <div className="h-12 w-12 bg-info rounded"></div>
                  <div className="h-12 w-12 bg-info rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Container</h3>
            <div className="space-y-4">
              <div className="container max-w-sm mx-auto bg-warning/20 p-4 rounded">
                <p className="text-sm">Small Container (max-w-sm)</p>
              </div>
              <div className="container max-w-md mx-auto bg-warning/30 p-4 rounded">
                <p className="text-sm">Medium Container (max-w-md)</p>
              </div>
              <div className="container max-w-lg mx-auto bg-warning/40 p-4 rounded">
                <p className="text-sm">Large Container (max-w-lg)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Base Colors</h2>
          <p className="">
            DaisyUI's semantic color system with theme support
          </p>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Brand Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-primary"></div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">primary</p>
                  <p className="text-xs ">Main brand color</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-secondary"></div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">secondary</p>
                  <p className="text-xs ">Secondary brand color</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-accent"></div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">accent</p>
                  <p className="text-xs ">Accent color</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-neutral"></div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">neutral</p>
                  <p className="text-xs ">Neutral color</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Background Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg border border-base-300 bg-base-100"></div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">base-100</p>
                  <p className="text-xs ">Primary background</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg border border-base-300 bg-base-200"></div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">base-200</p>
                  <p className="text-xs ">Secondary background</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg border border-base-300 bg-base-300"></div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">base-300</p>
                  <p className="text-xs ">Tertiary background</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Semantic Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-info flex items-center justify-center">
                  <span className="text-info-content text-xs font-medium">Info</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">info</p>
                  <p className="text-xs ">Information state</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-success flex items-center justify-center">
                  <span className="text-success-content text-xs font-medium">Success</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">success</p>
                  <p className="text-xs ">Success state</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-warning flex items-center justify-center">
                  <span className="text-warning-content text-xs font-medium">Warning</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">warning</p>
                  <p className="text-xs ">Warning state</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-error flex items-center justify-center">
                  <span className="text-error-content text-xs font-medium">Error</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">error</p>
                  <p className="text-xs ">Error state</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI Elements Section */}
      <section className="space-y-6 pb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2">UI Elements</h2>
          <p className="">
            Common HTML elements styled with DaisyUI classes
          </p>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Headings (h1-h6)</h3>
            <div className="space-y-3">
              <h1 className="text-5xl font-bold">H1 - Main Page Heading</h1>
              <h2 className="text-4xl font-bold">H2 - Section Heading</h2>
              <h3 className="text-3xl font-bold">H3 - Subsection Heading</h3>
              <h4 className="text-2xl font-bold">H4 - Minor Heading</h4>
              <h5 className="text-xl font-bold">H5 - Small Heading</h5>
              <h6 className="text-lg font-bold">H6 - Tiny Heading</h6>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Paragraph</h3>
            <div className="space-y-3">
              <p className="text-base">
                This is a default paragraph element. It uses the base font size and has standard
                line height and spacing for optimal readability. DaisyUI provides excellent
                typography defaults out of the box.
              </p>
              <p className="">
                This is a secondary paragraph with reduced opacity, useful for less important
                information or supporting text that complements the main content.
              </p>
              <p className="text-lg font-bold">
                This is an emphasized paragraph with larger font size and bold weight, perfect
                for drawing attention to important information.
              </p>
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Input</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Default input" className="input input-bordered w-full" />
              <input type="text" placeholder="Primary input" className="input input-bordered input-primary w-full" />
              <input type="text" placeholder="Secondary input" className="input input-bordered input-secondary w-full" />
              <input type="text" placeholder="Accent input" className="input input-bordered input-accent w-full" />
              <input type="text" placeholder="Ghost input" className="input input-ghost w-full" />
              <input type="text" placeholder="Disabled input" className="input input-bordered w-full" disabled />
            </div>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Section (Semantic HTML)</h3>
            <section className="card shadow-sm">
              <div className="card-body">
                <h4 className="text-xl font-bold mb-2">Section Title</h4>
                <p className="text-base">
                  This demonstrates a section element using DaisyUI card classes. Sections help
                  organize content into logical groupings with proper semantic HTML structure.
                  The card component provides beautiful borders, shadows, and spacing.
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Search Dropdown</h3>
            <div className="dropdown dropdown-bottom w-full max-w-md">
              <div tabIndex={0} role="button" className="w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-bordered w-full bg-white border border-black"
                />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1] w-full p-2 shadow mt-1">
                <li>
                  <a>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Apple
                  </a>
                </li>
                <li>
                  <a>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Banana
                  </a>
                </li>
                <li>
                  <a>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Orange
                  </a>
                </li>
                <li>
                  <a>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Grape
                  </a>
                </li>
                <li>
                  <a>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Mango
                  </a>
                </li>
              </ul>
            </div>
            <p className="text-xs  mt-2">
              Interactive search dropdown using DaisyUI dropdown component
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

const meta = {
  title: 'DaisyUI/Theme Showcase',
  component: ThemeShowcase,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ThemeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}


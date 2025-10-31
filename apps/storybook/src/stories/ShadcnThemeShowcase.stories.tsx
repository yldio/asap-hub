import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/shadcn/button'
import { Input } from '@/components/ui/shadcn/input'
import { Badge } from '@/components/ui/shadcn/badge'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/shadcn/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select'
import { cn } from '@/lib/utils'

const ThemeShowcase = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Shadcn UI Theme Showcase</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive display of shadcn/ui theming system with Tailwind CSS and CVA
        </p>
      </div>

      {/* CSS Variables & Design Tokens */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">CSS Variables & Design Tokens</h2>
          <p className="text-muted-foreground">
            Shadcn uses CSS variables for theming, enabling easy light/dark mode switching
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Color System</CardTitle>
            <CardDescription>
              Core color tokens defined in index.css using OKLCH color space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Background Colors */}
              <div className="space-y-2">
                <div className="h-20 rounded-lg border bg-background" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">background</p>
                  <p className="text-xs text-muted-foreground">Primary background</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-20 rounded-lg border bg-foreground" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">foreground</p>
                  <p className="text-xs text-muted-foreground">Primary text</p>
                </div>
              </div>

              {/* Card Colors */}
              <div className="space-y-2">
                <div className="h-20 rounded-lg border bg-card" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">card</p>
                  <p className="text-xs text-muted-foreground">Card background</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-20 rounded-lg border bg-primary text-primary-foreground flex items-center justify-center">
                  <span className="text-xs font-medium">Primary</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">primary</p>
                  <p className="text-xs text-muted-foreground">Brand color</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-20 rounded-lg border bg-secondary text-secondary-foreground flex items-center justify-center">
                  <span className="text-xs font-medium">Secondary</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">secondary</p>
                  <p className="text-xs text-muted-foreground">Secondary color</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-20 rounded-lg border bg-muted text-muted-foreground flex items-center justify-center">
                  <span className="text-xs font-medium">Muted</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">muted</p>
                  <p className="text-xs text-muted-foreground">Subtle backgrounds</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-20 rounded-lg border bg-accent text-accent-foreground flex items-center justify-center">
                  <span className="text-xs font-medium">Accent</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">accent</p>
                  <p className="text-xs text-muted-foreground">Hover/focus states</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-20 rounded-lg border bg-destructive text-white flex items-center justify-center">
                  <span className="text-xs font-medium">Destructive</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">destructive</p>
                  <p className="text-xs text-muted-foreground">Error/danger</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Border Radius Tokens</CardTitle>
            <CardDescription>
              Customizable radius values using CSS calc() functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-sm" />
                <p className="font-semibold text-sm">rounded-sm</p>
                <p className="text-xs text-muted-foreground">var(--radius) - 4px</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-md" />
                <p className="font-semibold text-sm">rounded-md</p>
                <p className="text-xs text-muted-foreground">var(--radius) - 2px</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-lg" />
                <p className="font-semibold text-sm">rounded-lg</p>
                <p className="text-xs text-muted-foreground">var(--radius)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-xl" />
                <p className="font-semibold text-sm">rounded-xl</p>
                <p className="text-xs text-muted-foreground">var(--radius) + 4px</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Variant System (CVA) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Variant System (CVA)</h2>
          <p className="text-muted-foreground">
            Class Variance Authority (CVA) enables type-safe variant composition
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>
              Demonstrating CVA variant patterns from button.tsx
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Variant Prop</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Size Prop</p>
              <div className="flex flex-wrap gap-2 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Composed Variants (variant + size)</p>
              <div className="flex flex-wrap gap-2 items-center">
                <Button variant="outline" size="sm">Small Outline</Button>
                <Button variant="destructive" size="default">Default Destructive</Button>
                <Button variant="secondary" size="lg">Large Secondary</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">State: Disabled</p>
              <div className="flex flex-wrap gap-2">
                <Button disabled>Disabled Default</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
                <Button variant="destructive" disabled>Disabled Destructive</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
            <CardDescription>
              Another example of CVA variant composition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Typography & Tailwind Tokens */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Typography & Tailwind Tokens</h2>
          <p className="text-muted-foreground">
            Built on Tailwind's comprehensive typography scale
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Font Sizes</CardTitle>
            <CardDescription>
              Tailwind's default type scale from text-xs to text-4xl
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs">text-xs - Extra small text (0.75rem / 12px)</p>
            <p className="text-sm">text-sm - Small text (0.875rem / 14px)</p>
            <p className="text-base">text-base - Base text (1rem / 16px)</p>
            <p className="text-lg">text-lg - Large text (1.125rem / 18px)</p>
            <p className="text-xl">text-xl - Extra large text (1.25rem / 20px)</p>
            <p className="text-2xl">text-2xl - 2X large text (1.5rem / 24px)</p>
            <p className="text-3xl">text-3xl - 3X large text (1.875rem / 30px)</p>
            <p className="text-4xl">text-4xl - 4X large text (2.25rem / 36px)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Font Weights</CardTitle>
            <CardDescription>
              Tailwind font weight utilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-normal">font-normal - Normal weight (400)</p>
            <p className="font-medium">font-medium - Medium weight (500)</p>
            <p className="font-semibold">font-semibold - Semi-bold weight (600)</p>
            <p className="font-bold">font-bold - Bold weight (700)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Heights</CardTitle>
            <CardDescription>
              Tailwind leading utilities for text spacing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">leading-tight (1.25)</p>
              <p className="leading-tight text-sm">
                This paragraph uses tight line height. It's useful for headings or when you need
                compact text layout. The lines are closer together.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">leading-normal (1.5)</p>
              <p className="leading-normal text-sm">
                This paragraph uses normal line height. It's the default and provides good
                readability for most body text. The spacing is balanced.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">leading-relaxed (1.625)</p>
              <p className="leading-relaxed text-sm">
                This paragraph uses relaxed line height. It provides more breathing room between
                lines, which can improve readability for longer text blocks.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spacing System */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Spacing System</h2>
          <p className="text-muted-foreground">
            Tailwind's spacing scale based on 0.25rem (4px) increments
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Padding Scale</CardTitle>
            <CardDescription>
              Visual representation of Tailwind padding utilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="border rounded">
              <div className="bg-primary/10 p-1">
                <div className="bg-primary/20 p-2 text-xs">p-1 (0.25rem / 4px)</div>
              </div>
            </div>
            <div className="border rounded">
              <div className="bg-primary/10 p-2">
                <div className="bg-primary/20 p-2 text-xs">p-2 (0.5rem / 8px)</div>
              </div>
            </div>
            <div className="border rounded">
              <div className="bg-primary/10 p-4">
                <div className="bg-primary/20 p-2 text-xs">p-4 (1rem / 16px)</div>
              </div>
            </div>
            <div className="border rounded">
              <div className="bg-primary/10 p-6">
                <div className="bg-primary/20 p-2 text-xs">p-6 (1.5rem / 24px)</div>
              </div>
            </div>
            <div className="border rounded">
              <div className="bg-primary/10 p-8">
                <div className="bg-primary/20 p-2 text-xs">p-8 (2rem / 32px)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gap Utilities</CardTitle>
            <CardDescription>
              Spacing between flex and grid items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">gap-2 (0.5rem / 8px)</p>
              <div className="flex gap-2">
                <div className="h-12 w-12 bg-primary rounded" />
                <div className="h-12 w-12 bg-primary rounded" />
                <div className="h-12 w-12 bg-primary rounded" />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">gap-4 (1rem / 16px)</p>
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-secondary rounded" />
                <div className="h-12 w-12 bg-secondary rounded" />
                <div className="h-12 w-12 bg-secondary rounded" />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">gap-6 (1.5rem / 24px)</p>
              <div className="flex gap-6">
                <div className="h-12 w-12 bg-accent rounded" />
                <div className="h-12 w-12 bg-accent rounded" />
                <div className="h-12 w-12 bg-accent rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Component Composition */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Component Composition</h2>
          <p className="text-muted-foreground">
            Shadcn components are designed to compose together seamlessly
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>The cn() Utility</CardTitle>
            <CardDescription>
              Merges Tailwind classes using clsx + tailwind-merge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <div className="text-xs text-muted-foreground mb-2">// lib/utils.ts</div>
              <code>
                export function cn(...inputs: ClassValue[]) {'{'}
                <br />
                {'  '}return twMerge(clsx(inputs))
                <br />
                {'}'}
              </code>
            </div>
            <p className="text-sm">
              This utility properly merges conflicting Tailwind classes. For example, 
              <code className="mx-1 bg-muted px-1.5 py-0.5 rounded text-xs">
                cn("px-2", "px-4")
              </code>
              results in just <code className="bg-muted px-1.5 py-0.5 rounded text-xs">px-4</code>,
              not both classes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complex Composition Example</CardTitle>
            <CardDescription>
              Card with Badge, Input, and Button components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Enter your name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="Enter your email" defaultValue="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select defaultValue="developer">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Radix UI Integration</CardTitle>
            <CardDescription>
              Shadcn components are built on Radix UI primitives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Components like Select use Radix UI under the hood, providing:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">✓</Badge>
                <span>Full keyboard navigation and focus management</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">✓</Badge>
                <span>WAI-ARIA compliant accessibility</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">✓</Badge>
                <span>Polymorphic components via the Slot pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">✓</Badge>
                <span>Flexible styling with full className control</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Interactive Components */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Interactive Components</h2>
          <p className="text-muted-foreground">
            All components in action with full interactivity
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>All button variants and states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Primary Actions</p>
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Subtle Actions</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input Fields</CardTitle>
              <CardDescription>Various input states and types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Default input" />
              <Input placeholder="Email input" type="email" />
              <Input placeholder="Disabled input" disabled />
              <Input placeholder="With default value" defaultValue="Sample text" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Dropdown</CardTitle>
              <CardDescription>Interactive selection component</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="grape">Grape</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select defaultValue="large">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Status indicators and labels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>New</Badge>
                <Badge variant="secondary">Draft</Badge>
                <Badge variant="outline">Published</Badge>
                <Badge variant="destructive">Archived</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Theme Customization */}
      <section className="space-y-6 pb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2">Theme Customization</h2>
          <p className="text-muted-foreground">
            How to customize the shadcn theme for your project
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Modifying CSS Variables</CardTitle>
            <CardDescription>
              Edit index.css to change theme colors and tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg font-mono text-xs">
              <div className="text-muted-foreground mb-2">/* index.css */</div>
              <code>
                :root {'{'}
                <br />
                {'  '}--radius: 0.625rem; /* Base radius */
                <br />
                {'  '}--background: oklch(1 0 0); /* White */
                <br />
                {'  '}--foreground: oklch(0.145 0 0); /* Near black */
                <br />
                {'  '}--primary: oklch(0.205 0 0); /* Dark gray */
                <br />
                {'  '}/* ... other variables */
                <br />
                {'}'}
              </code>
            </div>
            <p className="text-sm">
              All colors use OKLCH for better perceptual uniformity. Dark mode values are defined
              in a <code className="bg-muted px-1.5 py-0.5 rounded">.dark</code> selector.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adding Custom Variants</CardTitle>
            <CardDescription>
              Extend CVA variants in component files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg font-mono text-xs">
              <code>
                const buttonVariants = cva("base-classes", {'{'}
                <br />
                {'  '}variants: {'{'}
                <br />
                {'    '}variant: {'{'}
                <br />
                {'      '}default: "...",
                <br />
                {'      '}custom: "your-custom-classes", // Add here
                <br />
                {'    '}{'}'}, 
                <br />
                {'  }'}
                <br />
                {'}'})
              </code>
            </div>
            <p className="text-sm">
              Create custom variants by adding new keys to the variants object in CVA configuration.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

const meta: Meta<typeof ThemeShowcase> = {
  title: 'Shadcn UI/Theme Showcase',
  component: ThemeShowcase,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ThemeShowcase>

export const Default: Story = {}


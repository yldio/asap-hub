import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Heading, Text, Stack, ChakraProvider, Container, Input, Grid, Combobox, useFilter, useListCollection } from '@chakra-ui/react'
import { customSystem } from '@/lib/chakra-theme'

// Search Combobox component for demonstration
const SearchCombobox = () => {
  const { contains } = useFilter({ sensitivity: 'base' })
  
  const { collection, filter } = useListCollection({
    initialItems: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Orange', value: 'orange' },
      { label: 'Grape', value: 'grape' },
      { label: 'Mango', value: 'mango' },
    ],
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="full"
    >
      <Combobox.Control>
        <Combobox.Input placeholder="Search..." />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Combobox.Positioner>
        <Combobox.Content>
          <Combobox.Empty>No results found</Combobox.Empty>
          {collection.items.map((item) => (
            <Combobox.Item item={item} key={item.value}>
              {item.label}
              <Combobox.ItemIndicator />
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.Root>
  )
}

const ThemeShowcase = () => {
  return (
    <Stack gap="2xl" p="xl" maxW="1200px" mx="auto">
      <Box>
        <Heading size="2xl" mb="md">Theme Showcase</Heading>
        <Text color="text.secondary">Comprehensive display of custom Chakra UI theme configuration</Text>
      </Box>

      {/* Typography Section */}
      <Box as="section" p="lg" bg="bg.surface" borderRadius="lg">
        <Heading size="xl" mb="lg">Typography</Heading>
        
        {/* Font Families */}
        <Box mb="lg">
          <Heading size="md" mb="md">Font Families</Heading>
          <Stack gap="sm">
            <Text fontFamily="heading">
              Inter (Heading & Body) - The quick brown fox jumps over the lazy dog
            </Text>
            <Text fontFamily="mono" fontSize="sm">
              Fira Code (Monospace) - const theme = "custom"; // 123456
            </Text>
            <Text fontSize="xs" color="text.secondary">
              Fonts loaded from: chakra-theme.ts
            </Text>
          </Stack>
        </Box>

        {/* Font Sizes */}
        <Box mb="lg">
          <Heading size="md" mb="md">Font Sizes</Heading>
          <Stack gap="sm">
            <Heading size="2xl">Heading 2XL - Main Title</Heading>
            <Heading size="xl">Heading XL - Page Title</Heading>
            <Heading size="lg">Heading LG - Section Title</Heading>
            <Heading size="md">Heading MD - Subsection</Heading>
            <Heading size="sm">Heading SM - Small Section</Heading>
            <Heading size="xs">Heading XS - Tiny Section</Heading>
            <Text fontSize="lg">Body Large - Emphasized text</Text>
            <Text fontSize="md">Body Medium - Default text</Text>
            <Text fontSize="sm">Body Small - Secondary text</Text>
            <Text fontSize="xs">Body Extra Small - Fine print</Text>
          </Stack>
        </Box>

        {/* Font Styles */}
        <Box mb="lg">
          <Heading size="md" mb="md">Font Styles</Heading>
          <Stack gap="sm">
            <Text fontWeight="bold">Bold text - Important information</Text>
            <Text fontWeight="normal">Normal text - Regular content</Text>
            <Text fontStyle="italic">Italic text - Emphasis or quotation</Text>
            <Text fontWeight="bold" fontStyle="italic">Bold Italic - Strong emphasis</Text>
          </Stack>
        </Box>

        {/* Line Heights & Letter Spacing */}
        <Box>
          <Heading size="md" mb="md">Spacing (Line Height)</Heading>
          <Stack gap="md">
            <Box>
              <Text fontSize="sm" color="text.secondary" mb="1">Normal (1.5):</Text>
              <Text lineHeight="normal">
                This is a paragraph with normal line height. It demonstrates how text flows with standard spacing between lines.
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="text.secondary" mb="1">Tall (2):</Text>
              <Text lineHeight="tall">
                This is a paragraph with tall line height. It demonstrates how text flows with increased spacing between lines.
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="text.secondary" mb="1">Short (1.2):</Text>
              <Text lineHeight="short">
                This is a paragraph with short line height. It demonstrates how text flows with reduced spacing between lines.
              </Text>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Spacing Section */}
      <Box as="section" p="lg" bg="bg.surface" borderRadius="lg">
        <Heading size="xl" mb="lg">Spacing</Heading>
        
        {/* Padding */}
        <Box mb="lg">
          <Heading size="md" mb="md">Padding</Heading>
          <Stack gap="sm">
            <Box bg="brand.100" p="xs" borderWidth="1px" borderColor="border.default">
              <Text fontSize="sm">xs: 4px (0.25rem)</Text>
            </Box>
            <Box bg="brand.200" p="sm" borderWidth="1px" borderColor="border.default">
              <Text fontSize="sm">sm: 8px (0.5rem)</Text>
            </Box>
            <Box bg="brand.300" p="md" borderWidth="1px" borderColor="border.default">
              <Text fontSize="sm">md: 16px (1rem)</Text>
            </Box>
            <Box bg="brand.400" p="lg" borderWidth="1px" borderColor="border.default">
              <Text fontSize="sm" color="white">lg: 24px (1.5rem)</Text>
            </Box>
            <Box bg="brand.500" p="xl" borderWidth="1px" borderColor="border.default">
              <Text fontSize="sm" color="white">xl: 32px (2rem)</Text>
            </Box>
            <Box bg="brand.600" p="2xl" borderWidth="1px" borderColor="border.default">
              <Text fontSize="sm" color="white">2xl: 48px (3rem)</Text>
            </Box>
            <Box bg="brand.700" p="3xl" borderWidth="1px" borderColor="border.default">
              <Text fontSize="sm" color="white">3xl: 64px (4rem)</Text>
            </Box>
          </Stack>
        </Box>

        {/* Margin */}
        <Box mb="lg">
          <Heading size="md" mb="md">Margin</Heading>
          <Box borderWidth="1px" borderColor="border.default" p="md">
            <Box bg="success.200" p="sm" mb="xs">
              <Text fontSize="sm">Margin Bottom: xs (4px)</Text>
            </Box>
            <Box bg="success.300" p="sm" mb="sm">
              <Text fontSize="sm">Margin Bottom: sm (8px)</Text>
            </Box>
            <Box bg="success.400" p="sm" mb="md">
              <Text fontSize="sm">Margin Bottom: md (16px)</Text>
            </Box>
            <Box bg="success.500" p="sm" mb="lg">
              <Text fontSize="sm" color="white">Margin Bottom: lg (24px)</Text>
            </Box>
            <Box bg="success.600" p="sm">
              <Text fontSize="sm" color="white">Margin Bottom: xl (32px)</Text>
            </Box>
          </Box>
        </Box>

        {/* Container */}
        <Box>
          <Heading size="md" mb="md">Container</Heading>
          <Stack gap="md">
            <Container maxW="sm" bg="warning.200" p="md" borderRadius="md">
              <Text fontSize="sm">Small Container (max-width: sm)</Text>
            </Container>
            <Container maxW="md" bg="warning.300" p="md" borderRadius="md">
              <Text fontSize="sm">Medium Container (max-width: md)</Text>
            </Container>
            <Container maxW="lg" bg="warning.400" p="md" borderRadius="md">
              <Text fontSize="sm">Large Container (max-width: lg)</Text>
            </Container>
          </Stack>
        </Box>
      </Box>

      {/* Colors Section */}
      <Box as="section" p="lg" bg="bg.surface" borderRadius="lg">
        <Heading size="xl" mb="lg">Base Colors (Semantic)</Heading>
        
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="md">
          {/* bg.canvas */}
          <Box borderWidth="1px" borderColor="border.default" borderRadius="md" overflow="hidden">
            <Box bg="bg.canvas" h="20" borderBottomWidth="1px" borderColor="border.default" />
            <Box p="md">
              <Text fontWeight="bold" mb="1">bg.canvas</Text>
              <Text fontSize="sm" color="text.secondary">Light: white</Text>
              <Text fontSize="sm" color="text.secondary">Dark: gray.900</Text>
            </Box>
          </Box>

          {/* bg.surface */}
          <Box borderWidth="1px" borderColor="border.default" borderRadius="md" overflow="hidden">
            <Box bg="bg.surface" h="20" borderBottomWidth="1px" borderColor="border.default" />
            <Box p="md">
              <Text fontWeight="bold" mb="1">bg.surface</Text>
              <Text fontSize="sm" color="text.secondary">Light: gray.50</Text>
              <Text fontSize="sm" color="text.secondary">Dark: gray.800</Text>
            </Box>
          </Box>

          {/* text.primary */}
          <Box borderWidth="1px" borderColor="border.default" borderRadius="md" overflow="hidden">
            <Box bg="text.primary" h="20" borderBottomWidth="1px" borderColor="border.default" />
            <Box p="md">
              <Text fontWeight="bold" mb="1">text.primary</Text>
              <Text fontSize="sm" color="text.secondary">Light: gray.900</Text>
              <Text fontSize="sm" color="text.secondary">Dark: gray.50</Text>
            </Box>
          </Box>

          {/* text.secondary */}
          <Box borderWidth="1px" borderColor="border.default" borderRadius="md" overflow="hidden">
            <Box bg="text.secondary" h="20" borderBottomWidth="1px" borderColor="border.default" />
            <Box p="md">
              <Text fontWeight="bold" mb="1">text.secondary</Text>
              <Text fontSize="sm" color="text.secondary">Light: gray.600</Text>
              <Text fontSize="sm" color="text.secondary">Dark: gray.400</Text>
            </Box>
          </Box>

          {/* border.default */}
          <Box borderWidth="1px" borderColor="border.default" borderRadius="md" overflow="hidden">
            <Box bg="border.default" h="20" borderBottomWidth="1px" borderColor="border.default" />
            <Box p="md">
              <Text fontWeight="bold" mb="1">border.default</Text>
              <Text fontSize="sm" color="text.secondary">Light: gray.200</Text>
              <Text fontSize="sm" color="text.secondary">Dark: gray.700</Text>
            </Box>
          </Box>
        </Grid>
      </Box>

      {/* Elements Section */}
      <Box as="section" p="lg" bg="bg.surface" borderRadius="lg">
        <Heading size="xl" mb="lg">UI Elements</Heading>
        
        {/* Headings (h1-h6) */}
        <Box mb="lg">
          <Heading size="md" mb="md">Headings (h1-h6 equivalents)</Heading>
          <Stack gap="sm">
            <Heading as="h1" size="2xl">H1 - Main Page Heading (size: 2xl)</Heading>
            <Heading as="h2" size="xl">H2 - Section Heading (size: xl)</Heading>
            <Heading as="h3" size="lg">H3 - Subsection Heading (size: lg)</Heading>
            <Heading as="h4" size="md">H4 - Minor Heading (size: md)</Heading>
            <Heading as="h5" size="sm">H5 - Small Heading (size: sm)</Heading>
            <Heading as="h6" size="xs">H6 - Tiny Heading (size: xs)</Heading>
          </Stack>
        </Box>

        {/* Paragraph */}
        <Box mb="lg">
          <Heading size="md" mb="md">Paragraph (Text component)</Heading>
          <Stack gap="sm">
            <Text>
              This is a default paragraph using the Text component. It uses the body font (Inter) and 
              has standard line height and spacing for optimal readability.
            </Text>
            <Text color="text.secondary">
              This is a secondary paragraph with muted text color, useful for less important information.
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              This is an emphasized paragraph with larger font size and bold weight.
            </Text>
          </Stack>
        </Box>

        {/* Input */}
        <Box mb="lg">
          <Heading size="md" mb="md">Input</Heading>
          <Stack gap="sm" maxW="md">
            <Input placeholder="Default input" />
            <Input placeholder="Input with border" variant="outline" />
            <Input placeholder="Disabled input" disabled />
            <Input placeholder="Input with value" defaultValue="Sample text" />
          </Stack>
        </Box>

        {/* Section */}
        <Box mb="lg">
          <Heading size="md" mb="md">Section (Box component)</Heading>
          <Box 
            as="section" 
            p="lg" 
            bg="bg.canvas" 
            borderWidth="1px" 
            borderColor="border.default" 
            borderRadius="md"
          >
            <Heading size="sm" mb="sm">Section Title</Heading>
            <Text>
              This demonstrates a section element using the Box component with semantic 'as' prop. 
              Sections help organize content into logical groupings.
            </Text>
          </Box>
        </Box>

        {/* Search Combobox */}
        <Box>
          <Heading size="md" mb="md">Search Combobox</Heading>
          <Box maxW="md">
            <SearchCombobox />
            <Text fontSize="xs" color="text.secondary" mt="2">
              Interactive search component using Chakra UI Combobox with filtering
            </Text>
          </Box>
        </Box>
      </Box>
    </Stack>
  )
}

const meta: Meta<typeof ThemeShowcase> = {
  title: 'Chakra UI/Showcase',
  component: ThemeShowcase,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ChakraProvider value={customSystem}>
        <Story />
      </ChakraProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ThemeShowcase>

export const Default: Story = {}


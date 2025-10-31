import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Button, Heading, Text, Stack, HStack, ChakraProvider } from '@chakra-ui/react'
import { customSystem } from '@/lib/chakra-theme'

const ThemeShowcase = () => {
  return (
    <Stack gap="xl" p="xl">
      <Box>
        <Heading size="2xl" mb="md">Theme Preview</Heading>
        <Text color="text.secondary">Custom Chakra UI theme configuration</Text>
      </Box>

      {/* Colors */}
      <Box>
        <Heading size="lg" mb="md">Brand Colors</Heading>
        <HStack gap="sm">
          <Button colorPalette="brand">Brand</Button>
          <Button colorPalette="success">Success</Button>
          <Button colorPalette="danger">Danger</Button>
          <Button colorPalette="warning">Warning</Button>
        </HStack>
      </Box>

      {/* Spacing */}
      <Box>
        <Heading size="lg" mb="md">Spacing (Padding)</Heading>
        <Stack gap="md">
          <Box bg="brand.100" p="xs">Padding XS (4px)</Box>
          <Box bg="brand.200" p="sm">Padding SM (8px)</Box>
          <Box bg="brand.300" p="md">Padding MD (16px)</Box>
          <Box bg="brand.400" p="lg">Padding LG (24px)</Box>
          <Box bg="brand.500" p="xl" color="white">Padding XL (32px)</Box>
        </Stack>
      </Box>

      {/* Border Radius */}
      <Box>
        <Heading size="lg" mb="md">Border Radius</Heading>
        <HStack gap="sm">
          <Box w="20" h="20" bg="success.500" borderRadius="sm" />
          <Box w="20" h="20" bg="success.500" borderRadius="md" />
          <Box w="20" h="20" bg="success.500" borderRadius="lg" />
          <Box w="20" h="20" bg="success.500" borderRadius="xl" />
          <Box w="20" h="20" bg="success.500" borderRadius="full" />
        </HStack>
      </Box>

      {/* Typography */}
      <Box>
        <Heading size="lg" mb="md">Typography</Heading>
        <Stack gap="sm">
          <Heading size="2xl">Heading 2XL</Heading>
          <Heading size="xl">Heading XL</Heading>
          <Heading size="lg">Heading LG</Heading>
          <Text fontSize="lg">Body Large</Text>
          <Text>Body Normal</Text>
          <Text fontSize="sm" color="text.secondary">Body Small - Secondary</Text>
        </Stack>
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


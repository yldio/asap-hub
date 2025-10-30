import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` },
        body: { value: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` },
        mono: { value: `'Fira Code', 'Courier New', monospace` },
      },
      colors: {
        brand: {
          50: { value: "#e6f2ff" },
          100: { value: "#baddff" },
          200: { value: "#8dc8ff" },
          300: { value: "#5bb3ff" },
          400: { value: "#2e9eff" },
          500: { value: "#0089ff" }, // Primary brand color
          600: { value: "#0070e0" },
          700: { value: "#0057b3" },
          800: { value: "#003f86" },
          900: { value: "#002759" },
        },
        success: {
          50: { value: "#e6f9f0" },
          100: { value: "#b3ecd5" },
          200: { value: "#80dfba" },
          300: { value: "#4dd29f" },
          400: { value: "#1ac584" },
          500: { value: "#00b86b" }, // Success color
          600: { value: "#009557" },
          700: { value: "#007243" },
          800: { value: "#004f2f" },
          900: { value: "#002c1b" },
        },
        danger: {
          50: { value: "#ffe6e6" },
          100: { value: "#ffb3b3" },
          200: { value: "#ff8080" },
          300: { value: "#ff4d4d" },
          400: { value: "#ff1a1a" },
          500: { value: "#e60000" }, // Error color
          600: { value: "#cc0000" },
          700: { value: "#990000" },
          800: { value: "#660000" },
          900: { value: "#330000" },
        },
        warning: {
          50: { value: "#fff9e6" },
          100: { value: "#ffecb3" },
          200: { value: "#ffdf80" },
          300: { value: "#ffd24d" },
          400: { value: "#ffc51a" },
          500: { value: "#ffb800" }, // Warning color
          600: { value: "#e0a300" },
          700: { value: "#b38200" },
          800: { value: "#866200" },
          900: { value: "#594100" },
        },
      },
      spacing: {
        // Custom spacing values
        xs: { value: "0.25rem" }, // 4px
        sm: { value: "0.5rem" },  // 8px
        md: { value: "1rem" },    // 16px
        lg: { value: "1.5rem" },  // 24px
        xl: { value: "2rem" },    // 32px
        "2xl": { value: "3rem" }, // 48px
        "3xl": { value: "4rem" }, // 64px
      },
      radii: {
        xs: { value: "0.125rem" }, // 2px
        sm: { value: "0.25rem" },  // 4px
        md: { value: "0.375rem" }, // 6px
        lg: { value: "0.5rem" },   // 8px
        xl: { value: "0.75rem" },  // 12px
        "2xl": { value: "1rem" },  // 16px
        full: { value: "9999px" },
      },
    },
    semanticTokens: {
      colors: {
        // Semantic colors - automatic dark mode support
        "bg.canvas": {
          value: {
            base: "{colors.white}",
            _dark: "{colors.gray.900}",
          },
        },
        "bg.surface": {
          value: {
            base: "{colors.gray.50}",
            _dark: "{colors.gray.800}",
          },
        },
        "text.primary": {
          value: {
            base: "{colors.gray.900}",
            _dark: "{colors.gray.50}",
          },
        },
        "text.secondary": {
          value: {
            base: "{colors.gray.600}",
            _dark: "{colors.gray.400}",
          },
        },
        "border.default": {
          value: {
            base: "{colors.gray.200}",
            _dark: "{colors.gray.700}",
          },
        },
      },
    },
  },
  globalCss: {
    // Global CSS styles
    body: {
      bg: "bg.canvas",
      color: "text.primary",
      fontFamily: "body",
    },
    // Default margin/padding reset
    "h1, h2, h3, h4, h5, h6": {
      fontFamily: "heading",
      fontWeight: "bold",
      lineHeight: "1.2",
    },
  },
})

// Create custom system
export const customSystem = createSystem(defaultConfig, customConfig)


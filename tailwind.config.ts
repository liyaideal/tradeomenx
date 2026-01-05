import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        /* === Core Semantic Colors === */
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          lighter: "hsl(var(--primary-lighter))",
          darker: "hsl(var(--primary-darker))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          cyan: "hsl(var(--accent-cyan))",
          "cyan-light": "hsl(var(--accent-cyan-light))",
          pink: "hsl(var(--accent-pink))",
          "pink-light": "hsl(var(--accent-pink-light))",
          amber: "hsl(var(--accent-amber))",
          emerald: "hsl(var(--accent-emerald))",
          blue: "hsl(var(--accent-blue))",
          "purple-light": "hsl(var(--accent-purple-light))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* === Functional Colors === */
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          light: "hsl(var(--error-light))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          light: "hsl(var(--warning-light))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          light: "hsl(var(--info-light))",
        },

        /* === Trading Colors === */
        trading: {
          green: "hsl(var(--trading-green))",
          "green-muted": "hsl(var(--trading-green-muted))",
          red: "hsl(var(--trading-red))",
          "red-muted": "hsl(var(--trading-red-muted))",
          purple: "hsl(var(--trading-purple))",
          "purple-muted": "hsl(var(--trading-purple-muted))",
          yellow: "hsl(var(--trading-yellow))",
        },

        /* === Glass Colors === */
        glass: {
          primary: "hsl(var(--glass-primary) / <alpha-value>)",
          secondary: "hsl(var(--glass-secondary) / <alpha-value>)",
          elevated: "hsl(var(--glass-elevated) / <alpha-value>)",
          inset: "hsl(var(--glass-inset) / <alpha-value>)",
          strong: "hsl(var(--glass-strong) / <alpha-value>)",
        },

        /* === Indicator === */
        indicator: {
          DEFAULT: "hsl(var(--indicator))",
          muted: "hsl(var(--indicator-muted))",
        },

        /* === Chart Colors === */
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md: "var(--radius)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        /* === Glass Shadows === */
        "glass-sm": "0 4px 24px hsl(var(--shadow-color) / 0.25)",
        "glass": "0 8px 32px hsl(var(--shadow-color) / 0.35), 0 0 24px hsl(var(--glow-primary) / 0.15)",
        "glass-lg": "0 12px 48px hsl(var(--shadow-color) / 0.45), 0 0 32px hsl(var(--glow-primary) / 0.25)",
        "glass-xl": "0 16px 64px hsl(var(--shadow-color) / 0.5), 0 8px 24px hsl(var(--glow-primary) / 0.3)",
        /* === Glow Effects === */
        "glow-primary": "0 0 20px hsl(var(--glow-primary) / 0.4)",
        "glow-cyan": "0 0 24px hsl(var(--glow-cyan) / 0.3)",
        "glow-pink": "0 0 24px hsl(var(--glow-pink) / 0.3)",
        "glow-success": "0 0 16px hsl(var(--glow-success) / 0.3)",
        "glow-error": "0 0 16px hsl(var(--glow-error) / 0.3)",
        /* === Inset Shadow === */
        "inset-glass": "inset 0 2px 8px hsl(var(--shadow-color) / 0.2)",
      },
      backdropBlur: {
        "glass-sm": "8px",
        "glass": "16px",
        "glass-lg": "24px",
        "glass-xl": "40px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--glow-primary) / 0.3)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--glow-primary) / 0.5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

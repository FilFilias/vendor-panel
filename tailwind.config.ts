
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
		"./app/**/*.{js,jsx,ts,tsx}", // All files in the app directory
		"./pages/**/*.{js,jsx,ts,tsx}", // All files in the pages directory (if applicable)
		"./components/**/*.{js,jsx,ts,tsx}", // All files in the components directory
		"./layouts/**/*.{js,jsx,ts,tsx}", // All files in the layouts directory (if applicable)
		"./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}" // Existing pattern for app-specific files
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
			fontFamily: {
				sans: ['Rubik', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				// Regular sizes
				'body': ['16px', '24px'],
				'small': ['14px', '20px'],
				'label': ['12px', '16px'],
				// Heading sizes for desktop
				'h1': ['32px', '40px'],
				'h2': ['24px', '32px'],
				'h3': ['20px', '28px'],
				'h4': ['16px', '24px'],
				// Responsive sizes for tablet
				'tablet-h1': ['28px', '36px'],
				'tablet-h2': ['22px', '30px'],
				'tablet-h3': ['18px', '26px'],
				// Responsive sizes for mobile
				'mobile-h1': ['24px', '32px'],
				'mobile-h2': ['20px', '28px'],
				'mobile-h3': ['16px', '24px'],
			},
			fontWeight: {
				regular: '400',
				medium: '500',
				semibold: '600',
				bold: '700',
			},
			colors: {
				border: '#E5E7EB',
				input: '#F3F4F6',
				ring: '#D1D5DB',
				background: '#FFFFFF',
				foreground: '#111827',
				main: "#1F2A37",
				primary: {
					DEFAULT: '#19315B',
					foreground: '#FFFFFF'
				},
				orange: {
					DEFAULT: '#EBA521',
					foreground: '#FFFFFF'
				},
				orange_hover: {
					DEFAULT: '#C6891B',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#4B5563',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F9FAFB',
					foreground: '#6B7280'
				},
				accent: {
					DEFAULT: '#EBA521',
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: '#F9FAFB',
					foreground: '#111827'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#111827'
				},
				success: {
					DEFAULT: '#59f3a6',
					foreground: '#FFFFFF'
				},
				sidebar: {
					DEFAULT: '#1A1F2C',
					foreground: '#FFFFFF',
					primary: '#6366F1',
					'primary-foreground': '#FFFFFF',
					accent: '#10B981',
					'accent-foreground': '#FFFFFF',
					border: '#374151',
					ring: '#4B5563'
				},
				neutral: '#6B7280'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
    }
  },
} satisfies Config;

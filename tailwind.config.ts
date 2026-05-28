import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:    '#C94A3F',
        background: '#F1EFE8',
        accent:     '#C0DD97',
        green: {
          dark:   '#2D6A2D',
          base:   '#3B6D11',
          medium: '#639922',
          warm:   '#BA7517',
        },
      },
      borderRadius: {
        sm:  '8px',
        md:  '10px',
        lg:  '12px',
      },
      spacing: {
        xs:  '4px',
        sm:  '8px',
        md:  '16px',
        lg:  '24px',
        xl:  '32px',
        xxl: '48px',
      },
      fontSize: {
        xs:   ['12px', { lineHeight: '16px' }],
        sm:   ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg:   ['18px', { lineHeight: '28px' }],
        xl:   ['20px', { lineHeight: '30px' }],
        '2xl':['24px', { lineHeight: '32px' }],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.08)',
        md:   '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
export default config
export const theme = {
    colors: {
      primary: '#14b8a6',      
      secondary: '#f59e0b',   
  
      background: {
        dark: '#1a1a1a',
        light: '#ffffff',
      },
      surface: {
        dark: '#242424',
        light: '#f5f5f3',
      },
      border: {
        dark: 'rgba(255,255,255,0.1)',
        light: 'rgba(0,0,0,0.1)',
      },
      text: {
        dark: '#f0efe9',
        light: '#1a1a18',
        muted: '#888780',
      },
  
      status: {
        visited:     { bg: '#166534', text: '#86efac' },   
        wantToVisit: { bg: '#78350f', text: '#fcd34d' },   
        livingThere: { bg: '#1e3a5f', text: '#93c5fd' },   
      },
    },
  
    tw: {
      primary:   'text-teal-400',
      primaryBg: 'bg-teal-500',
      primaryBorder: 'border-teal-500',
      primaryHover: 'hover:bg-teal-600',

      secondary:   'text-amber-400',
      secondaryBg: 'bg-amber-500',
      secondaryBorder: 'border-amber-500',
      secondaryHover: 'hover:bg-amber-600',
  
      surface:   'bg-gray-50 dark:bg-[#242424]',
      page:      'bg-[#f5f5f3] dark:bg-[#1a1a1a]',
      border:    'border-gray-100 dark:border-gray-800',
      textMuted: 'text-gray-400',

      navActive:  'bg-gray-100 dark:bg-[#242424] text-gray-900 dark:text-[#f0efe9] font-medium',
      navInactive: 'text-gray-400 hover:text-gray-900 dark:hover:text-[#f0efe9] hover:bg-gray-50 dark:hover:bg-[#242424]',
    },
  }
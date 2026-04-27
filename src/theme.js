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

    map: {
      background: '#e8e8e8',
    },

    legend: {
      visited:     '#16a34a',
      wantToVisit: '#f59e0b',
      livingThere: '#3b82f6',
    },
  },

  tw: {
    // primary
    primary:       'text-teal-400',
    primaryBg:     'bg-teal-500',
    primaryBorder: 'border-teal-500',
    primaryHover:  'hover:bg-teal-600',
    primaryText:   'text-teal-500',

    // secondary
    secondary:       'text-amber-400',
    secondaryBg:     'bg-amber-500',
    secondaryBorder: 'border-amber-500',
    secondaryHover:  'hover:bg-amber-600',

    // surfaces
    surface:     'bg-gray-50 dark:bg-[#242424]',
    surfaceSunk: 'bg-gray-100 dark:bg-[#1a1a1a]',
    page:        'bg-[#f5f5f3] dark:bg-[#1a1a1a]',

    // borders
    border:        'border border-gray-100 dark:border-gray-800',
    borderDivider: 'border-gray-100 dark:border-gray-800',
    dividerX:      'w-px h-5 bg-gray-200 dark:bg-gray-700',

    // text
    textMain:  'text-gray-900 dark:text-[#f0efe9]',
    textMuted: 'text-gray-400',
    textHint:  'text-gray-300 dark:text-gray-600',

    // nav
    navActive:   'bg-gray-100 dark:bg-[#242424] text-gray-900 dark:text-[#f0efe9] font-medium',
    navInactive: 'text-gray-400 hover:text-gray-900 dark:hover:text-[#f0efe9] hover:bg-gray-50 dark:hover:bg-[#242424]',

    // pills
    pillActive: 'bg-teal-500 text-white',

    // tabs
    tabActive:   'border-teal-500 text-teal-500 font-medium',
    tabInactive: 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-[#f0efe9]',
    tabFuture:   'border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed',

    // cards
    card:        'bg-gray-50 dark:bg-[#242424] border border-gray-100 dark:border-gray-800 rounded-xl',
    cardInner:   'bg-white dark:bg-[#1a1a1a]',
    cardHover:   'hover:bg-gray-100 dark:hover:bg-[#2e2e2e]',

    // status dots
    dotDone:    'bg-green-500',
    dotPending: 'bg-gray-300 dark:bg-gray-600',

    // buttons
    btnSecondary: 'border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
    btnDisabled:  'opacity-40 cursor-not-allowed',

    // stats
    statVisited:  'text-green-600 dark:text-green-400',
    statWant:     'text-amber-500 dark:text-amber-400',
    statItems:    'text-blue-600 dark:text-blue-400',
    statDone:     'text-gray-500 dark:text-gray-400',
  },
}
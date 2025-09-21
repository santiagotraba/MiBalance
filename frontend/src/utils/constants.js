export const TRANSACTION_TYPES = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE'
}

export const CATEGORY_TYPES = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE'
}

export const TRANSACTION_TYPE_LABELS = {
    [TRANSACTION_TYPES.INCOME]: 'Ingreso',
    [TRANSACTION_TYPES.EXPENSE]: 'Gasto'
}

export const CATEGORY_TYPE_LABELS = {
    [CATEGORY_TYPES.INCOME]: 'Ingreso',
    [CATEGORY_TYPES.EXPENSE]: 'Gasto'
}

export const DEFAULT_CATEGORY_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6B7280', // Gray
]

export const CATEGORY_ICONS = [
    'briefcase',
    'code',
    'trending-up',
    'shopping-bag',
    'utensils',
    'car',
    'film',
    'heart',
    'book',
    'home',
    'shirt',
    'more-horizontal',
    'gift',
    'coffee',
    'plane',
    'gamepad2',
    'music',
    'camera',
    'smartphone',
    'laptop'
]

export const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const DAYS_OF_WEEK = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
]

export const PAGINATION_LIMITS = [10, 20, 50, 100]

export const DEFAULT_PAGINATION_LIMIT = 20

export const DATE_FORMATS = {
    SHORT: 'dd/MM/yyyy',
    LONG: 'dd \'de\' MMMM \'de\' yyyy',
    MONTH_YEAR: 'MMMM yyyy',
    TIME: 'HH:mm',
    DATETIME: 'dd/MM/yyyy HH:mm'
}

export const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    UYU: '$U'
}

export const SUPPORTED_CURRENCIES = [
    { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
    { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
    { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
    { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
    { code: 'PEN', name: 'Sol Peruano', symbol: 'S/' },
    { code: 'UYU', name: 'Peso Uruguayo', symbol: '$U' }
]

export const CHART_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6B7280', // Gray
    '#F43F5E', // Rose
    '#A855F7', // Violet
    '#0EA5E9', // Sky
    '#22C55E', // Emerald
    '#EAB308', // Amber
]

export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
}

export const TOAST_DURATION = {
    SHORT: 2000,
    MEDIUM: 4000,
    LONG: 6000
}

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        VERIFY: '/auth/verify'
    },
    USERS: {
        PROFILE: '/users/profile',
        STATS: '/users/stats'
    },
    TRANSACTIONS: '/transactions',
    CATEGORIES: '/categories',
    SAVINGS_GOALS: '/savings-goals',
    BUDGETS: '/budgets',
    ANALYTICS: {
        BALANCE: '/analytics/balance',
        CATEGORIES: '/analytics/categories',
        MONTHLY_TRENDS: '/analytics/monthly-trends',
        RECENT_TRANSACTIONS: '/analytics/recent-transactions',
        SAVINGS_STATS: '/analytics/savings-stats'
    }
}

export const ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/',
    TRANSACTIONS: '/transactions',
    CATEGORIES: '/categories',
    REPORTS: '/reports',
    SAVINGS_GOALS: '/savings-goals',
    BUDGETS: '/budgets',
    SETTINGS: '/settings'
}

export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    CURRENCY: 'currency',
    LANGUAGE: 'language'
}

export const VALIDATION_RULES = {
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
    AMOUNT_MIN: 0.01,
    AMOUNT_MAX: 999999.99
}

export const DEBOUNCE_DELAY = 300

export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
}

import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

export const formatNumber = (number, decimals = 2) => {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(number)
}

export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
    if (!date) return ''

    const dateObj = typeof date === 'string' ? parseISO(date) : date

    if (!isValid(dateObj)) return ''

    return format(dateObj, formatString, { locale: es })
}

export const formatDateLong = (date) => {
    return formatDate(date, 'dd \'de\' MMMM \'de\' yyyy')
}

export const formatDateShort = (date) => {
    return formatDate(date, 'dd/MM/yy')
}

export const formatMonthYear = (date) => {
    return formatDate(date, 'MMMM yyyy')
}

export const formatRelativeTime = (date) => {
    if (!date) return ''

    const dateObj = typeof date === 'string' ? parseISO(date) : date

    if (!isValid(dateObj)) return ''

    const now = new Date()
    const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Hoy'
    if (diffInDays === 1) return 'Ayer'
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`
    if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`

    return `Hace ${Math.floor(diffInDays / 365)} años`
}

export const formatPercentage = (value, decimals = 1) => {
    return `${formatNumber(value, decimals)}%`
}

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const truncateText = (text, maxLength = 50) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (text) => {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const getInitials = (name) => {
    if (!name) return ''
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2)
}

export const formatTransactionType = (type) => {
    const types = {
        INCOME: 'Ingreso',
        EXPENSE: 'Gasto'
    }
    return types[type] || type
}

export const formatCategoryType = (type) => {
    const types = {
        INCOME: 'Ingreso',
        EXPENSE: 'Gasto'
    }
    return types[type] || type
}

export const getTransactionTypeColor = (type) => {
    const colors = {
        INCOME: 'text-green-600',
        EXPENSE: 'text-red-600'
    }
    return colors[type] || 'text-gray-600'
}

export const getTransactionTypeBgColor = (type) => {
    const colors = {
        INCOME: 'bg-green-100',
        EXPENSE: 'bg-red-100'
    }
    return colors[type] || 'bg-gray-100'
}
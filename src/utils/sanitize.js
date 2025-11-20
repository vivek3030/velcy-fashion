import DOMPurify from 'dompurify'

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [], // Strip all HTML tags
        ALLOWED_ATTR: []  // Strip all attributes
    })
}

/**
 * Sanitizes HTML content while allowing safe tags
 * @param {string} html - HTML content
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHTML = (html) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: []
    })
}

/**
 * Validates email format
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validates phone number (10 digits)
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone)
}

/**
 * Validates PIN code (6 digits)
 * @param {string} pincode
 * @returns {boolean}
 */
export const validatePincode = (pincode) => {
    const pincodeRegex = /^[0-9]{6}$/
    return pincodeRegex.test(pincode)
}

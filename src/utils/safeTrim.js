// safeTrim.js

/**
 * Safely trims whitespace from a string.
 * @param {string} str - The string to trim.
 * @returns {string} - The trimmed string, or an empty string if the input is null or undefined.
 */
function safeTrim(str) {
    if (typeof str === 'string') {
        return str.trim();
    }
    return ''; // Return an empty string if input is non-string
}

module.exports = safeTrim;
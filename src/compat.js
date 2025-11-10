/**
 * Compatibility wrapper for iran-hijri library
 * Provides the same API as hijri-converter--jal for easy migration
 */

const iranHijri = require('./index');

/**
 * Convert Gregorian date to Hijri (Iranian official data when available)
 * @param {number} gy - Gregorian year
 * @param {number} gm - Gregorian month (1-12)
 * @param {number} gd - Gregorian day
 * @returns {Object} { hy, hm, hd } - Hijri date
 */
function toHijri(gy, gm, gd) {
  const result = iranHijri.gregorianToHijri(gy, gm, gd);
  return {
    hy: result.hy,
    hm: result.hm,
    hd: result.hd
  };
}

/**
 * Convert Hijri date to Gregorian
 * @param {number} hy - Hijri year
 * @param {number} hm - Hijri month (1-12)
 * @param {number} hd - Hijri day
 * @returns {Object} { gy, gm, gd } - Gregorian date
 */
function toGregorian(hy, hm, hd) {
  const result = iranHijri.hijriToGregorian(hy, hm, hd);
  return {
    gy: result.gy,
    gm: result.gm,
    gd: result.gd
  };
}

module.exports = {
  toHijri,
  toGregorian,
  // Export the full library for advanced usage
  iranHijri
};

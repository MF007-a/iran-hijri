/**
 * Iran Hijri Converter
 * 
 * A library for converting between Iranian (Jalaali/Persian), Gregorian, and Hijri calendars.
 * 
 * Key features:
 * - Prioritizes official Iranian Hijri data when available
 * - Falls back to tabular (arithmetic) Hijri calculations for dates outside official range
 * - Supports conversions between all three calendar systems
 * - Flexible and extensible official data structure
 */

const officialData = require('./officialData');
const tabular = require('./tabular');
const utils = require('./utils');

/**
 * Convert Jalaali date to Hijri date
 * @param {number} jy - Jalaali year
 * @param {number} jm - Jalaali month (1-12)
 * @param {number} jd - Jalaali day
 * @returns {Object} Object with hy, hm, hd properties and metadata
 */
function jalaaliToHijri(jy, jm, jd) {
  if (!utils.isValidJalaaliDate(jy, jm, jd)) {
    throw new Error(`Invalid Jalaali date: ${jy}/${jm}/${jd}`);
  }
  
  // Convert Jalaali to Julian Day Number
  const julianDay = utils.jalaaliToJulian(jy, jm, jd);
  
  // First, try using tabular to get approximate Hijri date
  const approximateHijri = tabular.julianToHijriTabular(julianDay);
  
  // Check if we have official data for this approximate date or nearby dates
  let hijriDate = null;
  let usedOfficialData = false;
  
  // Try the approximate date and a few days around it
  for (let yearOffset = -1; yearOffset <= 1; yearOffset++) {
    const testYear = approximateHijri.hy + yearOffset;
    if (officialData.hasOfficialData(testYear)) {
      // We have official data for this year, so we need to use it
      hijriDate = julianToHijriWithOfficialData(julianDay, testYear);
      if (hijriDate) {
        usedOfficialData = true;
        break;
      }
    }
  }
  
  // If no official data found, use the tabular result
  if (!hijriDate) {
    hijriDate = approximateHijri;
  }
  
  return {
    hy: hijriDate.hy,
    hm: hijriDate.hm,
    hd: hijriDate.hd,
    source: usedOfficialData ? 'official' : 'tabular',
    weekday: {
      ar: utils.getArabicWeekday(julianDay),
      fa: utils.getPersianWeekday(julianDay),
      en: utils.getEnglishWeekday(julianDay),
      number: utils.getWeekdayNumber(julianDay)
    }
  };
}

/**
 * Convert Gregorian date to Hijri date
 * @param {number} gy - Gregorian year
 * @param {number} gm - Gregorian month (1-12)
 * @param {number} gd - Gregorian day
 * @returns {Object} Object with hy, hm, hd properties and metadata
 */
function gregorianToHijri(gy, gm, gd) {
  if (!utils.isValidGregorianDate(gy, gm, gd)) {
    throw new Error(`Invalid Gregorian date: ${gy}/${gm}/${gd}`);
  }
  
  // Convert Gregorian to Julian Day Number
  const julianDay = utils.gregorianToJulian(gy, gm, gd);
  
  // First, try using tabular to get approximate Hijri date
  const approximateHijri = tabular.julianToHijriTabular(julianDay);
  
  // Check if we have official data for this approximate date or nearby dates
  let hijriDate = null;
  let usedOfficialData = false;
  
  // Try the approximate date and a few days around it
  for (let yearOffset = -1; yearOffset <= 1; yearOffset++) {
    const testYear = approximateHijri.hy + yearOffset;
    if (officialData.hasOfficialData(testYear)) {
      // We have official data for this year, so we need to use it
      hijriDate = julianToHijriWithOfficialData(julianDay, testYear);
      if (hijriDate) {
        usedOfficialData = true;
        break;
      }
    }
  }
  
  // If no official data found, use the tabular result
  if (!hijriDate) {
    hijriDate = approximateHijri;
  }
  
  return {
    hy: hijriDate.hy,
    hm: hijriDate.hm,
    hd: hijriDate.hd,
    source: usedOfficialData ? 'official' : 'tabular',
    weekday: {
      ar: utils.getArabicWeekday(julianDay),
      fa: utils.getPersianWeekday(julianDay),
      en: utils.getEnglishWeekday(julianDay),
      number: utils.getWeekdayNumber(julianDay)
    }
  };
}

/**
 * Convert Hijri date to Jalaali date
 * @param {number} hy - Hijri year
 * @param {number} hm - Hijri month (1-12)
 * @param {number} hd - Hijri day
 * @returns {Object} Object with jy, jm, jd properties and metadata
 */
function hijriToJalaali(hy, hm, hd) {
  if (!utils.isValidHijriDate(hy, hm, hd)) {
    throw new Error(`Invalid Hijri date: ${hy}/${hm}/${hd}`);
  }
  
  let julianDay;
  let usedOfficialData = false;
  
  // Check if we have official data for this Hijri date
  if (officialData.hasOfficialData(hy, hm)) {
    julianDay = hijriToJulianWithOfficialData(hy, hm, hd);
    usedOfficialData = true;
  } else {
    // Use tabular calculation
    julianDay = tabular.hijriToJulianTabular(hy, hm, hd);
  }
  
  // Convert Julian Day to Jalaali
  const jalaaliDate = utils.julianToJalaali(julianDay);
  
  return {
    jy: jalaaliDate.jy,
    jm: jalaaliDate.jm,
    jd: jalaaliDate.jd,
    source: usedOfficialData ? 'official' : 'tabular',
    weekday: {
      ar: utils.getArabicWeekday(julianDay),
      fa: utils.getPersianWeekday(julianDay),
      en: utils.getEnglishWeekday(julianDay),
      number: utils.getWeekdayNumber(julianDay)
    }
  };
}

/**
 * Convert Hijri date to Gregorian date
 * @param {number} hy - Hijri year
 * @param {number} hm - Hijri month (1-12)
 * @param {number} hd - Hijri day
 * @returns {Object} Object with gy, gm, gd properties and metadata
 */
function hijriToGregorian(hy, hm, hd) {
  if (!utils.isValidHijriDate(hy, hm, hd)) {
    throw new Error(`Invalid Hijri date: ${hy}/${hm}/${hd}`);
  }
  
  let julianDay;
  let usedOfficialData = false;
  
  // Check if we have official data for this Hijri date
  if (officialData.hasOfficialData(hy, hm)) {
    julianDay = hijriToJulianWithOfficialData(hy, hm, hd);
    usedOfficialData = true;
  } else {
    // Use tabular calculation
    julianDay = tabular.hijriToJulianTabular(hy, hm, hd);
  }
  
  // Convert Julian Day to Gregorian
  const gregorianDate = utils.julianToGregorian(julianDay);
  
  return {
    gy: gregorianDate.gy,
    gm: gregorianDate.gm,
    gd: gregorianDate.gd,
    source: usedOfficialData ? 'official' : 'tabular',
    weekday: {
      ar: utils.getArabicWeekday(julianDay),
      fa: utils.getPersianWeekday(julianDay),
      en: utils.getEnglishWeekday(julianDay),
      number: utils.getWeekdayNumber(julianDay)
    }
  };
}

/**
 * Helper: Convert Hijri date to Julian Day using official data
 * @param {number} hy - Hijri year
 * @param {number} hm - Hijri month
 * @param {number} hd - Hijri day
 * @returns {number} Julian Day Number
 */
function hijriToJulianWithOfficialData(hy, hm, hd) {
  const range = officialData.getOfficialDataRange();
  if (!range || hy < range.minYear || hy > range.maxYear) {
    throw new Error(`No official data for Hijri year ${hy}`);
  }
  
  // We need a reference point. Let's use the start of the official data range
  // and calculate forward/backward from there using official month lengths
  
  // First, get a reference Julian Day using tabular for the start of official range
  const referenceJulian = tabular.hijriToJulianTabular(range.minYear, 1, 1);
  
  let daysFromReference = 0;
  
  if (hy === range.minYear && hm === 1) {
    // We're in the first month of the range
    daysFromReference = hd - 1;
  } else if (hy === range.minYear) {
    // Same year as range start, but later month
    for (let m = 1; m < hm; m++) {
      daysFromReference += officialData.getOfficialMonthLength(hy, m);
    }
    daysFromReference += hd - 1;
  } else {
    // Later year - add complete years first
    for (let y = range.minYear; y < hy; y++) {
      const yearLength = officialData.getOfficialYearLength(y);
      if (yearLength === null) {
        throw new Error(`Missing official data for year ${y}`);
      }
      daysFromReference += yearLength;
    }
    
    // Add complete months in target year
    for (let m = 1; m < hm; m++) {
      daysFromReference += officialData.getOfficialMonthLength(hy, m);
    }
    
    // Add days in current month
    daysFromReference += hd - 1;
  }
  
  return referenceJulian + daysFromReference;
}

/**
 * Helper: Convert Julian Day to Hijri date using official data
 * @param {number} julianDay - Julian Day Number
 * @param {number} nearYear - A Hijri year to start searching from
 * @returns {Object|null} Hijri date object or null if outside official range
 */
function julianToHijriWithOfficialData(julianDay, nearYear) {
  const range = officialData.getOfficialDataRange();
  if (!range) return null;
  
  // Get reference point at start of official data
  const referenceJulian = tabular.hijriToJulianTabular(range.minYear, 1, 1);
  let daysFromReference = julianDay - referenceJulian;
  
  if (daysFromReference < 0) {
    // Before official range
    return null;
  }
  
  // Walk through years in official data
  let currentYear = range.minYear;
  while (currentYear <= range.maxYear) {
    const yearLength = officialData.getOfficialYearLength(currentYear);
    if (yearLength === null) break;
    
    if (daysFromReference < yearLength) {
      // The date is in this year
      let currentMonth = 1;
      while (currentMonth <= 12) {
        const monthLength = officialData.getOfficialMonthLength(currentYear, currentMonth);
        if (daysFromReference < monthLength) {
          // Found the month
          return {
            hy: currentYear,
            hm: currentMonth,
            hd: daysFromReference + 1
          };
        }
        daysFromReference -= monthLength;
        currentMonth++;
      }
      // Shouldn't reach here
      break;
    }
    
    daysFromReference -= yearLength;
    currentYear++;
  }
  
  // Outside official range
  return null;
}

/**
 * Get information about the conversion source for a date
 * @param {number} hy - Hijri year
 * @param {number} hm - Hijri month (optional)
 * @returns {Object} Information about data source
 */
function getSourceInfo(hy, hm = 1) {
  const hasOfficial = officialData.hasOfficialData(hy, hm);
  const range = officialData.getOfficialDataRange();
  
  return {
    hasOfficialData: hasOfficial,
    source: hasOfficial ? 'official' : 'tabular',
    officialDataRange: range
  };
}

module.exports = {
  jalaaliToHijri,
  gregorianToHijri,
  hijriToJalaali,
  hijriToGregorian,
  getSourceInfo,
  
  // Re-export utility functions for convenience
  isValidHijriDate: utils.isValidHijriDate,
  isValidJalaaliDate: utils.isValidJalaaliDate,
  isValidGregorianDate: utils.isValidGregorianDate,
  
  // Re-export for advanced usage
  officialData,
  tabular,
  utils
};

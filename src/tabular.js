/**
 * Tabular Hijri Calendar Calculations
 * 
 * This module implements the tabular (arithmetic) Islamic calendar system
 * used for calculating Hijri dates when official data is not available.
 * 
 * The tabular calendar uses a 30-year cycle where:
 * - 19 years are "normal" with 354 days
 * - 11 years are "leap" with 355 days (an extra day in Dhul-Hijjah, the 12th month)
 * 
 * Leap years in the cycle: 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29
 */

// Hijri epoch: July 19, 622 CE (Gregorian) - Using Iranian convention to match Bahesab
// This corresponds to Friday, 1 Muharram 1 AH
const HIJRI_EPOCH = 1948440; // Julian Day Number for 1 Muharram 1 AH

// 30-year cycle: leap years (1-indexed within each 30-year cycle)
const LEAP_YEARS_IN_CYCLE = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];

// Month lengths in tabular calendar
// First 11 months alternate between 30 and 29 days
// 12th month is 29 days (30 in leap years)
const TABULAR_MONTH_LENGTHS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

/**
 * Check if a Hijri year is a leap year in the tabular system
 * @param {number} year - Hijri year
 * @returns {boolean} True if leap year
 */
function isTabularLeapYear(year) {
  const yearInCycle = ((year - 1) % 30) + 1;
  return LEAP_YEARS_IN_CYCLE.includes(yearInCycle);
}

/**
 * Get the number of days in a specific Hijri month using tabular calculation
 * @param {number} year - Hijri year
 * @param {number} month - Hijri month (1-12)
 * @returns {number} Number of days (29 or 30)
 */
function getTabularMonthLength(year, month) {
  if (month < 1 || month > 12) {
    throw new Error('Invalid month: must be between 1 and 12');
  }
  
  // For months 1-11, use the standard pattern
  if (month < 12) {
    return TABULAR_MONTH_LENGTHS[month - 1];
  }
  
  // For month 12 (Dhul-Hijjah), check if it's a leap year
  return isTabularLeapYear(year) ? 30 : 29;
}

/**
 * Get the total number of days in a Hijri year using tabular calculation
 * @param {number} year - Hijri year
 * @returns {number} Total days in year (354 or 355)
 */
function getTabularYearLength(year) {
  return isTabularLeapYear(year) ? 355 : 354;
}

/**
 * Calculate the total number of days from Hijri epoch (1/1/1 AH) to a given date
 * @param {number} year - Hijri year
 * @param {number} month - Hijri month (1-12)
 * @param {number} day - Hijri day (1-30)
 * @returns {number} Total days from epoch
 */
function getDaysFromEpochTabular(year, month, day) {
  if (year < 1 || year > 5000) {
    throw new Error('Year must be between 1 and 5000');
  }
  
  let totalDays = 0;
  
  // Calculate days for complete years before the target year
  const completeYears = year - 1;
  
  // Each 30-year cycle has: (19 × 354) + (11 × 355) = 6726 + 3905 = 10631 days
  const completeCycles = Math.floor(completeYears / 30);
  totalDays += completeCycles * 10631;
  
  // Add days for remaining years in the incomplete cycle
  const remainingYears = completeYears % 30;
  for (let y = 1; y <= remainingYears; y++) {
    totalDays += getTabularYearLength(y);
  }
  
  // Add days for complete months in the target year
  for (let m = 1; m < month; m++) {
    totalDays += getTabularMonthLength(year, m);
  }
  
  // Add the days in the current month
  totalDays += day - 1; // -1 because day 1 is the start (0 days elapsed)
  
  return totalDays;
}

/**
 * Convert days from Hijri epoch to a Hijri date
 * @param {number} daysFromEpoch - Number of days from Hijri epoch
 * @returns {Object} Object with hy, hm, hd properties
 */
function daysFromEpochToHijri(daysFromEpoch) {
  let remainingDays = daysFromEpoch;
  
  // Calculate the number of complete 30-year cycles
  const daysPerCycle = 10631;
  const completeCycles = Math.floor(remainingDays / daysPerCycle);
  remainingDays -= completeCycles * daysPerCycle;
  
  // Find the year within the current cycle
  let year = completeCycles * 30 + 1;
  while (remainingDays >= getTabularYearLength(year)) {
    remainingDays -= getTabularYearLength(year);
    year++;
  }
  
  // Find the month within the year
  let month = 1;
  while (month <= 12 && remainingDays >= getTabularMonthLength(year, month)) {
    remainingDays -= getTabularMonthLength(year, month);
    month++;
  }
  
  // The remaining days plus 1 is the day of the month
  const day = remainingDays + 1;
  
  return { hy: year, hm: month, hd: day };
}

/**
 * Convert a Hijri date to Julian Day Number using tabular calculation
 * @param {number} year - Hijri year
 * @param {number} month - Hijri month (1-12)
 * @param {number} day - Hijri day (1-30)
 * @returns {number} Julian Day Number
 */
function hijriToJulianTabular(year, month, day) {
  const daysFromEpoch = getDaysFromEpochTabular(year, month, day);
  return HIJRI_EPOCH + daysFromEpoch;
}

/**
 * Convert a Julian Day Number to Hijri date using tabular calculation
 * @param {number} julianDay - Julian Day Number
 * @returns {Object} Object with hy, hm, hd properties
 */
function julianToHijriTabular(julianDay) {
  const daysFromEpoch = julianDay - HIJRI_EPOCH;
  
  if (daysFromEpoch < 0) {
    throw new Error('Julian Day is before Hijri epoch');
  }
  
  return daysFromEpochToHijri(daysFromEpoch);
}

module.exports = {
  HIJRI_EPOCH,
  LEAP_YEARS_IN_CYCLE,
  isTabularLeapYear,
  getTabularMonthLength,
  getTabularYearLength,
  getDaysFromEpochTabular,
  daysFromEpochToHijri,
  hijriToJulianTabular,
  julianToHijriTabular
};

/**
 * Utility functions for date conversions and validations
 */

/**
 * Check if a Jalaali (Persian/Solar Hijri) year is a leap year
 * @param {number} jy - Jalaali year
 * @returns {boolean} True if leap year
 */
function isJalaaliLeapYear(jy) {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  let jp = breaks[0];
  let jump = 0;
  
  for (let i = 1; i < breaks.length; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    jp = jm;
  }
  
  let n = jy - jp;
  
  if (jump - n < 6) {
    n = n - jump + ((jump + 4) - Math.floor((jump + 4) / 33) * 33);
  }
  
  let aux = (Math.floor(((n + 1) % 33 - 1) / 4) - Math.floor((n + 1) / 33)) === 0 ? 1 : 0;
  
  if ((n % 33) === 0 && aux === 0) {
    aux = 1;
  }
  
  return aux === 1;
}

/**
 * Check if a Gregorian year is a leap year
 * @param {number} year - Gregorian year
 * @returns {boolean} True if leap year
 */
function isGregorianLeapYear(year) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

/**
 * Get the number of days in a Gregorian month
 * @param {number} year - Gregorian year
 * @param {number} month - Gregorian month (1-12)
 * @returns {number} Number of days in the month
 */
function getGregorianMonthDays(year, month) {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isGregorianLeapYear(year)) {
    return 29;
  }
  return monthDays[month - 1];
}

/**
 * Get the number of days in a Jalaali month
 * @param {number} year - Jalaali year
 * @param {number} month - Jalaali month (1-12)
 * @returns {number} Number of days in the month
 */
function getJalaaliMonthDays(year, month) {
  if (month <= 6) {
    return 31;
  } else if (month <= 11) {
    return 30;
  } else {
    return isJalaaliLeapYear(year) ? 30 : 29;
  }
}

/**
 * Validate a Hijri date
 * @param {number} year - Hijri year
 * @param {number} month - Hijri month (1-12)
 * @param {number} day - Hijri day
 * @returns {boolean} True if valid
 */
function isValidHijriDate(year, month, day) {
  if (year < 1 || year > 5000) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 30) return false;
  return true;
}

/**
 * Validate a Jalaali date
 * @param {number} year - Jalaali year
 * @param {number} month - Jalaali month (1-12)
 * @param {number} day - Jalaali day
 * @returns {boolean} True if valid
 */
function isValidJalaaliDate(year, month, day) {
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const maxDay = getJalaaliMonthDays(year, month);
  return day <= maxDay;
}

/**
 * Validate a Gregorian date
 * @param {number} year - Gregorian year
 * @param {number} month - Gregorian month (1-12)
 * @param {number} day - Gregorian day
 * @returns {boolean} True if valid
 */
function isValidGregorianDate(year, month, day) {
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const maxDay = getGregorianMonthDays(year, month);
  return day <= maxDay;
}

/**
 * Convert Jalaali date to Julian Day Number
 * @param {number} jy - Jalaali year
 * @param {number} jm - Jalaali month
 * @param {number} jd - Jalaali day
 * @returns {number} Julian Day Number
 */
function jalaaliToJulian(jy, jm, jd) {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  let jp = breaks[0];
  let jump = 0;
  
  for (let i = 1; i < breaks.length; i++) {
    const jm_val = breaks[i];
    jump = jm_val - jp;
    if (jy < jm_val) break;
    jp = jm_val;
  }
  
  let n = jy - jp;
  
  if (jump - n < 6) {
    n = n - jump + ((jump + 4) - Math.floor((jump + 4) / 33) * 33);
  }
  
  let leap = (Math.floor(((n + 1) % 33 - 1) / 4) - Math.floor((n + 1) / 33)) === 0 ? 1 : 0;
  
  if ((n % 33) === 0 && leap === 0) {
    leap = 1;
  }
  
  const gy = jy + 621;
  const march = leap === 1 ? 20 : 21;
  
  let sal = 0;
  for (let i = 1; i < jm; i++) {
    sal += getJalaaliMonthDays(jy, i);
  }
  
  const julianDay = Math.floor((gy - 1) * 365.25 + Math.floor((gy - 1) / 400) - Math.floor((gy - 1) / 100)) + 
                    march + sal + jd + 1948321;
  
  return julianDay;
}

/**
 * Convert Julian Day Number to Jalaali date
 * @param {number} julianDay - Julian Day Number
 * @returns {Object} Object with jy, jm, jd properties
 */
function julianToJalaali(julianDay) {
  let gy = Math.floor((julianDay - 1948321) / 365.25);
  let sal1 = Math.floor((gy - 1) * 365.25 + Math.floor((gy - 1) / 400) - Math.floor((gy - 1) / 100)) + 1948321;
  
  while (sal1 > julianDay) {
    gy--;
    sal1 = Math.floor((gy - 1) * 365.25 + Math.floor((gy - 1) / 400) - Math.floor((gy - 1) / 100)) + 1948321;
  }
  
  const jy = gy - 621;
  const march = isJalaaliLeapYear(jy) ? 20 : 21;
  const farvardin1 = Math.floor((gy - 1) * 365.25 + Math.floor((gy - 1) / 400) - Math.floor((gy - 1) / 100)) + march + 1948321;
  
  let dayOfYear = julianDay - farvardin1 + 1;
  
  let jm = 1;
  while (jm <= 12) {
    const monthDays = getJalaaliMonthDays(jy, jm);
    if (dayOfYear <= monthDays) break;
    dayOfYear -= monthDays;
    jm++;
  }
  
  return { jy, jm, jd: dayOfYear };
}

/**
 * Convert Gregorian date to Julian Day Number
 * @param {number} gy - Gregorian year
 * @param {number} gm - Gregorian month
 * @param {number} gd - Gregorian day
 * @returns {number} Julian Day Number
 */
function gregorianToJulian(gy, gm, gd) {
  let a = Math.floor((14 - gm) / 12);
  let y = gy + 4800 - a;
  let m = gm + 12 * a - 3;
  
  return gd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Convert Julian Day Number to Gregorian date
 * @param {number} julianDay - Julian Day Number
 * @returns {Object} Object with gy, gm, gd properties
 */
function julianToGregorian(julianDay) {
  let a = julianDay + 32044;
  let b = Math.floor((4 * a + 3) / 146097);
  let c = a - Math.floor((146097 * b) / 4);
  let d = Math.floor((4 * c + 3) / 1461);
  let e = c - Math.floor((1461 * d) / 4);
  let m = Math.floor((5 * e + 2) / 153);
  
  const gd = e - Math.floor((153 * m + 2) / 5) + 1;
  const gm = m + 3 - 12 * Math.floor(m / 10);
  const gy = 100 * b + d - 4800 + Math.floor(m / 10);
  
  return { gy, gm, gd };
}

/**
 * Convert Jalaali date to Gregorian date
 * @param {number} jy - Jalaali year
 * @param {number} jm - Jalaali month
 * @param {number} jd - Jalaali day
 * @returns {Object} Object with gy, gm, gd properties
 */
function jalaaliToGregorian(jy, jm, jd) {
  const julianDay = jalaaliToJulian(jy, jm, jd);
  return julianToGregorian(julianDay);
}

/**
 * Convert Gregorian date to Jalaali date
 * @param {number} gy - Gregorian year
 * @param {number} gm - Gregorian month
 * @param {number} gd - Gregorian day
 * @returns {Object} Object with jy, jm, jd properties
 */
function gregorianToJalaali(gy, gm, gd) {
  const julianDay = gregorianToJulian(gy, gm, gd);
  return julianToJalaali(julianDay);
}

/**
 * Get Arabic weekday name from Julian Day Number
 * @param {number} julianDay - Julian Day Number
 * @returns {string} Arabic weekday name
 */
function getArabicWeekday(julianDay) {
  const arabicDays = [
    'الاثنين',     // Monday (JD % 7 = 0)
    'الثلاثاء',    // Tuesday
    'الأربعاء',    // Wednesday
    'الخميس',      // Thursday
    'الجمعة',      // Friday
    'السبت',       // Saturday
    'الأحد'        // Sunday
  ];
  
  return arabicDays[julianDay % 7];
}

/**
 * Get Persian weekday name from Julian Day Number
 * @param {number} julianDay - Julian Day Number
 * @returns {string} Persian weekday name
 */
function getPersianWeekday(julianDay) {
  const persianDays = [
    'دوشنبه',      // Monday (JD % 7 = 0)
    'سه‌شنبه',     // Tuesday
    'چهارشنبه',    // Wednesday
    'پنج‌شنبه',    // Thursday
    'جمعه',        // Friday
    'شنبه',        // Saturday
    'یکشنبه'       // Sunday
  ];
  
  return persianDays[julianDay % 7];
}

/**
 * Get English weekday name from Julian Day Number
 * @param {number} julianDay - Julian Day Number
 * @returns {string} English weekday name
 */
function getEnglishWeekday(julianDay) {
  const englishDays = [
    'Monday',      // JD % 7 = 0
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  
  return englishDays[julianDay % 7];
}

/**
 * Get weekday number (0-6, where 0 is Monday)
 * @param {number} julianDay - Julian Day Number
 * @returns {number} Weekday number
 */
function getWeekdayNumber(julianDay) {
  return julianDay % 7;
}

module.exports = {
  isJalaaliLeapYear,
  isGregorianLeapYear,
  getGregorianMonthDays,
  getJalaaliMonthDays,
  isValidHijriDate,
  isValidJalaaliDate,
  isValidGregorianDate,
  jalaaliToJulian,
  julianToJalaali,
  gregorianToJulian,
  julianToGregorian,
  jalaaliToGregorian,
  gregorianToJalaali,
  getArabicWeekday,
  getPersianWeekday,
  getEnglishWeekday,
  getWeekdayNumber
};

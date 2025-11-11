/**
 * Official Iranian Hijri Calendar Data
 * 
 * This module stores precise month lengths for Hijri dates based on official Iranian sources.
 * The data structure is designed to be flexible and easily extensible.
 * 
 * Structure:
 * - Each entry represents a Hijri year with an array of 12 month lengths (29 or 30 days)
 * - The array is automatically sorted and indexed for efficient lookups
 */

const officialData = {
  1340: [29, 30, 29, 30, 30, 30, 29, 30, 30, 29, 29, 30],
  1341: [29, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30, 29],
  1342: [30, 29, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
  1343: [29, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30],
  1344: [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30],
  1345: [29, 30, 30, 29, 30, 30, 29, 29, 30, 29, 29, 30],
  1346: [29, 30, 30, 29, 30, 30, 30, 29, 29, 30, 29, 29],
  1347: [30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29],
  1348: [29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30],
  1349: [29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29],
  1350: [30, 29, 29, 30, 30, 29, 29, 30, 29, 30, 30, 29],
  1351: [30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29],
  1352: [30, 30, 29, 30, 30, 30, 29, 29, 29, 30, 29, 30],
  1353: [29, 30, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29],
  1354: [29, 30, 30, 30, 29, 30, 30, 29, 29, 30, 29, 30],
  1355: [29, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29],
  1356: [30, 29, 29, 30, 30, 29, 30, 29, 30, 30, 29, 30],
  1357: [29, 30, 29, 30, 29, 30, 29, 29, 30, 30, 29, 30],
  1358: [30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
  1359: [30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 29, 30],
  1360: [30, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29, 30],
  1361: [29, 30, 29, 30, 30, 29, 30, 30, 29, 29, 30, 29],
  1362: [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30],
  1363: [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30, 29],
  1364: [30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30],
  1365: [29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30],
  1366: [29, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
  1367: [30, 29, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29],
  1368: [30, 29, 30, 30, 29, 30, 30, 29, 29, 30, 29, 30],
  1369: [29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 30],
  1370: [29, 29, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30],
  1371: [29, 30, 29, 30, 29, 30, 29, 29, 30, 30, 30, 29],
  1372: [30, 30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 30],
  1373: [29, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 30],
  1374: [29, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30],
  1375: [29, 30, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29],
  1376: [30, 29, 30, 29, 30, 30, 29, 30, 30, 29, 29, 30],
  1377: [29, 30, 29, 29, 30, 30, 29, 30, 30, 30, 29, 30],
  1378: [29, 29, 30, 29, 29, 30, 29, 30, 30, 30, 29, 30],
  1379: [30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 29, 30],
  1380: [30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
  1381: [30, 29, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29],
  1382: [30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 29, 30],
  1383: [29, 29, 30, 30, 29, 30, 30, 30, 29, 30, 29, 29],
  1384: [30, 29, 29, 30, 29, 30, 30, 30, 29, 30, 30, 29],
  1385: [29, 30, 29, 29, 30, 29, 30, 30, 29, 30, 30, 30],
  1386: [29, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30],
  1387: [29, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 30],
  1388: [29, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30],
  1389: [29, 30, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29],
  1390: [30, 29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29],
  1391: [29, 30, 29, 29, 30, 30, 30, 29, 30, 30, 29, 30],
  1392: [29, 29, 30, 29, 29, 30, 30, 29, 30, 30, 29, 30],
  1393: [30, 29, 29, 30, 29, 29, 30, 30, 29, 30, 29, 30],
  1394: [30, 30, 29, 30, 29, 29, 30, 29, 29, 30, 29, 30],
  1395: [30, 30, 29, 30, 29, 30, 29, 30, 29, 29, 29, 30],
  1396: [30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 29, 30],
  1397: [29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 29],
  1398: [30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30],
  1399: [29, 30, 29, 30, 29, 29, 30, 30, 29, 30, 30, 29],
  1400: [30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 30, 30],
  1401: [29, 30, 30, 29, 29, 30, 29, 29, 30, 29, 30, 29],
  1402: [30, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30],
  1403: [29, 30, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29],
  1404: [30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 29, 30],
  1405: [29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30],
  1406: [29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30],
  1407: [30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 29],
  1408: [30, 30, 29, 30, 29, 29, 30, 29, 29, 30, 30, 29],
  1409: [30, 30, 30, 29, 29, 30, 29, 30, 29, 29, 30, 30],
  1410: [29, 30, 30, 29, 30, 29, 30, 29, 30, 29, 29, 30],
  1411: [30, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 29],
  1412: [30, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30, 29],
  1413: [30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30],
  1414: [29, 30, 29, 29, 30, 29, 30, 29, 29, 30, 30, 30],
  1415: [30, 30, 29, 29, 29, 30, 29, 29, 29, 30, 30, 30],
  1416: [30, 30, 29, 30, 29, 29, 30, 29, 29, 30, 30, 29],
  1417: [30, 30, 30, 29, 29, 30, 29, 30, 29, 30, 29, 29],
  1418: [30, 30, 29, 30, 30, 29, 30, 29, 29, 30, 30, 29],
  1419: [29, 30, 29, 30, 29, 30, 30, 29, 29, 30, 30, 30],
  1420: [29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29],
  1421: [30, 29, 29, 30, 29, 29, 30, 30, 29, 30, 30, 30],
  1422: [29, 30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 30],
  1423: [29, 30, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30],
  1424: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
  1425: [30, 29, 30, 30, 29, 30, 30, 29, 29, 30, 29, 30],
  1426: [29, 29, 30, 29, 30, 30, 30, 29, 30, 30, 29, 29],
  1427: [30, 29, 29, 30, 29, 30, 30, 30, 29, 30, 29, 30],
  1428: [29, 30, 29, 29, 29, 30, 30, 29, 30, 30, 30, 29],
  1429: [30, 29, 30, 29, 29, 29, 30, 30, 29, 30, 30, 29],
  1430: [30, 30, 29, 29, 30, 29, 30, 29, 29, 30, 30, 29],
  1431: [30, 30, 29, 30, 29, 30, 29, 30, 29, 29, 30, 29],
  1432: [30, 30, 29, 30, 30, 30, 29, 30, 29, 29, 30, 29],
  1433: [29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 30],
  1434: [29, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
  1435: [29, 30, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
  1436: [29, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30, 30],
  1437: [29, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30, 30],
  1438: [29, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30],
  1439: [29, 30, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29],
  1440: [30, 29, 30, 30, 30, 29, 30, 30, 29, 29, 30, 29],
  1441: [29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30],
  1442: [29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29],
  1443: [29, 30, 30, 29, 29, 30, 29, 30, 30, 29, 30, 29],
  1444: [30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 29],
  1445: [30, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 29],
  1446: [30, 30, 30, 29, 30, 30, 29, 30, 29, 29, 29, 30],
  1447: [29, 30, 30, 29, 30, 30, 30, 29, 30, 29, 29, 29],
  1448: [30, 29, 30, 29, 30, 30, 30, 29, 30, 29],
};

/**
 * Get the minimum and maximum Hijri years available in official data
 * @returns {Object} Object with min and max year numbers, or null if no data
 */
function getOfficialDataRange() {
  const years = Object.keys(officialData).map(Number);
  if (years.length === 0) {
    return null;
  }
  return {
    minYear: Math.min(...years),
    maxYear: Math.max(...years)
  };
}

/**
 * Check if a given Hijri year/month falls within the official data range
 * @param {number} year - Hijri year
 * @param {number} month - Hijri month (1-12)
 * @returns {boolean} True if official data exists for this date
 */
function hasOfficialData(year, month = 1) {
  if (!officialData[year]) {
    return false;
  }
  // Check if the month is valid (1-12)
  if (month < 1 || month > 12) {
    return false;
  }
  // Check if the specific month exists in the data array (for incomplete years)
  if (month > officialData[year].length) {
    return false;
  }
  return true;
}

/**
 * Get the number of days in a specific Hijri month from official data
 * @param {number} year - Hijri year
 * @param {number} month - Hijri month (1-12)
 * @returns {number|null} Number of days (29 or 30), or null if no official data
 */
function getOfficialMonthLength(year, month) {
  if (!hasOfficialData(year, month)) {
    return null;
  }
  // Month is 1-indexed, array is 0-indexed
  return officialData[year][month - 1];
}

/**
 * Get the total number of days in a Hijri year from official data
 * @param {number} year - Hijri year
 * @returns {number|null} Total days in year (354 or 355), or null if no official data
 */
function getOfficialYearLength(year) {
  if (!officialData[year]) {
    return null;
  }
  return officialData[year].reduce((sum, days) => sum + days, 0);
}

/**
 * Calculate the total number of days from Hijri epoch to the start of a given year/month/day
 * using official data only
 * @param {number} year - Hijri year
 * @param {number} month - Hijri month (1-12)
 * @param {number} day - Hijri day (1-30)
 * @returns {number|null} Total days from epoch, or null if any part lacks official data
 */
function getDaysFromEpochOfficial(year, month, day) {
  const range = getOfficialDataRange();
  if (!range || year < range.minYear || year > range.maxYear) {
    return null;
  }
  
  let totalDays = 0;
  
  // Add days for all complete years before the target year
  for (let y = range.minYear; y < year; y++) {
    if (!officialData[y]) {
      return null; // Gap in data
    }
    totalDays += officialData[y].reduce((sum, days) => sum + days, 0);
  }
  
  // Add days for complete months in the target year
  if (!officialData[year]) {
    return null;
  }
  for (let m = 0; m < month - 1; m++) {
    totalDays += officialData[year][m];
  }
  
  // Add the days in the current month
  totalDays += day - 1; // -1 because day 1 is the start
  
  return totalDays;
}

module.exports = {
  officialData,
  getOfficialDataRange,
  hasOfficialData,
  getOfficialMonthLength,
  getOfficialYearLength,
  getDaysFromEpochOfficial
};

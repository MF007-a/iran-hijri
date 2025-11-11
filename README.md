# Iran Hijri Converter

A JavaScript library for converting between Iranian (Jalaali/Persian), Gregorian, and Hijri calendars with support for official Iranian Hijri data.

## Features

- **Official Data Priority**: Uses precise, officially-sourced Hijri month lengths for Iranian dates when available
- **Extended Data Range**: Includes 108 years of official data (Hijri 1340-1447 / Jalaali 1300-1405)
- **Tabular Fallback**: Automatically falls back to tabular (arithmetic) Hijri calculations for dates outside the official range
- **Bidirectional Conversions**: Convert between Jalaali ↔ Hijri and Gregorian ↔ Hijri
- **Weekday Information**: Returns weekday names in Arabic, Persian, and English
- **Flexible & Extensible**: Easily add or update official data without code changes
- **Wide Range Support**: Handles Hijri years 1-5000 using the 30-year cycle tabular system
- **Transparent**: Each conversion result indicates whether official data or tabular calculation was used

## Why This Library?

The standard `hijri-converter` library uses the Um al-Qura system, which is internationally recognized but differs from the traditional methods used in Iran. This often results in dates being 1 day off from Iranian official Hijri dates. This library solves that problem by prioritizing official Iranian data while maintaining broad compatibility through tabular calculations.

## Installation

```bash
npm install iran-hijri
```

## Usage

### Basic Conversions

```javascript
const { jalaaliToHijri, hijriToJalaali, gregorianToHijri, hijriToGregorian } = require('iran-hijri');

// Convert Jalaali to Hijri
const hijriDate = jalaaliToHijri(1403, 9, 15);
console.log(hijriDate);
// { hy: 1445, hm: 6, hd: 2, source: 'official', weekday: { ar: '...', fa: '...', en: 'Friday', number: 4 } }

// Convert Hijri to Jalaali
const jalaaliDate = hijriToJalaali(1445, 6, 2);
console.log(jalaaliDate);
// { jy: 1403, jm: 9, jd: 15, source: 'official', weekday: { ar: '...', fa: '...', en: 'Friday', number: 4 } }

// Convert Gregorian to Hijri
const hijriFromGregorian = gregorianToHijri(2024, 12, 5);
console.log(hijriFromGregorian);
// { hy: 1446, hm: 6, hd: 3, source: 'tabular' }

// Convert Hijri to Gregorian
const gregorianDate = hijriToGregorian(1446, 6, 3);
console.log(gregorianDate);
// { gy: 2024, gm: 12, gd: 5, source: 'tabular' }
```

### Check Data Source

```javascript
const { getSourceInfo } = require('iran-hijri');

const info = getSourceInfo(1445, 6);
console.log(info);
// {
//   hasOfficialData: true,
//   source: 'official',
//   officialDataRange: { minYear: 1423, maxYear: 1448 }
// }
```

### Validation

```javascript
const { isValidHijriDate, isValidJalaaliDate, isValidGregorianDate } = require('iran-hijri');

console.log(isValidHijriDate(1445, 13, 1));  // false (month > 12)
console.log(isValidJalaaliDate(1403, 12, 30)); // true
console.log(isValidGregorianDate(2024, 2, 30)); // false
```

## API Reference

### Main Conversion Functions

#### `jalaaliToHijri(jy, jm, jd)`
Convert Jalaali (Persian) date to Hijri date.
- **Parameters**: `jy` (year), `jm` (month 1-12), `jd` (day)
- **Returns**: `{ hy, hm, hd, source }` - Hijri date with data source indicator

#### `hijriToJalaali(hy, hm, hd)`
Convert Hijri date to Jalaali (Persian) date.
- **Parameters**: `hy` (year), `hm` (month 1-12), `hd` (day)
- **Returns**: `{ jy, jm, jd, source }` - Jalaali date with data source indicator

#### `gregorianToHijri(gy, gm, gd)`
Convert Gregorian date to Hijri date.
- **Parameters**: `gy` (year), `gm` (month 1-12), `gd` (day)
- **Returns**: `{ hy, hm, hd, source }` - Hijri date with data source indicator

#### `hijriToGregorian(hy, hm, hd)`
Convert Hijri date to Gregorian date.
- **Parameters**: `hy` (year), `hm` (month 1-12), `hd` (day)
- **Returns**: `{ gy, gm, gd, source }` - Gregorian date with data source indicator

### Utility Functions

#### `getSourceInfo(hy, hm?)`
Get information about whether official data exists for a Hijri year/month.
- **Returns**: `{ hasOfficialData, source, officialDataRange }`

#### `isValidHijriDate(year, month, day)`
Validate a Hijri date.

#### `isValidJalaaliDate(year, month, day)`
Validate a Jalaali date.

#### `isValidGregorianDate(year, month, day)`
Validate a Gregorian date.

## Adding Official Data

You can add official Hijri month lengths by editing `src/officialData.js`:

```javascript
const officialData = {
  1423: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
  1424: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30],
  // Add more years as needed
};
```

Each array contains 12 values representing the days in each month (29 or 30). The library will automatically use this data when available and fall back to tabular calculations otherwise.

## How It Works

### Official Data System
The library checks if the requested Hijri date falls within the range of official data. If so, it uses the precise month lengths you've provided in `officialData.js`. This ensures accuracy for Iranian Hijri dates within the documented range.

### Tabular System
For dates outside the official range, the library uses the tabular Islamic calendar system based on a 30-year cycle:
- 19 normal years with 354 days
- 11 leap years with 355 days
- Leap years: 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 of each 30-year cycle

This mathematical approach provides reasonable approximations for historical and future dates.

## Current Official Data Range

The library includes comprehensive official data for:
- **Hijri Years**: 1340/01 to 1447/12
- **Jalaali Years**: Approximately 1300 to 1405
- **Gregorian Years**: Approximately 1921 to 2026
- **Total Coverage**: 108 years of precise Iranian Hijri calendar data

Data was collected from [Bahesab.ir](https://www.bahesab.ir/), Iran's trusted calendar platform. See [`scripts/README.md`](scripts/README.md) for details on the data collection methodology.

For dates outside this range, the library automatically uses the tabular (arithmetic) system.

## Data Sources & Methodology

This library uses **official Iranian Hijri calendar data** sourced from [Bahesab.ir](https://www.bahesab.ir/time/conversion/), which represents the actual observational practices and conventions used in Iran.

### Data Collection

The 108 years of official data (Hijri 1340-1447) were collected using an automated web scraper that:
1. Converts the 1st day of each Hijri month to Jalaali dates
2. Calculates month lengths by measuring the difference between consecutive months
3. Validates all data for accuracy

See the [`scripts/`](scripts/) directory for the complete data collection tool and methodology documentation.

## License

ISC

## Contributing

Contributions are welcome! If you have official Iranian Hijri data for additional years, please consider submitting a pull request.

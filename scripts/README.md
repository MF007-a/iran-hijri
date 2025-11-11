# Data Collection Scripts

This directory contains tools used to collect and verify official Iranian Hijri calendar data from authoritative sources.

## Bahesab Hijri Scraper (`bahesab-hijri-scraper.cs`)

A C# web scraper that automatically extracts precise month lengths for Hijri dates from [Bahesab.ir](https://www.bahesab.ir/time/conversion/), Iran's trusted calendar and date conversion platform.

### Overview

This scraper was created to collect **108 years** of official Iranian Hijri calendar data (years 1340-1447), which corresponds to approximately Jalaali years 1300-1405 (1921-2026 CE). The data includes precise month lengths (29 or 30 days) for each month, accounting for the actual observational practices used in Iran.

### How It Works

The scraper uses the following methodology:

1. **Conversion-based calculation**: For each Hijri year:
   - Converts the 1st day of each month (1-12) from Hijri → Jalaali
   - Converts the 1st day of the next year's first month
   - Calculates the difference between consecutive dates to determine month length

2. **Technology stack**:
   - Selenium WebDriver for browser automation
   - ChromeDriver for Chrome browser control
   - WebDriverManager for automatic driver setup
   - Regex parsing for extracting dates from Persian/Arabic numerals

3. **Reliability features**:
   - Automatic retry mechanisms
   - 500ms delay between requests (respectful scraping)
   - Supports both Persian (۰-۹) and English (0-9) numerals
   - Validates date ranges to ensure accuracy

### Prerequisites

- .NET 6.0 or higher
- Chrome browser installed
- Internet connection

### Dependencies

```xml
<PackageReference Include="Selenium.WebDriver" Version="4.x.x" />
<PackageReference Include="Selenium.Support" Version="4.x.x" />
<PackageReference Include="WebDriverManager" Version="2.x.x" />
```

### Usage

#### Running the scraper:

```bash
cd scripts
dotnet run
```

#### Expected output:

```
Opening Bahesab...
✓ Selected conversion type: Hijri to Solar/Gregorian

=== Processing Hijri Year 1340 ===
  Month 01... ✓ Starts at 1300/10/09
  Month 02... ✓ Starts at 1300/11/08
  ...
1340: [29, 30, 29, 30, 30, 30, 29, 30, 30, 29, 29, 30]

=== Processing Hijri Year 1341 ===
...

✓ Data successfully saved to officialData.js
```

### Data Range

- **Start**: Hijri 1340/01/01 (≈ Jalaali 1300/10/09)
- **End**: Hijri 1447/12/29 (≈ Jalaali 1405/12/29)
- **Total**: 108 Hijri years
- **Total months**: 1,296 months of precise data

### Performance

- **Execution time**: ~1 hour for all 108 years
- **Requests**: ~1,400 total (13 conversions per year × 108 years)
- **Rate**: ~2 requests per second (with 500ms delays)

### Output Format

The scraper automatically inserts data into `../src/officialData.js` in the following format:

```javascript
const officialData = {
  1340: [29, 30, 29, 30, 30, 30, 29, 30, 30, 29, 29, 30],
  1341: [30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30],
  // ... more years
};
```

### Verification

The data has been verified against:
- Bahesab's calendar display (years 1381-1405)
- Manual spot-checks across different years
- Cross-validation with the library's own conversion functions

### Notes

- **One-time use**: This script was run on November 11, 2025, to collect the initial dataset
- **Future updates**: Can be re-run to extend the data range when Bahesab adds new years
- **Respectful scraping**: Includes delays and rate limiting to avoid overloading Bahesab's servers
- **Browser visibility**: You can enable headless mode by uncommenting the `--headless` option in the code

### Maintenance

To update the data in the future:

1. Modify `START_YEAR` and `END_YEAR` constants in the code
2. Run the scraper: `dotnet run`
3. Verify the output in `../src/officialData.js`
4. Commit the changes to the repository

### Attribution

Data source: [Bahesab.ir](https://www.bahesab.ir/) - Iran's comprehensive calendar and calculation platform.

### License

This scraper is provided as a tool for data collection. The data itself is sourced from Bahesab.ir and represents publicly available calendar information used in Iran.

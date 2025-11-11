using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System.Text;
using System.Text.RegularExpressions;
using WebDriverManager;
using WebDriverManager.DriverConfigs.Impl;

class HijriCalendarScraper
{
    private const string BAHESAB_URL = "https://www.bahesab.ir/time/conversion/";
    private const int START_YEAR = 1340;
    private const int END_YEAR = 1447;
    private const int DELAY_BETWEEN_REQUESTS = 500; // 0.5 seconds
    private const int MAX_WAIT_FOR_RESULT = 15000; // 15 seconds max wait

    static async Task Main(string[] args)
    {
        Console.OutputEncoding = Encoding.UTF8;
        var scraper = new HijriCalendarScraper();
        await scraper.ScrapeHijriMonths();
    }

    public async Task ScrapeHijriMonths()
    {
        // Automatically download and setup ChromeDriver
        new DriverManager().SetUpDriver(new ChromeConfig());
        
        var options = new ChromeOptions();
        // Uncomment the next line to run headless (no visible browser)
        // options.AddArgument("--headless");
        options.AddArgument("--lang=fa");
        
        using var driver = new ChromeDriver(options);
        
        try
        {
            Console.WriteLine("Opening Bahesab...");
            driver.Navigate().GoToUrl(BAHESAB_URL);
            
            // Wait for page to load
            await Task.Delay(3000);
            
            // Select "قمری به شمسی و میلادی" (value="2")
            SelectConversionType(driver);
            await Task.Delay(2000);
            
            var allYearsData = new Dictionary<int, List<int>>();
            
            for (int year = START_YEAR; year <= END_YEAR; year++)
            {
                Console.WriteLine($"\n=== Processing Hijri Year {year} ===");
                var monthLengths = await ProcessYear(driver, year);
                allYearsData[year] = monthLengths;
                
                // Display the year's data
                Console.WriteLine($"{year}: [{string.Join(", ", monthLengths)}]");
            }
            
            // Save to file
            SaveToFile(allYearsData);
            Console.WriteLine("\n✓ Data successfully saved to official-data.js");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
        finally
        {
            driver.Quit();
        }
    }

    private void SelectConversionType(IWebDriver driver)
    {
        try
        {
            var typeSelect = driver.FindElement(By.Id("type"));
            var selectElement = new SelectElement(typeSelect);
            selectElement.SelectByValue("2"); // قمری به شمسی و میلادی
            Console.WriteLine("✓ Selected conversion type: Hijri to Solar/Gregorian");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to select conversion type: {ex.Message}");
            throw;
        }
    }

    private async Task<List<int>> ProcessYear(IWebDriver driver, int year)
    {
        var monthLengths = new List<int>();
        var allDates = new List<JalaaliDate>();
        
        // Collect all 13 conversion points (1st of each month + 1st of next year)
        for (int month = 1; month <= 12; month++)
        {
            Console.Write($"  Month {month:D2}... ");
            
            var currentDate = await ConvertHijriToJalaali(driver, year, month, 1);
            
            if (currentDate == null)
            {
                Console.WriteLine("FAILED - Could not parse result");
                // Return early with error
                return Enumerable.Repeat(0, 12).ToList();
            }
            
            allDates.Add(currentDate);
            Console.WriteLine($"✓ Starts at {currentDate}");
            
            // Delay between requests
            await Task.Delay(DELAY_BETWEEN_REQUESTS);
        }
        
        // Get the 1st of next year for calculating 12th month length
        Console.Write($"  Getting next year start... ");
        var nextYearFirstDate = await ConvertHijriToJalaali(driver, year + 1, 1, 1);
        
        if (nextYearFirstDate == null)
        {
            Console.WriteLine("FAILED");
            return Enumerable.Repeat(0, 12).ToList();
        }
        
        allDates.Add(nextYearFirstDate);
        Console.WriteLine($"✓ {nextYearFirstDate}");
        
        // Now calculate month lengths from the collected dates
        for (int i = 0; i < 12; i++)
        {
            int daysDifference = CalculateDaysDifference(allDates[i], allDates[i + 1]);
            monthLengths.Add(daysDifference);
        }
        
        return monthLengths;
    }

    private async Task<JalaaliDate?> ConvertHijriToJalaali(IWebDriver driver, int year, int month, int day)
    {
        try
        {
            // Wait a bit before interacting
            await Task.Delay(500);
            
            var js = (IJavaScriptExecutor)driver;
            
            // Set values using JavaScript (more reliable than SendKeys)
            js.ExecuteScript($"document.getElementById('input-year').value = '{year}';");
            await Task.Delay(200);
            
            js.ExecuteScript($"document.getElementById('input-month').value = '{month}';");
            await Task.Delay(200);
            
            js.ExecuteScript($"document.getElementById('input-day').value = '{day}';");
            await Task.Delay(300);
            
            // Trigger the conversion button click
            js.ExecuteScript("document.querySelector('div#button.button').click();");
            
            // Wait for the result popup to appear
            var wait = new WebDriverWait(driver, TimeSpan.FromMilliseconds(MAX_WAIT_FOR_RESULT));
            
            try
            {
                wait.Until(d => {
                    try
                    {
                        var resultBg = d.FindElement(By.Id("result-background"));
                        var resultDiv = d.FindElement(By.Id("RESULT"));
                        return resultBg.Displayed && resultDiv.Displayed;
                    }
                    catch
                    {
                        return false;
                    }
                });
            }
            catch (WebDriverTimeoutException)
            {
                Console.Write("Timeout - ");
                return null;
            }
            
            // Parse the result - find the specific div with class="date-6" or similar
            JalaaliDate? jalaaliDate = null;
            try
            {
                // Try to find elements with dates - they usually have class starting with "date-"
                var dateElements = driver.FindElements(By.CssSelector("#RESULT div[class*='date']"));
                
                Console.Write($"[Found {dateElements.Count} date divs] ");
                
                foreach (var elem in dateElements)
                {
                    var text = elem.Text.Trim();
                    if (!string.IsNullOrEmpty(text))
                    {
                        Console.Write($"'{text}' ");
                        var parsed = ParseJalaaliDate(text);
                        if (parsed != null)
                        {
                            jalaaliDate = parsed;
                            break;
                        }
                    }
                }
            }
            catch
            {
                // Fallback to parsing all text
                var allText = driver.FindElement(By.Id("RESULT")).Text;
                jalaaliDate = ParseJalaaliDate(allText);
            }
            
            if (jalaaliDate == null)
            {
                Console.Write("Parse failed - ");
            }
            
            // Close the popup using JavaScript (more reliable)
            try
            {
                js.ExecuteScript("document.getElementById('close').click();");
                await Task.Delay(500);
            }
            catch { }
            
            return jalaaliDate;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Conversion error: {ex.Message}");
            return null;
        }
    }

    private JalaaliDate? ParseJalaaliDate(string resultText)
    {
        // Looking for pattern like "۱۳  ⁄  ۶  ⁄  ۱۳۰۰" or "13 / 6 / 1300"
        // Note: The slash might be /, ⁄ (fraction slash U+2044), or other variants
        
        var lines = resultText.Split(new[] { '\n', '|' });
        foreach (var line in lines)
        {
            // Try to find a date pattern - allow various slash characters and spaces
            var match = Regex.Match(line, @"([۰-۹\d]+)\s*[/⁄]\s*([۰-۹\d]+)\s*[/⁄]\s*([۰-۹\d]+)");
            if (match.Success)
            {
                // Convert Persian/Arabic numerals to English if needed
                var yearStr = ConvertToEnglishNumbers(match.Groups[3].Value.Trim());
                var monthStr = ConvertToEnglishNumbers(match.Groups[2].Value.Trim());
                var dayStr = ConvertToEnglishNumbers(match.Groups[1].Value.Trim());
                
                if (int.TryParse(yearStr, out int year) && 
                    int.TryParse(monthStr, out int month) && 
                    int.TryParse(dayStr, out int day))
                {
                    // Check if this looks like a Jalaali date (year should be around 1200-1500)
                    if (year >= 1200 && year <= 1500 && month >= 1 && month <= 12 && day >= 1 && day <= 31)
                    {
                        return new JalaaliDate(year, month, day);
                    }
                }
            }
        }
        
        return null;
    }

    private string ConvertToEnglishNumbers(string input)
    {
        var result = input;
        
        // Persian/Arabic digits
        string[] persian = { "۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹" };
        string[] arabic = { "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩" };
        
        for (int i = 0; i < 10; i++)
        {
            result = result.Replace(persian[i], i.ToString());
            result = result.Replace(arabic[i], i.ToString());
        }
        
        return result;
    }

    private int CalculateDaysDifference(JalaaliDate from, JalaaliDate to)
    {
        // Calculate total days from a reference point for each date
        int daysFrom = GetDaysSinceEpoch(from);
        int daysTo = GetDaysSinceEpoch(to);
        
        return daysTo - daysFrom;
    }

    private int GetDaysSinceEpoch(JalaaliDate date)
    {
        // Days in each Jalaali month
        int[] monthDays = { 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29 };
        
        int totalDays = 0;
        
        // Add days for complete years
        for (int y = 1; y < date.Year; y++)
        {
            totalDays += IsLeapYear(y) ? 366 : 365;
        }
        
        // Add days for complete months in the current year
        for (int m = 1; m < date.Month; m++)
        {
            totalDays += monthDays[m - 1];
            // Add leap day if month 12 and leap year
            if (m == 12 && IsLeapYear(date.Year))
            {
                totalDays += 1;
            }
        }
        
        // Add the day of month
        totalDays += date.Day;
        
        return totalDays;
    }

    private bool IsLeapYear(int year)
    {
        // 33-year cycle: years 1, 5, 9, 13, 17, 22, 26, 30 are leap years
        int cycle = year % 33;
        int[] leapYears = { 1, 5, 9, 13, 17, 22, 26, 30 };
        return Array.Exists(leapYears, x => x == cycle);
    }

    private void SaveToFile(Dictionary<int, List<int>> allYearsData)
    {
        var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "src", "officialData.js");
        filePath = Path.GetFullPath(filePath);
        
        // Read existing file
        var existingContent = File.ReadAllText(filePath);
        
        // Find where to insert new data (after the existing data but before the closing brace)
        var lines = existingContent.Split('\n').ToList();
        
        // Find the last entry to insert after it
        int insertIndex = -1;
        for (int i = lines.Count - 1; i >= 0; i--)
        {
            if (lines[i].Contains(":") && lines[i].Contains("["))
            {
                insertIndex = i + 1;
                break;
            }
        }
        
        if (insertIndex == -1)
        {
            // If we can't find existing entries, insert before the closing brace
            insertIndex = lines.FindIndex(l => l.Contains("};"));
        }
        
        // Build new entries
        var newEntries = new List<string>();
        foreach (var kvp in allYearsData.OrderBy(x => x.Key))
        {
            var monthsStr = string.Join(", ", kvp.Value);
            newEntries.Add($"  {kvp.Key}: [{monthsStr}],");
        }
        
        // Insert new entries
        lines.InsertRange(insertIndex, newEntries);
        
        // Write back to file
        File.WriteAllText(filePath, string.Join("\n", lines));
    }
}

class JalaaliDate
{
    public int Year { get; }
    public int Month { get; }
    public int Day { get; }
    
    public JalaaliDate(int year, int month, int day)
    {
        Year = year;
        Month = month;
        Day = day;
    }
    
    public override string ToString()
    {
        return $"{Year}/{Month:D2}/{Day:D2}";
    }
}

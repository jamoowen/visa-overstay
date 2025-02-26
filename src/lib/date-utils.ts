
export class DateUtils  {

  /*
  * @dev used in calendar to show the picked date eg 1 January 2024
  * */
  public static formatDateAsUkReadableString(date: Date): string {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /*
  * @dev this is what we send to server when updating arrivalDate
  * */
  public static formatDateAsYMD(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  /*
  * @dev works with negative for subtracting
  * */
  public static addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  public static addMonthsToDate(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  public static addYearsToDate(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }


  public static getFloorOfDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public static calculateAbsoluteDateDifferenceInDays(date1: Date, date2: Date): number {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      throw new Error("Both arguments must be valid Date objects.");
    }
    // Normalize both dates to remove the time component
    const day1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const day2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    // Difference in days (Milliseconds → Days)
    return Math.floor(Math.abs((day2.valueOf() - day1.valueOf()) / 86_400_000));
  }

}

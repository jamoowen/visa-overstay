
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

  public static getFloorOfDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public static calculateAbsoluteDateDifferenceInDays(date1: Date, date2: Date) {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      throw new Error("Both arguments must be valid Date objects.");
    }
    // Normalize the dates (removing time component)
    const day1 = this.getFloorOfDate(date1).getTime();
    const day2 = this.getFloorOfDate(date2).getTime();
    // Calculate the difference in milliseconds and convert to days
    return Math.abs((day2 - day1) / (1000 * 60 * 60 * 24));
  }
}

import type { TimeFrame } from "@/enums/timeframe.enum";
import { format } from "date-fns";

export const formatDateRange = (timeframe: TimeFrame, date: Date) => {
  switch (timeframe) {
    case "day":
      return format(date, "dd MMM yyyy");
    case "week": {
      const start = date;
      const end = new Date(date);
      end.setDate(end.getDate() + 6);
      return `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`;
    }
    case "month":
      return format(date, "MMM yyyy");
    case "year":
      return format(date, "yyyy");
  }
};

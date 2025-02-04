import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = Omit<DayPickerProps, "mode" | "selected" | "onSelect"> & {
  mode?: "default" | "single"
  selected?: Date | null
  onSelect?: (date: Date | undefined) => void
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (props.selected instanceof Date) {
      return props.selected.getMonth();
    }
    return new Date().getMonth();
  });

  const [currentYear, setCurrentYear] = React.useState(() => {
    if (props.selected instanceof Date) {
      return props.selected.getFullYear();
    }
    return new Date().getFullYear();
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  }, []);

  const handleMonthChange = (value: string) => {
    const newMonth = months.indexOf(value);
    setCurrentMonth(newMonth);
    if (props.selected instanceof Date && props.onSelect) {
      const newDate = new Date(props.selected);
      newDate.setMonth(newMonth);
      props.onSelect(newDate);
    }
  };

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value);
    setCurrentYear(newYear);
    if (props.selected instanceof Date && props.onSelect) {
      const newDate = new Date(props.selected);
      newDate.setFullYear(newYear);
      props.onSelect(newDate);
    }
  };

  const customHeader = (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Select
        value={months[currentMonth]}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentYear.toString()}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-[100px] h-9">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-4">
      {customHeader}
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "hidden",
          nav: "hidden",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        mode="single"
        selected={props.selected}
        onSelect={(date) => props.onSelect?.(date)}
        month={new Date(currentYear, currentMonth)}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
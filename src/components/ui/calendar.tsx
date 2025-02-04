import * as React from "react"
import { DayPicker } from "react-day-picker"
import { CalendarDropdowns } from "./calendar/CalendarDropdowns"
import { calendarStyles } from "./calendar/CalendarStyles"
import { cn } from "@/lib/utils"

export type CalendarProps = Omit<
  React.ComponentProps<typeof DayPicker>,
  "mode" | "selected" | "onSelect"
> & {
  mode?: "default" | "single"
  selected?: Date | null
  onSelect?: (date: Date | undefined) => void
}

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (props.selected instanceof Date) {
      return props.selected.getMonth()
    }
    return new Date().getMonth()
  })

  const [currentYear, setCurrentYear] = React.useState(() => {
    if (props.selected instanceof Date) {
      return props.selected.getFullYear()
    }
    return new Date().getFullYear()
  })

  const handleMonthChange = (value: string) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const newMonth = months.indexOf(value)
    setCurrentMonth(newMonth)
    if (props.selected instanceof Date) {
      const newDate = new Date(props.selected)
      newDate.setMonth(newMonth)
      // Don't call onSelect here to keep the picker open
    }
  }

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value)
    setCurrentYear(newYear)
    if (props.selected instanceof Date) {
      const newDate = new Date(props.selected)
      newDate.setFullYear(newYear)
      // Don't call onSelect here to keep the picker open
    }
  }

  return (
    <div className="space-y-4">
      <CalendarDropdowns
        currentMonth={currentMonth}
        currentYear={currentYear}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          ...calendarStyles,
          ...classNames,
        }}
        mode="single"
        selected={props.selected}
        onSelect={props.onSelect}
        month={new Date(currentYear, currentMonth)}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }

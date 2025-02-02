import * as React from "react"
import { DayPicker } from "react-day-picker"
import { CalendarHeader, CalendarNavigation, calendarStyles } from "./CalendarHeader"
import type { CalendarProps } from "./types"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [currentYear, setCurrentYear] = React.useState(() => {
    if (props.selected instanceof Date) {
      return props.selected.getFullYear()
    }
    return new Date().getFullYear()
  })

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)
  }, [])

  const handleYearChange = (newYear: number) => {
    setCurrentYear(newYear)
    if (props.selected instanceof Date && props.onSelect) {
      const newDate = new Date(props.selected)
      newDate.setFullYear(newYear)
      props.onSelect(newDate)
    }
  }

  const captionLayout = React.useMemo(
    () => (
      <CalendarHeader
        currentYear={currentYear}
        years={years}
        onYearChange={handleYearChange}
        selected={props.selected}
      />
    ),
    [currentYear, years, props.selected]
  )

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      classNames={{
        ...calendarStyles,
        ...classNames,
      }}
      components={CalendarNavigation}
      mode="single"
      selected={props.selected}
      onSelect={(date) => props.onSelect?.(date)}
      captionLayout="buttons"
      footer={captionLayout}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
export type { CalendarProps }
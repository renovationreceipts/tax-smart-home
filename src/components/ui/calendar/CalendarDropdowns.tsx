import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CalendarDropdownsProps {
  currentMonth: number
  currentYear: number
  onMonthChange: (value: string) => void
  onYearChange: (value: string) => void
}

export function CalendarDropdowns({
  currentMonth,
  currentYear,
  onMonthChange,
  onYearChange
}: CalendarDropdownsProps) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)
  }, [])

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Select
        value={months[currentMonth]}
        onValueChange={onMonthChange}
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
        onValueChange={onYearChange}
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
  )
}
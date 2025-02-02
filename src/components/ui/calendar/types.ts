import { DayPickerProps } from "react-day-picker"

export type CalendarProps = Omit<DayPickerProps, "mode" | "selected" | "onSelect"> & {
  mode?: "default" | "single"
  selected?: Date | null
  onSelect?: (date: Date | undefined) => void
}
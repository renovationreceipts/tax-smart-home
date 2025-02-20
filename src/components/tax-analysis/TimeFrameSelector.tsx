
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type TimeFrame = "today" | "3" | "5" | "10" | "15";

interface TimeFrameSelectorProps {
  selectedTimeFrame: TimeFrame;
  onTimeFrameChange: (value: TimeFrame) => void;
}

export const timeFrameOptions = [{
  value: "today",
  label: "Today"
}, {
  value: "3",
  label: "In 3 years"
}, {
  value: "5",
  label: "In 5 years"
}, {
  value: "10",
  label: "In 10 years"
}, {
  value: "15",
  label: "In 15 years"
}];

export function TimeFrameSelector({ selectedTimeFrame, onTimeFrameChange }: TimeFrameSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-bold">If You Sold Your Property...</h2>
      <Select value={selectedTimeFrame} onValueChange={value => onTimeFrameChange(value as TimeFrame)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {timeFrameOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

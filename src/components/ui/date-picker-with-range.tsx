import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { cn } from "@/lib/utils" 

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  className?: string
}

export function DatePickerWithRange({ date, onDateChange, className }: DatePickerWithRangeProps) {
  return (
    <div className={cn("relative", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start px-3 font-normal w-full bg-secondary",
              date?.from && "pr-10" 
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate text-left flex-1">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-secondary" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            captionLayout="dropdown" 
            fromYear={2000} 
            toYear={2050}   
          />
          
          {date?.from && (
            <div className="border-t border-border p-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                onClick={() => onDateChange(undefined)}
              >
                <X className="mr-2 h-3 w-3" />
                Clear Selection
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* --- INLINE CLEAR BUTTON --- */}
      {date?.from && (
        <Button
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground z-10"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDateChange(undefined);
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear date range</span>
        </Button>
      )}
    </div>
  )
}
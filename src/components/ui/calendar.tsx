"use client"

import * as React from "react"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval 
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalendarProps = {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  // Compatibility with react-day-picker props used in DatePicker
  mode?: "single" | "range" | "multiple"
  initialFocus?: boolean
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  // Use selected date or today as the starting reference for the view
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className={cn("p-5 bg-[#0f0f12] rounded-[20px] border border-white/[0.06] shadow-2xl w-fit mx-auto animate-in fade-in zoom-in-95 duration-200", className)}>
      {/* Header: Month Title on Left, Nav on Right */}
      <div className="flex items-center justify-between mb-6 px-1">
        <span className="text-[12px] font-bold text-white uppercase tracking-[0.25em]">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex gap-1">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-tier-3 hover:text-white active:scale-95"
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-tier-3 hover:text-white active:scale-95"
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Row: Explicit Grid Alignment */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {weekdays.map((day) => (
          <div 
            key={day} 
            className="w-10 h-10 flex items-center justify-center text-[10px] font-bold text-tier-4 uppercase tracking-tighter"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid: 7-Column Layout */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const isSelected = selected && isSameDay(day, selected)
          const isToday = isSameDay(day, new Date())
          const isCurrentMonth = isSameMonth(day, monthStart)

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect?.(day)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 relative group",
                !isCurrentMonth && "text-tier-4 opacity-10 pointer-events-none",
                isCurrentMonth && "text-tier-2 hover:bg-primary/20 hover:text-primary",
                isToday && !isSelected && "border border-primary/40 text-primary font-bold shadow-[0_0_10px_rgba(168,85,247,0.1)]",
                isSelected && "bg-primary text-white hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] z-10 font-bold"
              )}
            >
              {/* Hover Glow Effect */}
              {isCurrentMonth && !isSelected && (
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-primary/10 blur-md transition-opacity" />
              )}
              <span className="relative z-10">{format(day, "d")}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

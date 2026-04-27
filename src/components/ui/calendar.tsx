"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-[#0f0f12] rounded-[16px] border border-white/[0.06] shadow-2xl", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between items-center pt-1 relative h-10 px-1",
        caption_label: "text-[12px] font-bold text-white uppercase tracking-[0.15em]",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-white/5 rounded-lg transition-all"
        ),
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 w-full mb-2",
        head_cell:
          "text-tier-3 font-bold text-[10px] uppercase tracking-tighter text-center flex items-center justify-center h-10 w-10",
        row: "grid grid-cols-7 w-full mt-2",
        cell: cn(
          "h-10 w-10 text-center text-sm p-0 relative flex items-center justify-center",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium aria-selected:opacity-100 rounded-full transition-all duration-200 hover:bg-primary/20 hover:text-primary hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]",
        day_today: "border border-primary/40 text-primary font-bold",
        day_outside:
          "day-outside text-tier-4 opacity-30 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-tier-4 opacity-20",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4 text-tier-2", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4 text-tier-2", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

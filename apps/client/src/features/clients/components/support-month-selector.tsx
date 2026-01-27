import { Button } from "@/components/ui/button";
import { SupportMonth } from "@/features/clients/api/manage-support-hours";

type SupportMonthSelectorProps = {
  months: SupportMonth[];
  selectedMonthId: string | null;
  onSelectMonth: (monthId: string) => void;
};

export function SupportMonthSelector({
  months,
  selectedMonthId,
  onSelectMonth,
}: SupportMonthSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Select Month</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {months.map((month) => {
          const monthDate = new Date(month.date);
          const monthName = monthDate.toLocaleDateString("en-US", {
            month: "short",
          });
          const year = monthDate.getFullYear();
          const isSelected = selectedMonthId === month.id;
          return (
            <Button
              key={month.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectMonth(month.id)}
              className="flex flex-col items-center justify-center h-auto py-2"
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">{year}</span>
                <span className="text-xs font-medium">{monthName}</span>
              </div>
              <span className="text-xs opacity-70">
                {month.spent_support_hours.toFixed(1)}h
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

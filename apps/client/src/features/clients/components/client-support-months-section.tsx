import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClientSupportMonths } from "@/features/clients/api/get-client-support-months";
import { Client } from "@internal-cms/shared";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChevronLeft, ChevronRight } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ClientSupportMonthsSectionProps = {
  client: Client;
};

export function ClientSupportMonthsSection({
  client,
}: ClientSupportMonthsSectionProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const {
    data: supportMonths,
    isLoading,
    isError,
  } = useGetClientSupportMonths(client.id, year);

  // Generate all months for the year
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(year, i, 1);
    const today = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      date: monthDate.toISOString().split("T")[0].substring(0, 7), // YYYY-MM format
      monthName: monthDate.toLocaleDateString("en-US", { month: "short" }),
      isPast: monthDate < firstOfMonth,
    };
  });

  // Create a map of existing support months (using YYYY-MM format)
  const supportMonthsMap = new Map(
    supportMonths?.map((sm) => {
      const monthKey = sm.date.substring(0, 7); // Extract YYYY-MM
      return [monthKey, sm];
    }) || []
  );

  // Fill in missing months with placeholder data
  const chartData = allMonths.map((month) => {
    const existing = supportMonthsMap.get(month.date);
    if (existing) {
      return {
        ...existing,
        monthName: month.monthName,
      };
    }
    // Placeholder for missing months
    // For past months: total_support_hours = 0
    // For current/future months: total_support_hours = hours_per_month
    return {
      date: `${month.date}-01`,
      monthName: month.monthName,
      rolled_over_from_last_month: 0,
      rollover_hours: 0,
      spent_support_hours: 0,
      total_support_hours: month.isPast ? 0 : client.hours_per_month || 0,
    };
  });

  const chartDataConfig = {
    labels: chartData.map((d) => d.monthName),
    datasets: [
      {
        label: "Total Support Hours",
        data: chartData.map((d) => d.total_support_hours),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Spent Support Hours",
        data: chartData.map((d) => d.spent_support_hours),
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
      {
        label: "Rollover Hours",
        data: chartData.map((d) => d.rollover_hours || 0),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Support Months</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setYear(year - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium w-20 text-center">{year}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setYear(year + 1)}
            disabled={year >= new Date().getFullYear()}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : isError ? (
        <p className="text-gray-500 text-sm">Failed to load support months.</p>
      ) : (
        <div className="h-64">
          <Bar data={chartDataConfig} options={options} />
        </div>
      )}
    </div>
  );
}

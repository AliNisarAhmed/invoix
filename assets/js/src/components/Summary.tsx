import React from "react";
import { formatCurrency, showPercentageChange } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { CreditCard, DollarSign, Receipt, ReceiptText } from "lucide-react";
import { useSummary } from "../hooks/useSummary";
import { SummaryLoading } from "./SummaryLoading";

export function Summary() {
  const { data: summaryData, isPending, isError } = useSummary();

  if (isPending) {
    return <SummaryLoading />;
  }

  if (isError) {
    return <div>Error fetching Summary, please try again</div>;
  }

  return (
    <>
      <h3>This month so far...</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryData.currentRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {showPercentageChange({
                current: summaryData.currentRevenue,
                previous: summaryData.previousRevenue,
                period: "month",
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.currentInvoices}
            </div>
            <p className="text-xs text-muted-foreground">
              {showPercentageChange({
                previous: summaryData.previousInvoices,
                current: summaryData.currentInvoices,
                period: "month",
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.currentTransactions}
            </div>
            <p className="text-xs text-muted-foreground">
              {showPercentageChange({
                current: summaryData.currentTransactions,
                previous: summaryData.previousTransactions,
                period: "month",
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryData.currentIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {showPercentageChange({
                previous: summaryData.previousIncome,
                current: summaryData.currentIncome,
                period: "month",
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

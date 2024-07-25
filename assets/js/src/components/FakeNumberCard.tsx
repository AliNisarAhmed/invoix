import React from "react";
import { Skeleton } from "./ui/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { ReceiptText } from "lucide-react";

export function FakeNumberCard() {
  return (
    <Skeleton className="bg-gray-100 rounded-xl">
      <Card className="bg-gray-100 blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <ReceiptText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{12}</div>
          <p className="text-xs text-muted-foreground">xxx from last month</p>
        </CardContent>
      </Card>
    </Skeleton>
  );
}

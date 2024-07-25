import React from 'react';
import { FakeCurrencyCard } from "./FakeCurrencyCard";
import { FakeNumberCard } from "./FakeNumberCard";

export function SummaryLoading() {
  return (
    <>
      <h3 className="text-gray-400">This month so far...</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FakeCurrencyCard />
        <FakeNumberCard />
        <FakeNumberCard />
        <FakeCurrencyCard />
      </div>
    </>
  );
}

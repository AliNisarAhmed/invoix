# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Invoix.Repo.insert!(%Invoix.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Invoix.Repo.insert!(%Invoix.Financials.Invoice{
  status: "not_paid",
  date: DateTime.utc_now() |> DateTime.truncate(:second),
  ref_no: "abc123",
  amount: Decimal.new(1, 4200, 2),
  client_name: "Ali Ahmed"
})

Invoix.Repo.insert!(%Invoix.Financials.Invoice{
  status: "paid",
  date: DateTime.utc_now() |> DateTime.add(86400 * 3, :second) |> DateTime.truncate(:second),
  ref_no: "abc124",
  amount: Decimal.new(1, 4200, 2),
  client_name: "Ali Ahmed"
})

Invoix.Repo.insert!(%Invoix.Financials.Invoice{
  status: "paid",
  date: DateTime.utc_now() |> DateTime.add(-86400 * 3, :second) |> DateTime.truncate(:second),
  ref_no: "abc125",
  amount: Decimal.new(1, 2400, 2),
  client_name: "Ali Ahmed"
})

Invoix.Repo.insert!(%Invoix.Financials.Transcation{
  date: DateTime.utc_now() |> DateTime.add(86400 * 4, :second) |> DateTime.truncate(:second),
  description: "Paid for services",
  ref_no: "abc124",
  amount: Decimal.new(1, 4200, 2)
})

Invoix.Repo.insert!(%Invoix.Financials.Transcation{
  date: DateTime.utc_now() |> DateTime.add(86400, :second) |> DateTime.truncate(:second),
  description: "Paid for services",
  ref_no: "abc125",
  amount: Decimal.new(1, 2400, 2)
})

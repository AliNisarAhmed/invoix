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

import Ecto.Query, warn: false
alias Invoix.Repo
alias Invoix.Accounts.User
alias Invoix.Financials.Invoice

guest = Repo.one(from u in User, where: u.email == "guest@guest.com")

if is_nil(guest) do
  Repo.insert(
    %User{}
    |> User.registration_changeset(%{
      email: "guest@guest.com",
      password: "guest"
    })
  )
end

for i <- 1..1000 do
  Invoix.Repo.insert!(
    %Invoice{}
    |> Invoice.changeset(%{
      status: if(rem(i, 2) == 0, do: "paid", else: "not_paid"),
      date: DateTime.utc_now() |> DateTime.add(-86400 * i, :second) |> DateTime.truncate(:second),
      ref_no: "INV-#{to_string(i) |> String.pad_leading(5, "0")}",
      amount: Decimal.new(1, i * 100, 2),
      client_name: if(rem(i, 2) == 0, do: "Ali Ahmed", else: "Azlan Ali"),
      user_id: guest.id
    })
  )
end

# Invoix.Repo.insert!(%Invoix.Financials.Invoice{
#   status: "not_paid",
#   date: DateTime.utc_now() |> DateTime.truncate(:second),
#   ref_no: "abc123",
#   amount: Decimal.new(1, 4200, 2),
#   client_name: "Ali Ahmed"
# })
#
# Invoix.Repo.insert!(%Invoix.Financials.Invoice{
#   status: "paid",
#   date: DateTime.utc_now() |> DateTime.add(86400 * 3, :second) |> DateTime.truncate(:second),
#   ref_no: "abc124",
#   amount: Decimal.new(1, 4200, 2),
#   client_name: "Ali Ahmed"
# })
#
# Invoix.Repo.insert!(%Invoix.Financials.Invoice{
#   status: "paid",
#   date: DateTime.utc_now() |> DateTime.add(-86400 * 3, :second) |> DateTime.truncate(:second),
#   ref_no: "abc125",
#   amount: Decimal.new(1, 2400, 2),
#   client_name: "Ali Ahmed"
# })
#
# Invoix.Repo.insert!(%Invoix.Financials.Transcation{
#   date: DateTime.utc_now() |> DateTime.add(86400 * 4, :second) |> DateTime.truncate(:second),
#   description: "Paid for services",
#   ref_no: "abc124",
#   amount: Decimal.new(1, 4200, 2)
# })
#
# Invoix.Repo.insert!(%Invoix.Financials.Transcation{
#   date: DateTime.utc_now() |> DateTime.add(86400, :second) |> DateTime.truncate(:second),
#   description: "Paid for services",
#   ref_no: "abc125",
#   amount: Decimal.new(1, 2400, 2)
# })

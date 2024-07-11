defmodule InvoixWeb.SummaryJSON do
  alias Invoix.Financials.Invoice

  def render_summary(
        %{
          current_revenue: current_revenue,
          previous_revenue: previous_revenue,
          current_num_invoices: current_num_invoices,
          previous_num_invoices: previous_num_invoices,
          current_num_clients: current_num_clients,
          previous_num_clients: previous_num_clients,
          value: value,
          period: period

        } = summary
      ) do
    %{
      current_revenue: current_revenue,
      previous_revenue: previous_revenue,
      current_num_invoices: current_num_invoices,
      previous_num_invoices: previous_num_invoices,
      current_num_clients: current_num_clients,
      previous_num_clients: previous_num_clients,
      period: period,
      value: value
    }
  end

  def getInvoicesForMonth(%{invoices: invoices}) do
    render_invoices(invoices)
  end

  defp render_invoices(invoices) do
    Enum.map(invoices, &render_invoice/1)
  end

  defp render_invoice(%Invoice{} = invoice) do
    invoice
    |> Map.update!(:ref_no, fn ref -> render_ref_no(ref) end)
  end

  defp render_ref_no(ref_no) do
    "INV-#{String.pad_leading(Integer.to_string(ref_no), ref_no_padding(ref_no), "0")}"
  end

  defp ref_no_padding(ref_no) when ref_no > 99999, do: 8
  defp ref_no_padding(_ref_no), do: 5
end

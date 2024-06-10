defmodule InvoixWeb.InvoiceJSON do
  alias Invoix.Financials.Invoice

  def getInvoices(%{invoices: invoices, meta: meta}) do
    %{
      data: render_invoices(invoices),
      pagination: %{
        endCursor: meta.end_cursor,
        hasNextPage: meta.has_next_page?,
        hasPreviousPage: meta.has_previous_page?,
        startCursor: meta.start_cursor,
        pageSize: meta.page_size
      }
    }
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

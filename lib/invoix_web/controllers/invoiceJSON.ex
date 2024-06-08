defmodule InvoixWeb.InvoiceJSON do
  def getInvoices(%{invoices: invoices, meta: meta}) do
    %{
      data: invoices,
      pagination: %{
        endCursor: meta.end_cursor,
        hasNextPage: meta.has_next_page?,
        hasPreviousPage: meta.has_previous_page?,
        startCursor: meta.start_cursor,
        pageSize: meta.page_size
      }
    }
  end
end

defmodule InvoixWeb.UserRegistrationController do
  use InvoixWeb, :controller

  alias Invoix.Accounts
  alias InvoixWeb.UserAuth

  def register(conn, %{"user" => user_params}) do
    case Accounts.register_user(user_params) do
      {:ok, user} ->
        conn
        |> UserAuth.log_in_user(user)

      {:error, changeset} ->
        errors =
          Enum.map(changeset.errors, fn {field, detail} ->
            %{field: field, message: render_message(detail)}
          end)

        conn
        |> Plug.Conn.put_status(400)
        |> json(%{errors: errors})
    end
  end

  defp render_message({message, values}) do
    Enum.reduce(values, message, fn {k, v}, acc ->
      String.replace(acc, "%{#{k}}", to_string(v))
    end)
  end

  defp render_message(message), do: message
end

defmodule InvoixWeb.UserSessionController do
  use InvoixWeb, :controller

  alias Invoix.Accounts
  alias InvoixWeb.UserAuth

  def new(conn, _params) do
    render(conn, :new, error_message: nil)
  end

  def create(conn, %{"user" => user_params}) do
    %{"email" => email, "password" => password} = user_params

    if user = Accounts.get_user_by_email_and_password(email, password) do
      conn
      |> UserAuth.log_in_user(user, user_params)
    else
      # In order to prevent user enumeration attacks, don't disclose whether the email is registered.
      render(conn, :new, error_message: "Invalid email or password")
    end
  end

  def login(conn, %{"user" => user_params}) do
    %{"email" => email, "password" => password} = user_params

    with {:ok, user} <- Accounts.get_user_by_email_and_password(email, password) do
      conn
      |> UserAuth.log_in_user(user, user_params)
    else
      {:error, cause} ->
        conn
        |> Plug.Conn.put_status(400)
        |> json(%{"error" => cause})
    end
  end

  def delete(conn, _params) do
    conn
    |> UserAuth.log_out_user()

    json(conn, %{"success" => true})
  end

  def current_user(conn, _params) do
    with %{} = current_user <- Map.get(conn.assigns, :current_user) do
      json(conn, %{currentUser: %{email: current_user.email}})
    else
      _ -> json(conn, %{currentUser: nil})
    end
  end
end

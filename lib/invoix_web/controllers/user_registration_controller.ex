defmodule InvoixWeb.UserRegistrationController do
  use InvoixWeb, :controller

  alias Invoix.Accounts
  alias Invoix.Accounts.User
  alias InvoixWeb.UserAuth

  def new(conn, _params) do
    changeset = Accounts.change_user_registration(%User{})
    render(conn, :new, changeset: changeset)
  end

  def create(conn, %{"user" => user_params}) do
    case Accounts.register_user(user_params) do
      {:ok, user} ->
        {:ok, _} =
          Accounts.deliver_user_confirmation_instructions(
            user,
            &url(~p"/users/confirm/#{&1}")
          )

        conn
        |> put_flash(:info, "User created successfully.")
        |> UserAuth.log_in_user(user)

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, :new, changeset: changeset)
    end
  end

  def register(conn, %{"user" => user_params}) do
    case Accounts.register_user(user_params) do
      {:ok, user} ->
        conn
        # |> fetch_session([])
        # |> UserAuth.fetch_current_user([])
        |> UserAuth.log_in_user(user)

      {:error, _changeset} ->
        json(conn, %{"error" => "Unable to register"})
    end
  end
end

defmodule InvoixWeb.UserRegistrationControllerTest do
  use InvoixWeb.ConnCase, async: true

  import Invoix.AccountsFixtures

  describe "POST /auth/register" do
    @tag :capture_log
    test "creates account and logs the user in", %{conn: conn} do
      email = unique_user_email()

      conn =
        post(conn, ~p"/auth/register", %{
          "user" => valid_user_attributes(email: email)
        })

      assert get_session(conn, :user_token)
      response = json_response(conn, 200)
      assert response |> Map.get("currentUser") |> Map.get("email") =~ email

      # Now do a logged in request and assert on the menu
      conn = get(conn, ~p"/api/invoices")
      response = json_response(conn, 200)
      assert response["data"] == []
    end

    test "render errors for invalid data", %{conn: conn} do
      conn =
        post(conn, ~p"/auth/register", %{
          "user" => %{"email" => "with spaces", "password" => "too short"}
        })

      response = json_response(conn, 400)
      assert response |> Map.get("errors") |> List.first() |> Map.get("field") =~ "email"

      assert response |> Map.get("errors") |> List.first() |> Map.get("message") =~
               "must have the @ sign and no spaces"
    end
  end
end

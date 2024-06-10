defmodule InvoixWeb.UserSessionControllerTest do
  use InvoixWeb.ConnCase, async: true

  import Invoix.AccountsFixtures

  @current_user_cookie "_invoix_web_current_user"

  setup do
    %{user: user_fixture()}
  end

  describe "POST /auth/login" do
    test "logs the user in", %{conn: conn, user: user} do
      email = user.email

      conn =
        post(conn, ~p"/auth/login", %{
          "user" => %{"email" => email, "password" => valid_user_password()}
        })

      response = json_response(conn, 200)

      assert get_session(conn, :user_token)
      assert %{"currentUser" => %{"email" => email}} == response

      # Now do a logged in request and assert on the menu
      conn = get(conn, ~p"/api/invoices")
      response = json_response(conn, 200)
      assert is_list(response["data"])
      assert is_map(response["pagination"])
    end

    test "emits error message with invalid credentials", %{conn: conn, user: user} do
      conn =
        post(conn, ~p"/auth/login", %{
          "user" => %{"email" => user.email, "password" => "invalid_password"}
        })

      response = json_response(conn, 400)
      assert %{"error" => "Invalid Credentials"} = response
    end
  end

  describe "DELETE /auth/logout" do
    test "logs the user out", %{conn: conn, user: user} do
      conn = conn |> log_in_user(user) |> post(~p"/auth/logout")
      refute get_session(conn, :user_token)
      refute conn.cookies[@current_user_cookie]
      response = json_response(conn, 200)
      assert response["success"]
    end

    test "succeeds even if the user is not logged in", %{conn: conn} do
      conn = post(conn, ~p"/auth/logout")
      refute get_session(conn, :user_token)
      refute conn.cookies[@current_user_cookie]
      response = json_response(conn, 200)
      assert response["success"]
    end
  end
end

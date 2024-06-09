defmodule InvoixWeb.PageControllerTest do
  use InvoixWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, ~p"/")

    html = "<title data-suffix=\" · Phoenix Framework\">\nInvoix\n     · Phoenix Framework</title>\n    <link phx-track-static rel=\"stylesheet\" href=\"/assets/app.css\">\n  </head>\n  <body class=\"bg-white antialiased\">\n    <script defer phx-track-static type=\"text/javascript\" src=\"/assets/index.js\">\n    </script>\n    <div id=\"root\"></div>\n  </body>\n</html>"

    assert html_response(conn, 200) =~ html
  end
end

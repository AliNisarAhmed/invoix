defmodule InvoixWeb.Router do
  use InvoixWeb, :router

  import InvoixWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    # plug :fetch_session
    # plug :fetch_live_flash
    plug :put_root_layout, html: {InvoixWeb.Layouts, :root}
    # plug :protect_from_forgery
    # plug :put_secure_browser_headers
    # plug :fetch_current_user
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :fetch_current_user
  end

  pipeline :auth do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :fetch_current_user
  end

  scope "/api", InvoixWeb do
    pipe_through [:api, :require_authenticated_user]

    get "/transactions", TransactionController, :transactions
    post "/invoices/:invoice_refno/transaction", TransactionController, :createTransaction
    get "/invoices", InvoiceController, :getInvoices
    post "/invoice", InvoiceController, :createInvoice
    get "/summary", SummaryController, :getSummary
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:invoix, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: InvoixWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/auth", InvoixWeb do
    pipe_through :auth

    get "/users/current-user", UserSessionController, :current_user
    post "/register", UserRegistrationController, :register
    post "/login", UserSessionController, :login
    post "/logout", UserSessionController, :delete
  end

  scope "/*path", InvoixWeb do
    pipe_through :browser

    get "/", PageController, :home
  end
end

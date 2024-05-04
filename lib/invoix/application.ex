defmodule Invoix.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      InvoixWeb.Telemetry,
      Invoix.Repo,
      {DNSCluster, query: Application.get_env(:invoix, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Invoix.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Invoix.Finch},
      # Start a worker by calling: Invoix.Worker.start_link(arg)
      # {Invoix.Worker, arg},
      # Start to serve requests, typically the last entry
      InvoixWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Invoix.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    InvoixWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end

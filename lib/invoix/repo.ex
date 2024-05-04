defmodule Invoix.Repo do
  use Ecto.Repo,
    otp_app: :invoix,
    adapter: Ecto.Adapters.Postgres
end

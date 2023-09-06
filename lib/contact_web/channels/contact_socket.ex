defmodule ContactWeb.ContactSocket do
  use Phoenix.Socket

  channel "contact:*", ContactWeb.ContactChannel

  @impl true
  def connect(_params, socket), do: {:ok, socket}

  @impl true
  def id(_), do: "random_id"
end

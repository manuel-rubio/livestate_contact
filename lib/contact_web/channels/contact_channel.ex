defmodule ContactWeb.ContactChannel do
  use LiveState.Channel, web_module: ContactWeb
  alias LiveState.Event
  require Logger

  @derive Jason.Encoder
  defstruct [:name, :email, :message, sent: false]

  @impl true
  def init(_channel, _payload, _socket), do: {:ok, %__MODULE__{}}

  @impl true
  def handle_event("send_contact_form", _params, %__MODULE__{sent: true} = state) do
    event = %Event{name: "message-resent", detail: %{type: "error", message: "cannot resend a contact form, sorry"}}
    {:reply, event, state}
  end

  def handle_event("send_contact_form", params, _state) do
    state = struct(__MODULE__, params)
    Logger.info("sending email (#{state.email}) for #{state.name}: #{state.message}")
    event = %Event{name: "message-sent", detail: %{type: "ok", message: "email sent successfully"}}
    {:reply, event, %__MODULE__{state | sent: true}}
  end
end

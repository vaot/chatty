defmodule ChattyWeb.RoomChannel do
  use Phoenix.Channel

  alias ChattyWeb.Presence
  alias Chatty.Repo
  alias Chatty.Coherence.User
  alias Chatty.Post
  alias Chatty.RoomModel
  alias Chatty.RoomModel.Room
  alias Chatty.Buddies.Friend

  def join("room:" <> chat_id, _payload, socket) do
    send(self, :after_join)
    {:ok, socket}
  end

  def handle_in("message:new:" <> recipient_id = key, payload, socket) do
    user = Repo.get(User, socket.assigns.user_id)

    broadcast! socket, key, %{
      user: user.name,
      message: payload["message"],
      user_id: user.id,
      timestamp: payload["timestamp"]
    }

    {:noreply, socket}
  end

  def handle_in("file:new:" <> recipient_id = key, payload, socket) do
    user = Repo.get(User, socket.assigns.user_id)

    broadcast! socket, key, %{
      user: user.name,
      file: payload["file"],
      index: payload["index"],
      total: payload["total"],
      name: payload["name"],
      type: payload["type"],
      user_id: user.id,
      timestamp: payload["timestamp"]
    }

    {:noreply, socket}
  end

  def handle_in("user:public_key", payload, socket) do
    user = Repo.get(User, socket.assigns.user_id)

    broadcast! socket, "user:public_key", %{
      user_id: user.id,
      public_key: payload["public_key"],
      timestamp: payload["timestamp"]
    }

    {:noreply, socket}
  end

  def handle_in("user:public_key:" <> user_id = key, payload, socket) do
    user = Repo.get(User, socket.assigns.user_id)

    broadcast! socket, key, %{
      user_id: user.id,
      public_key: payload["public_key"],
      timestamp: payload["timestamp"]
    }

    {:noreply, socket}
  end

  def handle_info(:after_join,  socket) do
    user = Repo.get(User, socket.assigns.user_id)

    {:ok, _} = Presence.track(socket, user.name, %{
      online_at: inspect(System.system_time(:seconds)),
      user_id: user.id,
      avatar_url: Chatty.Avatar.url({user.avatar, user}, :thumb)
    })

    push socket, "presence_state", Presence.list(socket)

    {:noreply, socket}
  end

  def terminate(reason, socket) do
    {:noreply, socket}
  end
end

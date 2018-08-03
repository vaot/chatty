defmodule ChattyWeb.Api.V1.FriendView do
  use ChattyWeb, :view

  def render("index.json", %{ friends: friends }) do
    %{ friends: Enum.map(friends, &friend_view/1) }
  end

  def render("changeset_errors.json", changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end

  defp friend_view(friend) do
    %{
      name: friend.name,
      email: friend.email
    }
  end
end

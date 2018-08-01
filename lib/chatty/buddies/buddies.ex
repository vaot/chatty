defmodule Chatty.Buddies do
  @moduledoc """
  The Buddies context.
  """

  import Ecto.Query, warn: false
  alias Chatty.Repo
  alias Chatty.Coherence.User

  alias Chatty.Buddies.Friend

  def make_friend(attrs \\ %{}) do
    %Friend{}
    |> Friend.changeset(attrs)
    |> Repo.insert()
  end

  def get_friends(user_id) do
    q = from u in User, select: u, preload: [:friends], where: u.id == ^user_id
    q
    |> Repo.one
    |> extract_friends
  end

  defp extract_friends(nil), do: []
  defp extract_friends(result), do: result.friends
end

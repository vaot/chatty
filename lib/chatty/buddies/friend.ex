defmodule Chatty.Buddies.Friend do
  use Ecto.Schema
  import Ecto.Changeset
  alias Chatty.Buddies.Friend
  alias Chatty.Coherence.User


  schema "friends" do
    belongs_to :user, User
    belongs_to :friend, User

    # timestamps()
  end

  @doc false
  def changeset(friend, attrs) do
    friend
    |> cast(attrs, [:user_id, :friend_id])
    |> validate_required([:user_id, :friend_id])
  end
end

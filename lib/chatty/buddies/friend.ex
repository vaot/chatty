defmodule Chatty.Buddies.Friend do
  use Ecto.Schema
  import Ecto.Changeset


  schema "friends" do
    field :name, :string
    field :user_id, :id

    timestamps()
  end

  @doc false
  def changeset(friend, attrs) do
    friend
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end

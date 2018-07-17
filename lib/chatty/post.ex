defmodule Chatty.Post do
  use Ecto.Schema
  import Ecto.Changeset


  schema "posts" do
    field :email, :string
    field :name, :string
    field :post, :string
    field :room_id, :string
    field :user_id, :integer

    timestamps()
  end

  @doc false
  def changeset(post, attrs) do
    post
    |> cast(attrs, [:name, :post, :email, :user_id, :room_id])
    |> validate_required([:name, :post, :email, :user_id, :room_id])
  end
end

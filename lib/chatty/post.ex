defmodule Chatty.Post do
  use Ecto.Schema
  import Ecto.Changeset


  schema "posts" do
    field :email, :string
    field :name, :string
    field :post, :string

    timestamps()
  end

  @doc false
  def changeset(post, attrs) do
    post
    |> cast(attrs, [:name, :post, :email])
    |> validate_required([:name, :post, :email])
  end
end

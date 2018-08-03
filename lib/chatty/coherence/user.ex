defmodule Chatty.Coherence.User do
  @moduledoc false
  use Ecto.Schema
  use Coherence.Schema
  use Arc.Ecto.Schema


  schema "users" do
    field :name, :string
    field :email, :string
    field :avatar, Chatty.Avatar.Type
    field :uuid, :string
    many_to_many :friends, Chatty.Coherence.User, join_through: "friends", join_keys: [user_id: :id, friend_id: :id]

    coherence_schema()
    timestamps()
  end

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:name, :email] ++ coherence_fields())
    |> validate_required([:name, :email])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
    |> check_uuid
    |> cast_attachments(params, [:avatar])
    |> validate_coherence(params)
  end

  def changeset(model, params, :password) do
    model
    |> cast(params, ~w(password password_confirmation reset_password_token reset_password_sent_at))
    |> validate_coherence_password_reset(params)
  end

  defp check_uuid(changeset) do
    case get_field(changeset, :uuid) do
      nil ->
        force_change(changeset, :uuid, UUID.uuid1)
      _ ->
        changeset
    end
  end


end

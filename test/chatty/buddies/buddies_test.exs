defmodule Chatty.BuddiesTest do
  use Chatty.DataCase

  alias Chatty.Buddies

  describe "friends" do
    alias Chatty.Buddies.Friend

    @valid_attrs %{name: "some name"}
    @update_attrs %{name: "some updated name"}
    @invalid_attrs %{name: nil}

    def friend_fixture(attrs \\ %{}) do
      {:ok, friend} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Buddies.create_friend()

      friend
    end

    test "list_friends/0 returns all friends" do
      friend = friend_fixture()
      assert Buddies.list_friends() == [friend]
    end

    test "get_friend!/1 returns the friend with given id" do
      friend = friend_fixture()
      assert Buddies.get_friend!(friend.id) == friend
    end

    test "create_friend/1 with valid data creates a friend" do
      assert {:ok, %Friend{} = friend} = Buddies.create_friend(@valid_attrs)
      assert friend.name == "some name"
    end

    test "create_friend/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Buddies.create_friend(@invalid_attrs)
    end

    test "update_friend/2 with valid data updates the friend" do
      friend = friend_fixture()
      assert {:ok, friend} = Buddies.update_friend(friend, @update_attrs)
      assert %Friend{} = friend
      assert friend.name == "some updated name"
    end

    test "update_friend/2 with invalid data returns error changeset" do
      friend = friend_fixture()
      assert {:error, %Ecto.Changeset{}} = Buddies.update_friend(friend, @invalid_attrs)
      assert friend == Buddies.get_friend!(friend.id)
    end

    test "delete_friend/1 deletes the friend" do
      friend = friend_fixture()
      assert {:ok, %Friend{}} = Buddies.delete_friend(friend)
      assert_raise Ecto.NoResultsError, fn -> Buddies.get_friend!(friend.id) end
    end

    test "change_friend/1 returns a friend changeset" do
      friend = friend_fixture()
      assert %Ecto.Changeset{} = Buddies.change_friend(friend)
    end
  end
end

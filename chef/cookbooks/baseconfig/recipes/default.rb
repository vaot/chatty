# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end

execute 'apt_update' do
  command %{
    sudo apt-get update && \
    sudo apt-get -y install build-essential
  }
end

execute 'get_nginx' do
  command 'apt-get install -y nginx'
end

execute 'get_postgres' do
  command %{
    apt-get install -y postgresql && \
    sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres'"
  }
end

execute 'install_node_and_yarn' do
  command %{
    rm -rf /root/.yarn && \
    curl --silent --location https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get -y install nodejs inotify-tools && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
    sudo apt-get update && sudo apt-get -y install yarn
  }
  notifies :run, 'execute[install_erlang_and_elixir]', :immediately
end

execute 'install_erlang_and_elixir' do
  action :nothing
  command %{
    wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb && sudo dpkg -i erlang-solutions_1.0_all.deb && \
    sudo apt-get update && \
    sudo apt-get -y install esl-erlang && \
    sudo apt-get -y --fix-missing install elixir
  }
  notifies :run, 'execute[install_hex]', :immediately
end

execute 'install_hex' do
  action :nothing
  command %{
    cd /home/vagrant/project && mix local.hex --force && mix local.rebar --force
  }
  notifies :run, 'execute[install_deps]', :immediately
end

execute 'install_deps' do
  action :nothing
  command %{
    cd /home/vagrant/project && mix deps.get
  }
  notifies :run, 'execute[assets]', :immediately
end

execute 'assets' do
  action :nothing
  command %{
    cd /home/vagrant/project/assets && yarn install
  }
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"

cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end

# This ensures we run the setup postgres once
file 'init_db_lockfile_11' do
  action :create_if_missing
  notifies :run, 'execute[setup_ecto]', :immediately
end

execute 'ntp_restart' do
  command 'service ntp restart'
end

execute 'setup_ecto' do
  action :nothing
  command "cd /home/vagrant/project && mix ecto.setup"
end

execute 'reload_nginx' do
  command 'sudo nginx -s reload'
  action :nothing
end

cookbook_file 'nginx-default' do
  path "/etc/nginx/sites-available/default"

  notifies :run, 'execute[reload_nginx]', :immediately
end

execute 'start_server' do
  command "mix phx.server"
  cwd "/home/vagrant/project/"
end

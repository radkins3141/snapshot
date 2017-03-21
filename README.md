This code is an HTML 5, Javascript and Ruby mashup whose goal is to build an open source Webcam for browsers that support media capture streams.
=================

### (See [W3C Media Capture and Streams](https://w3c.github.io/mediacapture-main/getusermedia.html)).

The following is a guide for creating a running Webcam service with this project:

### BASIC DEPENDENCIES

* This guide presumes Debian package management. Please adapt for other environments, such as Yum. 
```
sudo apt update
sudo apt upgrade
```

* Install basic dependencies for this project. Some of these packages are not used at the moment but are generally useful and have been included with an eye toward future enhancements:

```
sudo apt install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev nodejs
```

### INSTALL NGINX SSL PROXY

```
sudo apt install nginx
```
* then edit the installed Nginx configuration files by adapting the sample configuration material in the "nginx_configuration_examples" folder of this repo

* Enable the snapshot configuration by creating a symlink from nginx/sites-enabled to nginx/sites-available
```
cd /etc/nginx/sites-enabled
ln -s /etc/nginx/sites-available/snapshot
```

### INSTALL RUBY AND RBENV ENVIRONMENT

```
cd
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install 2.4.0
rbenv global 2.4.0

gem install bundler
rbenv rehash
```

```
cd /opt/snapshot/
bundle install
rbenv rehash
```

### BUILD SSL CERTIFICATE

* Create an SSL certificate and key by generating an OpenSSL self-signed certificate or by using some other method.
* Install the certificate and key in Nginx if using Nginx, or in the local repo if using sslsnap.rb. Note that your certificate and key are protected from remote access by .gitignore.

### RUN SERVER SIDE OF PROJECT

* Then run unicorn, if using an Nginx proxy:

```
  unicorn -c ./unicorn.rb -E development
```

* or, run sslsnap.rb for a stand-alone interface:

```
  ruby sslsnap.rb
```

### RUN CLIENT SIDE WEBCAM ON A PHONE OR OTHER DEVICE

* Place the URL pointing to the Snapshot service in the location bar of the Chrome or Firefox browser

    https://[address of host running Snapshot service]/camera_harness.html

* Then, experiment with the Debug Mode checkbox and with the pulldown selection menu for choosing an available camera device

* Try taking a snapshot and notice the return code and text message returned from the Snapshot service

* Experiment with various snapshot delay intervals

* Debug mode and delay interval default to 'off' and '3600' respectively. Any changes to these values are remembered until the browser is restarted.

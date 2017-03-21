require "rubygems"
require 'sinatra'
require "sinatra/base"
require 'webrick/https'

module Sinatra
  class Application
    def self.run!
      certificate_content = File.open(ssl_certificate).read
      key_content = File.open(ssl_key).read

      server_options = {
        :Host => bind,
        :Port => port,
        :SSLEnable => true,
        :SSLCertificate => OpenSSL::X509::Certificate.new(certificate_content),
        :SSLPrivateKey => OpenSSL::PKey::RSA.new(key_content)
      }

      Rack::Handler::WEBrick.run self, server_options do |server|
        [:INT, :TERM].each { |sig| trap(sig) { server.stop } }
        server.threaded = settings.threaded if server.respond_to? :threaded=
        set :running, true
      end
    end
  end
end

set :bind, '0.0.0.0'
set :port, 443
set :ssl_certificate, "server.crt"
set :ssl_key, "server.key"
set :target_dir, "/opt/snapshot/tmp/"

get '/' do
  send_file("html/index.html")
end

get '/camera_harness.html' do
  send_file("html/camera_harness.html")
end

get '/js/:f' do
  send_file("html/js/#{params[:f]}")
end

post '/upload' do
  cam = {}
  params.select{|k,v| k =~ /^phonecam_/ && cam = v} # select on date suffixed key
  unless cam &&
         (tmpfile = cam[:tempfile]) &&
         (name = cam[:filename])
    return "No uploaded file found"
    #return "params: #{params}"
  end
  STDERR.puts "Uploading file, original name #{name.inspect}"
  content = ""
  while blk = tmpfile.read(65536)
    content += blk
  end
  File.open(settings.target_dir+name, 'wb') {|f| f.write content }
  "Upload complete<br/>#{Time.now.strftime('%m-%e-%y %H:%M')}"
end


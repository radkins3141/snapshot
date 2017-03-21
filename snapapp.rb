require "rubygems"
require "sinatra/base"

$target_dir = "./tmp/"
class SnapApp < Sinatra::Base
  get '/snaps' do
    "Sample camera phone snapper using Joseph Huckaby's WebcamJS together with nginx and unicorn."
  end
  
  get '/snaps/js/webcamjs/demos/:f' do
    send_file("js/webcamjs/demos/#{params[:f]}")
  end

  get '/snaps/js/webcamjs/:f' do
    send_file("js/webcamjs/#{params[:f]}")
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
    File.open($target_dir+name, 'wb') {|f| f.write content }
    "Upload complete<br/>#{Time.now.strftime('%m-%e-%y %H:%M')}"
  end
end


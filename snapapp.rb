require "rubygems"
require "sinatra/base"

$target_dir = "./tmp/"
class SnapApp < Sinatra::Base
  post '/upload' do
    cam = {}
    params.select{|k,v| k =~ /^phonecam_/ && cam = v} # select on date suffixed key
    unless cam &&
           (tmpfile = cam[:tempfile]) &&
           (name = cam[:filename])
      return "No uploaded file found"
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


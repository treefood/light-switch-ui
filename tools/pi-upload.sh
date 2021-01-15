filename=light-switch-ui-linux-armv7l
fileext=.tar
id=light-switch
appname=light-switch-ui
user=pi
server=192.168.86.153

echo removing old tar ball

rm $filename$fileext

7z a $filename -ttar $filename

sftp -i $id $user@$server << EOF
put $filename$fileext /home/$user
quit
EOF

ssh -i $id $user@$server << EOF
rm -rf $filename
echo $filename$fileext
tar -xvf $filename$fileext
chmod 777 $filename/$appname
sudo shutdown -r +1
echo Your Light Switch will restart in 1 minute. Goodbye!
exit
EOF
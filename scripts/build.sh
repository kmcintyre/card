if [ ! -f 'jquery.min.js' ]; then
	echo "get jquery"  
	wget http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
fi
node r.js -o build.js
~/git/6998159/s3copy.py -b www.blackjack4all.com -f ../build/index.js -t index.js -p public-read
~/git/6998159/s3copy.py -b www.blackjack4all.com -f ../html/index.html -t index.html -p public-read
~/git/6998159/s3copy.py -b www.blackjack4all.com -f ../html/require.js -t require.js -p public-read
~/git/6998159/s3copy.py -b www.blackjack4all.com -f ../html/table.css -t table.css -p public-read
~/git/6998159/s3copy.py -b www.blackjack4all.com -f ../html/table_blackjack.css -t table_blackjack.css -p public-read

# Gets relevant terms for style and mood
# Unnecessary to be updated terribly frequently; will do by hand?

import urllib2
import json

raw=urllib2.urlopen("http://developer.echonest.com/api/v4/artist/list_terms?api_key="+API_KEY+"&format=json&type=style").read()
data= json.loads(raw)
termFile=open("js/terms.js","w")
termFile.write("var styleTerms=['none'")
i=0
for term in data['response']['terms']:
    i=i+1
    termFile.write("'"+term['name'].replace("'","\\'")+"',")
    if(i%10 == 0):
        termFile.write('\n')

termFile.seek(-1,1)
termFile.write('];\n\n')
raw=urllib2.urlopen("http://developer.echonest.com/api/v4/artist/list_terms?api_key="+API_KEY+"&format=json&type=mood").read()
data= json.loads(raw)
termFile.write("var moodTerms=['none',")
i=0
for term in data['response']['terms']:
    i=i+1
    termFile.write("'"+term['name'].replace("'","\\'")+"',")
    if(i%10 == 0):
        termFile.write('\n')

termFile.seek(-1,1)
termFile.write('];\n\n')

termFile.close()

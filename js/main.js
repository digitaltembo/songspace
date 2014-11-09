var earth;
var audioPlayer;
var latLong, pLatLong = [0, 0];
var markers=[];
var mCount=0;
var id, pid;
var elemArt, elemSong, elemArtist;

var data;

function initialize() {
    earth = new WE.map('earth_div');
    WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(earth);
    setInterval(loop, 10000);
    audioPlayer=document.getElementById("audio");
    elemArt=document.getElementById("albumArt");
    elemSong=document.getElementById("songName");
    elemArtist=document.getElementById("artistName");
}
function loop() 
{
    latLong = earth.getCenter();
    if ((Math.abs(latLong[0] - pLatLong[0]) + Math.abs(latLong[1] - pLatLong[1])) * earth.getZoom() > 20)
    {
        console.log((Math.abs(latLong[0] - pLatLong[0]) + Math.abs(latLong[1] - pLatLong[1])));
        pLatLong = latLong;
        playPopularMusic(latLong);
    }
}
function playSpotifyTrack(trackID, artist, song) 
{
    var x = new XMLHttpRequest();
    var theURL="https://api.spotify.com/v1/tracks/"+trackID;
    x.open("GET", theURL, false);
    x.send(null);
    var sdata=JSON.parse(x.responseText);
    var songSrc=data.preview_url;
    audioPlayer.setAttribute("src", songSrc);
    audioPlayer.play();
    if(data.album.images.length==3){
        elemArt.setAttribute("src",data.album.images[2].url);
    }
    elemSong.innerHTML=song;
    elemArtist.innerHTML="by "+artist;
    for(var i=0;i<data.album.images.length;i++){
        var img=data.album.images[i];
        console.log(img.width);
    }
    
}
function playPopularMusic(latLong) 
{
    bounds = earth.getBounds();
    if (bounds == null) 
    {
        console.log("hey!");
    } 
    else 
    {
        console.log("boo!");
        var x = new XMLHttpRequest();
        theURL = "http://developer.echonest.com/api/v4/song/search?"+
                "api_key"+api_key+
                "&format=json"+
                "&results=1"+
                "&bucket=id:spotify"+
                "&bucket=tracks"+
                "&bucket=artist_location"+
                "&bucket=song_type"+
                "&min_longitude="+bounds[2]+
                "&max_longitude="+bounds[3]+
                "&min_latitude="+bounds[0]+
                "&max_latitude=" + bounds[1]+
                "&sort="+"song_hotttnesss-desc";
        x.open("GET", theURL, false);
        x.send(null);
        console.log(x.responseText);
        data = JSON.parse(x.responseText);
        if (data != null) 
        {
            if (data.response.status.code == "0") 
            {
                playable=(data.response.songs[0].tracks.length>0);
                artist = data.response.songs[0].artist_name;
                song = data.response.songs[0].title;
                id = data.response.songs[0].id;
                markers[mCount]=WE.marker([data.response.songs[0].artist_location.latitude, 
                                    data.response.songs[0].artist_location.longitude]);
                markers[mCount].addTo(earth)
                markers[mCount].bindPopup("<b>"+song+"</b></br><i>by "+artist + "</i>"+
                                            ((!playable)?"<br/>Unfortunately, this song is not available on Spotify":""));
                markers[mCount].openPopup();
                if(mCount>0)
                    markers[mCount-1].closePopup();
                    
                mCount++;
                    
                if (playable && id != pid) 
                {
                    pid=id;
                    spotifyID=data.response.songs[0].tracks[0].foreign_id;
                    playSpotifyTrack(spotifyID.substr(spotifyID.lastIndexOf(':')+1), artist, song);
                }
            }
        }
    }
}
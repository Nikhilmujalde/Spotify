console.log("Let's start")
let currentSong = new Audio();
let songs;

function convertToMinuteSecond(seconds) {
    // Round the total seconds to ensure it is an integer
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Example usage
console.log(convertToMinuteSecond(2.708768)); // Output: 00:02
console.log(convertToMinuteSecond(66.2323));  // Output: 01:06
console.log(convertToMinuteSecond(21.5));     // Output: 00:21

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/Spotify/Songs");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    let song = []
    for(let index = 0;index<as.length;index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            // .split will split the string or array from /Songs in two parts 
            // string = wlhteowietoit/SongsNikhil
            // after split wlhteowietoit/Songs and second part Nikhil
            song.push(decodeURIComponent(element.href.split("/Songs/")[1]));
            // song.push((element.href.split("/Songs/")[1]));
            // decodeURIComponent will take into account %20 and all the other stuff
        }
    }
    // console.log(song);
    return song;

} 

const playMusic = (track,pause=false)=>{
    // let audio = new Audio( "/Spotify/Songs/" +  track);
    currentSong.src = "/Spotify/Songs/" +  track;
    currentSong.play();
    if(!pause){
        currentSong.play();
    play.src = "pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00/00:00";
}

// let songs = getSongs()
async function main(){
    // get the list of songs
     songs = await getSongs();
    // console.log(songs);

    playMusic(songs[0],true);
    
    // to print the song names on library
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> 
        <img class="invert music" src="music.svg" alt="">
                            <div class="info">
                                <div>${song}</div>
                                <div>Artist Name</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert playbtn" src="playnow.svg" alt="">
                            </div>
         
        </li>`;

        // attach event listner to each song
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
            e.addEventListener("click",element=>{
                console.log(e.querySelector(".info").firstElementChild.innerHTML);
                playMusic(e.querySelector(".info").firstElementChild.innerHTML);
            })
        })
    }

    // attach an event listner to prev and next and play

    // play the songs
    // var audio = new Audio(songs[0]);
    // audio.play();

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg"
        }
        else{
            currentSong.pause();
            play.src = "sound.svg"
        }
    })

    // time update event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${convertToMinuteSecond(currentSong.currentTime)} / ${convertToMinuteSecond(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%";
    })

    // Add event listner to seek bar
    // ham event object tab lete hai jab hame uski range ke sath kuch karna hota hai
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100;
    })

    // add an event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0%";
    })

    // add event listner to close
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    // add event listner to prev and next
    previous.addEventListener("click",()=>{
        console.log("previous clicked");
        let index = songs.indexOf(decodeURI(currentSong.src.split("/").slice(-1)[0]));
        if(index-1 >= 0){
            playMusic(songs[index-1]);
        }
    })

    next.addEventListener("click",()=>{
        console.log("next clicked");
        let index = songs.indexOf(decodeURI(currentSong.src.split("/").slice(-1)[0]));
        if(index+1 < songs.length){
            playMusic(songs[index+1]);
        }
        console.log(songs.length);
    })

    // add event to volume
    //  use [0] to target the first element and necessary if there is only a single element
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e);
        currentSong.volume = e.target.value/100;
    })
} 

main();

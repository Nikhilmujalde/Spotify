console.log("Let's start")
let currentSong = new Audio();
currentSong.volume = 0.5;
let songs;
let currFolder;
let currVol;
function convertToMinuteSecond(seconds) {
    // Round the total seconds to ensure it is an integer
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/Spotify/${currFolder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // .split will split the string or array from /Songs in two parts 
            // string = wlhteowietoit/SongsNikhil
            // after split wlhteowietoit/Songs and second part Nikhil
            songs.push(decodeURIComponent(element.href.split(`/${currFolder}/`)[1]));
            // song.push((element.href.split("/Songs/")[1]));
            // decodeURIComponent will take into account %20 and all the other stuff
        }
    }
    // console.log(song);
    // return song;
    // to print the song names on library
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> 
            <img class="invert music" src="Images/music.svg" alt="">
                                <div class="info">
                                    <div>${song}</div>
                                </div>
                                <div class="playNow">
                                    <span>Play Now</span>
                                    <img class="invert playbtn" src="Images/playnow.svg" alt="">
                                </div>
             
            </li>`;

        // attach event listner to each song
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                console.log(e.querySelector(".info").firstElementChild.innerHTML);
                playMusic(e.querySelector(".info").firstElementChild.innerHTML);
            })
        })
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio( "/Spotify/Songs/" +  track);
    currentSong.src = `${currFolder}/` + track;
    currentSong.play();
    if (!pause) {
        currentSong.play();
        play.src = "Images/pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00/00:00";
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/Spotify/Songs/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".card-container");
    let array = Array.from(anchors);
    // console.log(e.href);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/Songs")) {
            console.log(e.href.split("/").slice(-1)[0]);
            let folder = e.href.split("/").slice(-1)[0];
            if (folder != "Songs") {

                // get the metadata of the folder
                let a = await fetch(`http://127.0.0.1:5500/Spotify/Songs/${folder}/info.json`);

                let response = await a.json();
                console.log(response);
                console.log(cardContainer);
                // console.log()
                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder=${folder} class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="50" fill="#1fdd63" />
                                <svg x="30" y="30" width="60" height="60" viewBox="0 0 20 20">
                                    <path fill="black"
                                        d="M15.544 9.59a1 1 0 0 1-.053 1.728L6.476 16.2A1 1 0 0 1 5 15.321V4.804a1 1 0 0 1 1.53-.848l9.014 5.634Z" />
                                </svg>
                            </svg>
                        </div>
                        <img src="/Songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
            }
        }
    }
        // load the playlist whenever the card is clicked
    // for Each can only be applied to single elements so convert to array
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // target gives us the elements we clicked like in the card there are several elements but current target gives us the element we put event listner to
        e.addEventListener("click", async item => {
            console.log(item);
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
            console.log(songs);
            playMusic(songs[0]);
        })

    })
    console.log(div);
    // let as = div.getElementsByTagName("a");
}

// let songs = getSongs()
async function main() {
    // get the list of songs
    await getSongs("Songs/English");
    // console.log(songs);

    playMusic(songs[0], true);

    // to display all the albums
    displayAlbums();

    // attach an event listner to prev and next and play

    // play the songs
    // var audio = new Audio(songs[0]);
    // audio.play();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "Images/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "Images/sound.svg"
        }
    })

    // time update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${convertToMinuteSecond(currentSong.currentTime)} / ${convertToMinuteSecond(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add event listner to seek bar
    // ham event object tab lete hai jab hame uski range ke sath kuch karna hota hai
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // add an event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    })

    // add event listner to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // add event listner to prev and next
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        let index = songs.indexOf(decodeURI(currentSong.src.split("/").slice(-1)[0]));
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    next.addEventListener("click", () => {
        console.log("next clicked");
        let index = songs.indexOf(decodeURI(currentSong.src.split("/").slice(-1)[0]));
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
        // console.log(songs.length);
    })

    // add event to volume
    //  use [0] to target the first element and necessary if there is only a single element
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e);
        currentSong.volume = e.target.value / 100;
    })

    // add event listner to volume to mute it
    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target.src);
        if(e.target.src.includes("Images/volume.svg")){
            e.target.src = e.target.src.replace("Images/volume.svg","Images/mute.svg");
            currVol = currentSong.volume;
            console.log(currVol);
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("Images/mute.svg","Images/volume.svg");
            // e.target.src = "volume.svg";
            // currVol 
            console.log(currVol);
            currentSong.volume = currVol;
            document.querySelector(".range").getElementsByTagName("input")[0].value = currVol*100;
        }
    })


}

main();

/*
* Author: Chad Cromwell
* Date: Jun 1, 2019
* Description: A simple javascript library that facilitates easy audio overlapping with Audio objects. Useful for game development
*              where you need to replay the same sound in quick succession resulting in overlap. In addition to this, it provides
*              a useful background music player which will play through background music you add. It can shuffle these tracks
*              where it will play a random track once one finishes, however it makes sure it does not repeat the same song twice
*              in a row. You may disable the shuffle option if you do not want to use it.
*
* Functions:    addMusic(key, pathToAudioFile) - Accepts a key for easy array lookup, path to the audio file. Use this function to add background music to your pool of music.
*               addSFX(key, pathToAudioFile, number) - Accepts a key for easy array lookup, path to the audio file, and number of times you want this audio file to be able to overlap. Use this function to add sound effects to your pool of sound effects.
*               playSFX(key) - Accepts a key and plays the corresponding sound effect if it is available from the SFX pool. Use this function to play a sound effect. Simply pass the key you used with addSFX() and it will play.
*               playNextSong() - Plays the next song once track finishes playing. Call this function once with loopThroughMusic as true (default is true) and it will loop through your music. Shuffle is on by default. You have the ability to disable loopThroughMusic, however you'll then need to call other functions manually and this again each time you want to play a song.
*               setFirstTrack(key) - Accepts a key and sets that track to be the first played. Use this function to set the first track that is played if you so desire. If not called, the first track you added will be played first.
*               shuffleOn() - Turns shuffle on. Shuffle is on by default. Shuffle will shuffle your music tracks and make sure that the same song is not repeated in a row
*               shuffleOff() - Turns shuffle off. Useful if you want your music to play in a specific order. Be sure to call addMusic() in the order you wish your music to be played.
*               setMusicVolume(volume, key) - Accepts either both a volume and key parameter or just a volume parameter. The key is used to find the corresponding music track and the volume (number) is used to set that corresponding key to that volume. If only volume is passed, it will set the volume for all tracks.
*               setSFXVolume(volume, key) - Accepts either both a volume and key parameter or just a volume parameter. The key is used to find the corresponding sound effect and the volume (number between 0 and 1) is used to set that corresponding sound effect to that volume. If only volume is passed, it will set the volume for all sound effects.
*               toggleSFX() - Toggles sound effects on or off depending on its current state. Useful for mute/unmute buttons.
*               SFXOn() - Turns on sound effects. Used by toggleSFX(). Useful for a sound effect "on" button.
*               SFXOff() - Turn off sound effects. Used by toggleSFX(). Useful for a sound effect "off" button.
*               toggleMusic() - Toggles music to play or pause depending on its current state. Useful for play/pause or mute/unmute buttons.
*               loopMusicOn() - Causes music to keep playing, once a song is done a new one will play. Music if looped by default. It is highly recommended you do not "unloop" it unless you fully understand how this code works.
*               loopMusicOff() - Causes music to stop playing after one track is played. Music if looped by default. It is highly recommended you do not call this unless you fully understand how this code works.
*/

let pMusic = true; //Whether or not music IS playing
let pSFX = true; //Whether or not sound effects SHOULD be played.
let musicTracks = []; //Holds all music tracks
let sfx = []; //Holds all sound effects
let music; //Holds current music track being played
let musicTracksSize; //Length of music array
let lastRand = 0; //Initialize random track number for when shuffle is turned on
let trackIndex = 0; //What track is currently being played when shuffle is turned off
let init = true; //Whether or not to just play first track or not when playNextSong() function is called
let firstTrackSet = false; //If the user has set the first track or not
let shuffle = true; //Whether or not music should be shuffled. Shuffle does not repeat the same song in a row.
let loopThroughMusic = true; //Whether or not the music should continue playing through all tracks. If disabled the music will stop after one track is played.

//addMusic(key, pathToAudioFile) function - Accepts a key for easy array lookup, path to the audio file
function addMusic(key, pathToAudioFile) {
    musicTracks.push({key: [key], audio: new Audio(pathToAudioFile)}); //Load music and push to musicTracks array
}

//addSFX(key, pathToAudioFile, number) function - Accepts a key for easy array lookup, path to the audio file, and number of times you want this audio file to be able to overlap.
function addSFX(key, pathToAudioFile, number) {
    for(let i = 0; i < number; i++) {
        sfx.push({key: [key], audio: new Audio(pathToAudioFile)}); //Load sound effect and push to sfx array with passed key
    }
}

//playSFX(key) function - Accepts a key and plays the corresponding sound effect if it is available from the SFX pool
function playSFX(key) {
    //If sound effects aren't muted
    if(pSFX) {
        let max = sfx.length; //Get length of sound effect pool
        //Iterate through all sound effects in the passed key pool
        for(let i = 0; i < max; i++) {
            //If the sound effect isn't being played
            if(sfx[i].key == key && sfx[i].audio.paused) {
                let sfxPlayPromise = sfx[i].audio.play(); //Create promise
                //If the file is loaded
                if(sfxPlayPromise !== undefined) {
                    //Then, play the sound effect
                    sfxPlayPromise.then(_ => {
                        sfx[i].audio.play();
                    }).catch(error => { //Else, it's not loaded yet
                       console.log("audio not yet loaded");
                    });
                }
                break; //Break out of loop because we've just played the sound effect
            }
        }
    }
}

//playNextSong() function - Plays the next song once track finishes playing
function playMusic() {
    //If first time being called, play the first song
    if(init) {
        //If the user hasn't set the first track on their own
        if(!firstTrackSet) {
            music = musicTracks[0]; //Set first track to first element in the array
            firstTrackSet = true; //no need to set the first track anymore
        }
        music.audio.play(); //Play first song
        init = false; //No need to initialize anymore
    }
    //Else, initialization has taken place, if the track is done playing and shuffle is turned on
    else if (music.audio.paused && shuffle) {
        let newRand = Math.floor(Math.random() * Math.floor(getMusicTracksSize())); //Generate new random integer for next track
        //If the new random int matches the last one, that means we need to try again to find a new track
        if(lastRand === newRand) {
            playMusic(); //Recursively call this function to try again
        }
        //Else, the new random int doesn't match the last one, we found a new track to play
        else {
            music = musicTracks[newRand]; //Update music to new track
            music.audio.play(); //Play it
            lastRand = newRand; //Update last random int with this current random int
        }
    }
    //Else, if the track is done playing and shuffle is turned off
    else if (music.audio.paused) {
        music = musicTracks[trackIndex]; //Update music to new track with trackIndex
        trackIndex++; //Increment the track index
        //If trackIndex goes beyond the tracks that actually exist
        if(trackIndex > getMusicTracksSize()-1) {
            trackIndex = 0; //Reset trackIndex back to 0
        }
    }
    //If a new track should play after one finishes
    if(loopThroughMusic) {
        music.audio.addEventListener('ended', playMusic); //Attach eventListener to Audio object, Once the song is done playing, play a new song
    }

    //***Nested function, not to be used by user***//
    //getMusicTracksSize() function - Gets the size of the music tracks array
    function getMusicTracksSize() {
        updateMusicTracksSize(); //Update the track size
        return musicTracksSize;

        //updateMusicTracksSize() function - Updates the size variable that keeps track of the musicTracks array
        function updateMusicTracksSize() {
            musicTracksSize = musicTracks.length;
        }
    }
}

//setFirstTrack(key) function - Accepts a key and sets that track to be the first played.
function setFirstTrack(key) {
    //Iterate through all music tracks
    for(let i = 0; i < getMusicTracksSize(); i++ ){
        //If the key matches
        if(musicTracks[i].key == key) {
            music = musicTracks[i]; //Set this track as the current music track
            firstTrackSet = true;
        }
    }

    //***Nested function, not to be used by user***//
    //getMusicTracksSize() function - Gets the size of the music tracks array
    function getMusicTracksSize() {
        updateMusicTracksSize(); //Update the track size
        return musicTracksSize;

        //updateMusicTracksSize() function - Updates the size variable that keeps track of the musicTracks array
        function updateMusicTracksSize() {
            musicTracksSize = musicTracks.length;
        }
    }
}

//shuffleOn() function - Turns shuffle on
function shuffleOn() {
    shuffle = true; //Music will be shuffled
}

//shuffleOff() function - Turns shuffle off
function shuffleOff() {
    shuffle = false; //Music won't be shuffled
}

//setMusicVolume(volume, key) function - Accepts either both a key and volume parameter or just a volume parameter. The key is used to find the corresponding music track and the volume (number) is used to set that corresponding key to that volume. If only volume is passed, it will set the volume for all tracks.
function setMusicVolume(volume, key) {
    //If the user entered a number, proceed
    if(typeof volume === 'number') {
        //If the user passes 2 arguments
        if (arguments.length == 2) {
            setMusicVolume1(volume, key); //Set the music volume for the passed key
        }
        //Else, the user wants to set all music tracks to passed volume
        else {
            setMusicVolume2(volume); //Set the volume for all music tracks
        }
    }
    //Else, they've entered a wrong parameter type
    else {
        let typeOf = typeof volume; //Get the parameter type
        console.log("You've entered a(n): " + typeOf + " as the volume parameter. setMusicVolume() only accepts numbers for the volume parameter."); //Print to console the user error
    }

    //***Nested functions, not to be called directly by user***//
    //setMusicVolume1(volume, key) function - Accepts a key to find the corresponding music track and a volume (number) in which to set the music track to. Used by setMusicVolume() function for function overloading
    function setMusicVolume1(volume, key) {
        //Iterate through all music tracks
        for (let i = 0; i < getMusicTracksSize(); i++) {
            //If the current element matches they passed key
            if (musicTracks[i].key == key) {
                musicTracks[i].audio.volume = volume; //Update the volume
            }
        }
    }

    //setMusicVolume2(volume) function - Accepts a volume (number) in which to set all of the music tracks to. Used by setMusicVolume() function for function overloading
    function setMusicVolume2(volume) {
        //Iterate through all music tracks and set their volume to the passed value
        for(let i = 0; i < getMusicTracksSize(); i++) {
            musicTracks[i].audio.volume = volume; //Update the volume
        }
    }

    //***Nested function, not to be used by user***//
    //getMusicTracksSize() function - Gets the size of the music tracks array
    function getMusicTracksSize() {
        updateMusicTracksSize(); //Update the track size
        return musicTracksSize;

        //updateMusicTracksSize() function - Updates the size variable that keeps track of the musicTracks array
        function updateMusicTracksSize() {
            musicTracksSize = musicTracks.length;
        }
    }
}

//setSFXVolume(volume, key) function - Accepts either both a key and volume parameter or just a volume parameter. The key is used to find the corresponding sound effect and the volume (number between 0 and 1) is used to set that corresponding sound effect to that volume. If only volume is passed, it will set the volume for all sound effects.
function setSFXVolume(volume, key) {
    //If the user entered a number, proceed
    if(typeof volume === 'number') {
        //If user passes 2 arguments
        if (arguments.length == 2) {
            setSFXVolume1(volume, key); //set sound effect volume for passed key
        }
        //Else, the user wants to set all sound effects to passed volume
        else {
            setSFXVolume2(volume); //Set the volume for all sound effects
        }
    }
    //Else, they've entered a wrong parameter type
    else {
        let typeOf = typeof volume; //Get the parameter type
        console.log("You've entered a(n): " + typeOf + " as the volume parameter. setSFXVolume() only accepts numbers for the volume parameter."); //Print to console the user error
    }

    //***Nested functions, not to be called directly by user***//
    //setSFXVolume1(volume, key) function - Accepts a key to find the corresponding sound effect and a volume in which to set the sound effect to. Used by setSFXVolume() function for function overloading.
    function setSFXVolume1(volume, key) {
        console.log("1");
        //Iterate through all sound effects
        for(let i = 0; i < sfx.length; i++) {
            //If the current element matches the passed key
            if(sfx[i].key == key) {
                sfx[i].audio.volume = volume; //Update the sound effect's volume
            }
        }
    }

    //setSFXVolume2(volume) function - Accepts a volume (number) in which to set all of the sound effect sounds to. Used by setSFXVolume() function for function overloading
    function setSFXVolume2(volume) {
        console.log("2");
        //Iterate through all sound effects
        for(let i = 0; i < sfx.length; i++) {
            sfx[i].audio.volume = volume; //Update the sound effect's volume
        }
    }
}

//toggleSFX() function - Toggles sound effects on or off depending on its current state. Useful for mute/unmute buttons.
function toggleSFX() {
    if(pSFX) {
        SFXOff(); //Do not play sound effects
    }
    else {
        SFXOn(); //Play sound effects
    }
}

//SFXOn() function - Turns on sound effects
function SFXOn() {
    pSFX = true; //Play sound effects
}

//SFXOff() function - Turn off sound effects
function SFXOff() {
    pSFX = false; //Do not play sound effects
}

//toggleMusic() function - Toggles music to play or pause depending on its current state. Useful for play/pause or mute/unmute buttons.
function toggleMusic() {
    //If music is playing, pause it
    if(music.audio.paused) {
        pMusic = true; //Music is playing
        music.audio.play(); //Play the music
    }
    //Else, it isn't playing, play it
    else {
        pMusic = false; //Music isn't playing
        music.audio.pause(); //Pause the music
    }
}

//loopMusicOn() function - Causes music to keep playing, once a song is done a new one will play.
function loopMusicOn() {
    loopThroughMusic = true; //Music will be looped
}

//loopMusicOff() function - Causes music to stop playing after one track is played
function loopMusicOff() {
    loopThroughMusic = false; //Music won't be looped
}
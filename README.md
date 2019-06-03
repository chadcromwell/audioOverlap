# audioOverlap
A simple javascript solution for overlapping Audio objects and playing background music. Useful for HTML5 game development.

## Features
* Easy to use
* No dependencies needed (pure javascript)
* Overcomes overlapping limitations of HTML5 with minimal memory load
* Includes a useful background music player with shuffle feature

## Usage

Include:
```
<script src="path/to/audioOverlap.js"></script>
```

### Music
Adding background music:
```
addMusic("song1", "path/to/audioFile.mp3"); //Adds audio file with key: "song1"
addMusic("song2", "path/to/audioFile.mp3"); //Adds audio file with key: "song2"
```

Setting the first track that plays:
```
setFirstTrack("song1"); //Sets the first track to play as "song1"
```

Setting volume for a specific track:
```
setMusicVolume(0.5, "song1"); //Sets "song1" to 50% volume
```

Setting volume for all tracks:
```
setMusicVolume(0.5); //Sets all music tracks to 50% volume
```

Play the music (only need to call once):
```
playMusic(); //Initializes the music and starts playing. Only call this once.
```

Toggle music (play/pause):
```
toggleMusic(); //Toggles music between playing and paused
```

Play music:
```
musicOn(); //Plays music if it is paused, useful if you have seperate play/pause buttons for music
```

Pause music:
```
musicOff(); //Pauses music if it is playing, useful if you have seperate play/pause buttons for music
```

Shuffle music (on by default):
```
shuffleOn(); //Shuffles music tracks, will not repeat the same song twice in a row
```

Do not shuffle music:
```
shuffleOff(); //Does not shuffle music, will play through your music tracks in the order they have been added with addMusic()
```

Loop music so it keeps playing through all tracks (on by default):
```
loopMusicOn(); //Loops through your playlist repeatedly
```

Do not loop music so it only plays one song (do not use unless you fully understand how this code works. Available for specific situations):
```
loopMusicOff(); //Prevents looping, only plays one song
```


### Sound Effects
Adding sound effects:
```
addSFX("effect1", "path/to/audioFile.wav", 4); //Adds 4 of "effect1" to the sound effect pool. 4 can be played overlapping.
addSFX("effect2", "path/to/audioFile.wav", 10); //Adds 10 of "effect2" to the sound effect pool. 10 can be played overlapping.
```

Playing sound effects:
```
playSFX("effect1"); //Plays "effect1" if it is available in the sound effect pool.
```

Setting volume for a specific sound effect:
```
setSFXVolume(0.5, "effect1"); //Sets "effect1" to 50% volume
```

Setting volume for all sound effects:
```
setSFXVolume(0.5); //Sets all sound effects to 50% voume
```

Toggle sound effects (mute/unmute):
```
toggleSFX(); //Toggles sound effects between mute/unmute
```

Turn on sound effects (on by default):
```
SFXOn(); //Turns on sound effects, useful if you have seperate on/off buttons for sound effects
```

Turn off sound effects:
```
SFXOff(); //Turns off sound effects, useful if you have seperate on/off buttons for sound effects
```

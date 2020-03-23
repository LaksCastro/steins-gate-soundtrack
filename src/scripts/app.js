import data, { playlists } from "./data";
import { firstLetterUppercase } from "../utils"
import { renderCategories } from "./carousel";

import simpleAnimations from "./simple-animations"

function getCardHTML(data, isSelected) {
    const { coverSrc: src, name, category } = data;

    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("s-item-wrapper");
    if (isSelected) cardWrapper.classList.add("s-item-wrapper-selected");

    const itemSpan = document.createElement("div");
    itemSpan.classList.add("s-item-span");

    cardWrapper.appendChild(itemSpan);

    const itemCoverWrapper = document.createElement("div");
    itemCoverWrapper.classList.add("s-item-cover-wrapper");

    const itemCover = document.createElement("img");
    itemCover.classList.add("s-item-cover");
    itemCover.src = src;
    itemCover.alt = name;

    itemCoverWrapper.appendChild(itemCover);

    cardWrapper.appendChild(itemCoverWrapper);

    const itemData = document.createElement("div");
    itemData.classList.add("s-item-data");

    const itemTitle = document.createElement("h3");
    itemTitle.classList.add("s-item-title");
    itemTitle.textContent = name;

    const itemDescription = document.createElement("p");
    itemDescription.classList.add("s-item-description");
    itemDescription.textContent = firstLetterUppercase(category);

    itemData.appendChild(itemTitle);
    itemData.appendChild(itemDescription);

    cardWrapper.appendChild(itemData);

    const itemPlayButton = document.createElement("button");
    itemPlayButton.classList.add("s-item-button-play");
    itemPlayButton.classList.add("mdc-icon-button");
    itemPlayButton.classList.add("material-icons");
    itemPlayButton.textContent = isSelected ? "pause" : "play_arrow";

    cardWrapper.appendChild(itemPlayButton);
    return { cardWrapper, itemPlayButton };
}


function init() {
    let currentSong = null;

    let player = this.player;

    const songsWrapper = document.querySelector(".song-list-wrapper");
    const gRandom = document.getElementById("g-random");
    const gPlay = document.getElementById("g-start");

    const { cardAnimation } = simpleAnimations();

    renderCategories();

    gRandom.onclick = () => {
        setCurrentSong(0, true);
        if (player.isPaused) {
            player.togglePlaying();
        }
    }
    gPlay.onclick = () => {
        setCurrentSong(0, false);
        if (player.isPaused) {
            player.togglePlaying();
        }
    }

    player.on(player.events.SONG_CHANGE, updatedPlayer => {
        player = updatedPlayer;
        clearSongs();
        currentSong = {
            ...updatedPlayer.songs[updatedPlayer.currentSong],
            index: updatedPlayer.currentSong
        };
        renderSongs.apply({ ...this, player: updatedPlayer }, [data]);
        simpleAnimations.call(this);
    });
    player.on(player.events.INIT, updatedPlayer => {
        player = updatedPlayer;
        currentSong = {
            ...updatedPlayer.songs[updatedPlayer.currentSong],
            index: updatedPlayer.currentSong
        };
        renderSongs.apply({ ...this, player: updatedPlayer }, [data]);
        simpleAnimations.call(this);
    });
    player.on(player.events.PLAY_TOGGLE, (updatedPlayer) => {
        player = updatedPlayer;
        clearSongs();
        currentSong = {
            ...updatedPlayer.songs[updatedPlayer.currentSong],
            index: updatedPlayer.currentSong
        };
        renderSongs.apply({ ...this, player: updatedPlayer }, [data]);
        simpleAnimations.call(this);
    });

    function render(updatedPlayer) {
        player = updatedPlayer;
        clearSongs();
        currentSong = {
            ...updatedPlayer.songs[updatedPlayer.currentSong],
            index: updatedPlayer.currentSong
        };
        renderSongs.apply({ ...this, player: updatedPlayer }, [data]);
        // simpleAnimations.call(this);
    }
    function clearCardAnimations(songs) {
        songs.forEach(item => {
            simpleAnimations.call(this);
        });
    }
    function setCurrentSong(index, useRandom, songs = false) {
        if (index === currentSong.index && !useRandom) return;

        if (songs)
            player.songs = songs;

        currentSong = {
            ...player.songs[player.currentSong],
            index
        };
        player.play.apply(player, [index, useRandom]);
    }
    function clearSongs() {
        const childsToRemove = [...songsWrapper.childNodes];
        Array.from({ length: childsToRemove.length }).forEach((_, i) =>
            songsWrapper.removeChild(childsToRemove[i]));
    }
    function renderSongs(songs) {
        songs.forEach((song, i) => {
            const isSelected = i === currentSong.index;

            const {
                cardWrapper: card,
                itemPlayButton: playButton
            } = getCardHTML(song, isSelected);

            if (isSelected) {
                playButton.textContent = player.isPaused ? "play_arrow" : "pause";
            } else {
                playButton.textContent = "play_arrow";
            }

            card.onclick = () => {
                setCurrentSong(i, false, songs);
                console.log("b");
            }
            playButton.onclick = (e) => {
                e.stopPropagation();

                if (currentSong.index === i) {
                    player.togglePlaying();
                } else {
                    setCurrentSong(i, false, songs);
                    if (player.isPaused) {
                        player.togglePlaying();
                    }
                }
                playButton.textContent = player.isPaused ? "play_arrow" : "pause";
            }
            cardAnimation.createAnimation(card, isSelected);


            songsWrapper.appendChild(card);
        });
    }
}

export default {
    init
}
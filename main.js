// ==UserScript==
// @name         Shiki Anime OP/ED
// @version      1.1.3
// @description  Отображает опенинги и эндинги на странице аниме
// @namespace    http://shikimori.me/
// @author       ShaDream & Chortowod
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @connect      myanimelist.net
// @icon         https://www.google.com/s2/favicons?domain=shikimori.me
// @copyright    2023, ShaDream, Chortowod (https://openuserjs.org/users/ShaDream)
// @updateURL    https://openuserjs.org/meta/Chortowod/Shiki_Anime_OPED.meta.js
// @downloadURL  https://openuserjs.org/install/Chortowod/Shiki_Anime_OPED.user.js
// @require      https://gist.githubusercontent.com/Chortowod/814b010c68fc97e5f900df47bf79059c/raw/chtw_settings.js?v1
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==

let settings = new ChtwSettings('chtwOPandED', '<a target="_blank" href="https://openuserjs.org/scripts/Chortowod/Shiki_Anime_OPED">OP/ED</a>');
let debug;

function initSettings() {
    settings.createOption('youtube', 'Поиск по "Исполнитель - название"', false);
    settings.createOption('youtubeSimple', 'Поиск по "Аниме OP"', false);
    settings.createOption('isDebug', 'Режим отладки', false);
    settings.createOption('isFull', 'opening вместо op в поиске', false);
    settings.getOption('isLeft');
    debug = settings.getOption('isDebug');
}


let engAnime = document.querySelector('meta[property="og:title"]').content;

const insertAfter = (elem,refElem) => refElem.parentNode.insertBefore(elem,refElem.nextSibling);

function log (message) { debug&&console.log(message) }

function createMusic(elements,placeToAppend) {
    elements.forEach((element, i)=> {
        let sound=document.createElement("span");
        let fst = element[0];
        let check = element.indexOf('(ep');
        let substringS = element.substring((fst == "#" ? 4 : 0), check);
        let substringF = element.substring(fst == "#" ? 4 : 0);
        sound.innerText=element;
        sound.className="value sound";
        placeToAppend.appendChild(sound);
        log(placeToAppend);
        log(engAnime);
        // раскомментировать для включения ссылок на ютуб (в классе по умолчанию стоит true и это странно)
        // if (settings.getOption('youtube')) sound.appendChild(getYoutubeLink(sound, check, substringS, substringF));
        // if (settings.getOption('youtubeSimple')) sound.appendChild(getTitleSimpleSearchLink(placeToAppend.classList.contains('op'), i));
    })
}


function getYoutubeLink(sound, check, substringS, substringF) {
    let sound2=document.createElement("a");
    sound2.innerText=" -> YouTube";
    sound2.target="_blank";
    sound2.href = `https://www.youtube.com/results?search_query=${(check != -1 ? substringS : substringF).replace(/[0-9]*:  /g,"")}`;
    return sound2;
}

function getTitleSimpleSearchLink(check, number = 0) {
    let title = engAnime;
    log(title);
    let sound2=document.createElement("a");
    sound2.innerText=" / YouTube (simple)";
    sound2.target="_blank";
    let text = '';
    if (settings.getOption('isFull')) {
        text = check ? ' opening' : ' ending';
    }
    else {
        text = check ? ' op' : ' ed';
    }
    if (number) {
        text += ' '+(number+1);
    }
    sound2.href = `https://www.youtube.com/results?search_query=${title}${text}`;
    return sound2;
}

function musicConstructor (main,text,items) {
    let container=document.createElement("div");
    let addedClassName = "OP'S" === text ? " op" : " ed";
    container.className="sound-container"+addedClassName;
    main.appendChild(container);
    let title=document.createElement("div");
    title.innerText=text;
    title.className="subheadline m5";
    container.appendChild(title);
    createMusic(items,container);
}

function createOPEDList(op,ed) {
    log(op);
    if (0!=op.length||0!=ed.length) {
        // Create main div and paste in in a right place
        let main=document.createElement("div");
        let paste_after=document.getElementsByClassName("b-db_entry")[0];
        //Create open button if needed
        if (main.className="main-sound-container",insertAfter(main,paste_after),
            //Create content
            musicConstructor(main,"OP'S",op),musicConstructor(main,"ED'S",ed),op.length>4||ed.length>4) {
            main.style.maxHeight='150px';
            let expand_container=document.createElement("div");
            insertAfter(expand_container,main);
            expand_container.className="b-height_shortener open-music";
            let shade=document.createElement("div");
            shade.className="shade";
            expand_container.appendChild(shade);
            let expander=document.createElement("div");
            expander.className="expand";
            expand_container.appendChild(expander);
            let span=document.createElement('span');
            span.innerText="Развернуть";
            expander.appendChild(span);
            expand_container.onclick=function() {
                expand_container.parentNode.removeChild(expand_container);
                main.style.animation='height 15s cubic-bezier(.19,1,.22,1) forwards';
            }
        }
        //apply styles
        createStyle();
    }
}

function createStyle(){
    // Here you can change style of all new elements
    settings.addStyle(".main-sound-container{margin-bottom:15px; overflow:hidden}.sound-container{display:inline-block; vertical-align:top; width: 48%;}.op{margin-right:3%;}.sound{padding-top:5px; margin:5px; display: block;}.open-music{margin-bottom:15px;}@keyframes height {from{max-height:150px;} to {max-height: 2000px;}}");
}

function getMusic(doc,class_name) {
    let music=doc.getElementsByClassName("theme-songs js-theme-songs "+class_name)[0];
    log(music);
    let childs=[];
    let authors = music.getElementsByClassName("theme-song-artist");
    let counter = 1;
    for (var i = 0; i < authors.length; i++){
        let td = authors[i].parentNode;
        let episodes = td.getElementsByClassName("theme-song-episode")[0];
        if (episodes) episodes = episodes.textContent;
        else episodes = '';
        let songName = td.getElementsByClassName("theme-song-title")[0];
        if (songName) {
            log(songName.textContent + authors[i].textContent + ' ' + episodes);
            childs.push(counter + ': ' + songName.textContent + authors[i].textContent + ' ' + episodes);
        }
        else {
            for (let songName2 of td.childNodes) {
                if (songName2.nodeType === 3) {
                    log(songName2.textContent + authors[i].textContent);
                    childs.push(counter + ': ' + songName2.textContent + authors[i].textContent + ' ' + episodes);
                    break;
                }
            }
        }
        counter++;
    }
    log(childs);
    return childs;
}

function loadMal() {
    "use strict";
    if ( !isAnimePage() || isAdded() ) return;
    let animeId = window.location.pathname.replace('/animes/',"").replace(/-.*/gm,"");
    let url=`https://myanimelist.net/anime/${animeId}`;
    log("Finding OP/ED.");
    GM_xmlhttpRequest( {
        method:"GET",url:url,onload:function(response) {
            let doc=(new DOMParser).parseFromString(response.responseText,'text/html');
            log(doc);
            createOPEDList( getMusic(doc,"opnening"), getMusic(doc,"ending") );
            log("OP/ED finded!");
        }
    })
}

function isAnimePage() { return window.location.pathname.includes("/animes/") }

function isAdded() { return document.getElementsByClassName("main-sound-container").length > 0 }

function ready(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") fn();
    else document.addEventListener('DOMContentLoaded', fn);
}

ready(initSettings);
ready(loadMal);
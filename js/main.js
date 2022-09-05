const player = {
    data: {
        autor: 'Sidoka',
        album: 'Merci',
        musica: 'Goztosa'
    },

    faixa: document.getElementById('player_faixa'),
    icon: document.getElementById('player_icon'),

    audio: document.getElementById('player_audio'),
    volume: document.getElementById('player_volume'),

    play: document.getElementById('player_play'),
    back: document.getElementById('player_back'),
    next: document.getElementById('player_next'),

    cTime: document.getElementById('faixa_currentTime'),
    fTime: document.getElementById('faixa_finishedTime'),
    timeline: document.getElementById('player_timeline'),


    start() {

        this.volume.addEventListener('change', () => {
            this.audio.volume = this.volume.value / 100;
        })

        this.play.addEventListener('click', () => {
            return this.playing(this.play.alt);
        })


        this.audio.addEventListener('timeupdate', () => {
            this.timeline.value = this.audio.currentTime;
            this.cTime.innerHTML = Events.secondsToMinute(this.timeline.value);
        })

        this.audio.addEventListener('ended', () => {
            this.playing('pause');
        })


        this.timeline.addEventListener('mousedown', () => {
            this.playing('pause');
        })

        this.timeline.addEventListener('mouseup', () => {
            this.audio.currentTime = Number(this.timeline.value);
            this.playing('play')
        })
    },

    update() {

        var DATA = this.data;
        var DIR = `musicas/${DATA.autor}/${DATA.album}`;

        var faixaMusica = document.getElementById('faixa_musica');
        var faixaCantor = document.getElementById('faixa_cantor');

        faixaMusica.innerHTML = DATA.musica;
        faixaCantor.innerHTML = `${DATA.autor}, ${DATA.album}`;

        this.icon.src = `${DIR}/icon.png`;
        this.audio.src = `${DIR}/${DATA.musica}/audio.mp3`;
        this.audio.volume = this.volume.value / 100;

        this.audio.onloadeddata = () => {
            this.timeline.value = '0';
            this.timeline.max = this.audio.duration;
            this.fTime.innerHTML = Events.secondsToMinute(this.timeline.max);
        }


    },

    playing(force) {
        if (this.data != undefined) {

            var playButton = this.play.querySelector('img');

            if (force) {
                playButton.alt = force;
            }

            playButton.alt = (playButton.alt === 'play' ? 'pause' : 'play');
            playButton.src = `images/${playButton.alt}.png`;

            switch (playButton.alt) {
                case 'play': {
                    this.audio.pause();
                } break;

                case 'pause': {
                    this.audio.play();
                } break;
            }
        }

    },


}

var Cantores = {
    ['Sidoka']: {
        albums: {
            ['Merci']: {
                ano: 2020,
                musicas: ['Goztosa', 'Jaguar', 'qq cê tá insinuando'],
            },
        }
    },
    ['Mariana Froes']: {
        albums: {
            ['Single']: {
                ano: 2021,
                musicas: ['Moça', 'Abril', 'Rosa e Laranja'],
            },
        }
    },
    ['Matuê']: {
        albums: {
            ['Máquina do Tempo']: {
                ano: 2020,
                musicas: ['Máquina do Tempo', '777-666', 'É Sal'],
            },
        }
    },
    ['Jorge e Mateus']: {
        albums: {
            ['Os Anjos Cantam']: {
                ano: 2015,
                musicas: ['Calma', 'Logo Eu', 'Nocaute'],
            },
        }
    },
}


function setData(settings) {

    player.data = settings;
    player.update();
    player.playing('play');

}

function putLetter(DIR,Musica) {
    var musicaLetra = document.querySelector('#music-letra');
    var musicaNoma = document.querySelector('#musica-nome');

    musicaNoma.innerHTML = Musica;

    jQuery.get(`${DIR}/letra.txt`, function (txt) {
        musicaLetra.innerHTML = txt;
    })
    
}


function SearchMusic() {

            var SearchResult = document.querySelector('#search-result');
            SearchResult.innerHTML = '';

            var Achei = false;
            var blacklist = [
                '',
                ' ',
            ]

            if (!Events.findInArray(blacklist, this.value)) {
                for (let _autor in Cantores) {
                    var Albums = Cantores[_autor].albums;

                    for (let _album in Albums) {
                        var Album = Albums[_album];
                        var DIR = `musicas/${_autor}/${_album}`;

                        for (let _musica in Album.musicas) {

                            var Musica = Album.musicas[_musica];
                            var Num = (Number(_musica) + 1);

                            if (Events.filterText(Musica, this.value) || this.value == '-todas') {
                                Achei = true;

                                Events.createElements(SearchResult, true, {

                                    div_back: {
                                        Attribute: {
                                            class: 'p-3 rounded mb-1 col-12 clearfix',
                                            id: `musica_${Events.ignoreInText(Musica, ' ')}`,
                                            style: {
                                                'background-color': 'rgb(26,44,54)',
                                            },
                                            onclick: `putLetter('${DIR}/${Musica}','${Musica}')`
                                        }
                                    },

                                    div_icon: {
                                        Close: true,
                                        Content: `<img class="w-100" src="${DIR}/icon.png"></img>`,
                                        Attribute: {
                                            class: 'icon col-2 float-sm-start',
                                        }
                                    },

                                    div_info: {
                                        Close: true,
                                        Attribute: {
                                            class: 'info col-7 float-sm-start ms-2',
                                        }
                                    },

                                    div_button: {
                                        Close: false,
                                        Attribute: {
                                            class: `text-center col-2 float-sm-end y-center`
                                        }
                                    },

                                    button: {
                                        Close: true,
                                        Content: '<img class="w-100" src="images/play.png" alt="">',
                                        Attribute: {
                                            onclick: `setData({autor:'${_autor}',album:'${_album}',musica:'${Musica}'})`
                                        }
                                    }

                                })

                                Events.createElements(SearchResult.querySelector(`#musica_${Events.ignoreInText(Musica, ' ')} .info`), true, {
                                    h6: {
                                        Close: true,
                                        Content: `${_album}/${Musica}`,
                                    },

                                    label_ano: {
                                        Close: true,
                                        Content: Album.ano,
                                        Attribute: {
                                            class: 'col-12'
                                        }
                                    },

                                    label_autor: {
                                        Close: true,
                                        Content: _autor,
                                        Attribute: {
                                            class: 'col-12'
                                        }
                                    },
                                })
                            }
                        }
                    }
                }

                if (!Achei) {
                    SearchResult.innerHTML = 'Música não encontrada..'
                }
            }

        }

function ListAlbum() {
            var AlbumsElement = document.querySelector('#albums-container');
            AlbumsElement.innerHTML = '';

            for (let _autor in Cantores) {
                var Albums = Cantores[_autor].albums;

                for (let _album in Albums) {
                    var Album = Albums[_album];
                    var DIR = `musicas/${_autor}/${_album}`;

                    var thisAlbum = `album_${Events.ignoreInText(_autor, ' ')}_${Events.ignoreInText(_album, ' ')}`

                    Events.createElements(AlbumsElement, true, {

                        div: {
                            Attribute: {
                                id: thisAlbum,
                                class: 'text-start float-sm-start col-5 p-3 rounded mb-1 me-1',
                            }
                        },

                        div_header: {
                            Close: true,
                            Attribute: {
                                class: 'header clearfix col-12',
                            }
                        },

                        div_main: {
                            Close: true,
                            Attribute: {
                                class: 'main clearfix col-12 mt-3',
                            }
                        }

                    })


                    var DivFirst = document.querySelector(`#${thisAlbum}`);
                    var DivHeader = document.querySelector(`#${thisAlbum} .header`);
                    var DivMain = document.querySelector(`#${thisAlbum} .main`);


                    Events.createElements(false, true, {

                        div_icon: {
                            Close: true,
                            Parent: DivHeader,
                            Content: `<img class="w-100" src="${DIR}/icon.png" alt="">`,
                            Attribute: {
                                class: 'icon col-2 float-sm-start',
                            }
                        },

                        div_info: {
                            Parent: DivHeader,
                            Attribute: {
                                class: 'info float-sm-start ms-2',
                            }
                        },
                    })

                    Events.createElements(false, true, {
                        h6_album: {
                            Parent: DivHeader.querySelector('.info'),
                            Close: true,
                            Content: _album,
                        },

                        label_ano: {
                            Parent: DivHeader.querySelector('.info'),
                            Close: true,
                            Content: Album.ano,
                        },

                        label: {
                            Parent: DivFirst.querySelector('.main'),
                            Content: `#${Album.musicas.length} faixas`
                        },

                        ul: {
                            Parent: DivFirst.querySelector('.main')
                        }
                    })


                    for (let _musica in Album.musicas) {

                        var Musica = Album.musicas[_musica];

                        var Num = (Number(_musica) + 1);
                        var NumList = Num < 10 ? '0' + Num : Num;

                        Events.createElements(DivMain.querySelector('ul'), true, {
                            li: {
                                Close: false,
                            },
                            button: {
                                Close: true,
                                Content: `${NumList}. - ${Musica}`,
                                Attribute: {
                                    class: ['btn col-6 text-start'],
                                    onclick: `setData({autor:'${_autor}',album:'${_album}',musica:'${Musica}'})`,
                                }
                            }
                        })
                    }
                }
            }
        }




ListAlbum();


    document.querySelectorAll(`#buttons-catalog button`).forEach((button) => {

        button.addEventListener('click', () => {

            document.querySelectorAll('#containers-list>div').forEach((div) => {


                if (div.id == button.name) {
                    div.style.display = 'block';

                } else {
                    div.style.display = 'none';
                }
            })

        })
    })

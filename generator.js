
class AudioManager {
    constructor() {
        this.playbackList = [];
    }

    clearList() {
        this.playbackList = [];
    }

    addToList(path) {
        console.log('* In Liste: ' + path);
        this.playbackList.push(path);
    }

    play() {
        for (var a in this.playbackList)
            AudioManager.createAudio(this.playbackList[a], 'audio' + a);

        for (var e = 0; e < this.playbackList.length - 1; e++) {
            $('#audio' + e).on('ended', function () {
                var next = parseInt(this.id.replace('audio', '')) + 1;
                AudioManager.playAudio('audio' + next);
            });
        }

        AudioManager.playAudio('audio0');

        this.clearList();
    }

    static createAudio(path, id) {
        $('#' + id).remove();
        $("body").prepend('<audio id="' + id + '" src="' + path + '" type="audio/wav" style="display: none;"></audio>');
    }

    static playAudio(id) {
        console.log('* Spiele ' + id);
        $('#' + id).get(0).play();
    }

}

class GeneratorEinfahrt {

    static generate() {
        var playback = new AudioManager();
        var gleis = $('#einfahrtGleis').val();
        var zuggattung = $('#einfahrtZuggattung').val().toLowerCase();
        var zugnummer = $('#einfahrtZugnummer').val();
        var ziel = $('#einfahrtZiel').val();
        var via = $('#einfahrtVia').val();
        var abfahrtStunde = $('#einfahrtAbfahrtStunde').val();
        var abfahrtMinute = $('#einfahrtAbfahrtMinute').val();
        var verspaetet = document.getElementById('einfahrtVerspaetung').checked;


        playback.addToList('/audio/gong.mp3'); //Gong

        for (var langNo in langu) {
            var lang = langu[langNo];

            playback.addToList('/audio/' + lang + '/worte/' + (lang === 'dt' ? 'gleis' : 'gleis_en') + '.mp3'); //Gleis
            ZahlenManager.parseZahl(playback, gleis, true, lang); //Gleiszahl
            playback.addToList('/audio/' + lang + '/worte/' + (lang === 'dt' ? 'einfahrt' : 'einfahrt_en') + '.mp3'); //Einfahrt
            playback.addToList('/audio/' + lang + '/arten/hoch/' + zuggattung + '.mp3'); //Zuggattung
            ZahlenManager.parseZahl(playback, zugnummer, true, lang); //Zugnummer
            playback.addToList('/audio/' + lang + '/worte/' + (lang === 'dt' ? 'nach' : 'nach_en') + '.mp3'); //nach
            if (via !== '0') {
                playback.addToList('/audio/' + lang + '/ziele/hoch/' + ziel); //nach (hoch!)
                playback.addToList('/audio/' + lang + '/worte/' + (lang === 'dt' ? 'ueber' : 'ueber_en') + '.mp3'); //über
                playback.addToList('/audio/' + lang + '/ziele/tief/' + via); //via
            } else
                playback.addToList('/audio/' + lang + '/ziele/tief/' + ziel); //nach (tief!)

            if (verspaetet)
                playback.addToList('/audio/' + lang + '/worte/' + (lang === 'dt' ? 'abfahrt_ur' : 'abfahrt_ur_en') + '.mp3'); //Abfahrt ursprünglich
            else
                playback.addToList('/audio/' + lang + '/worte/' + (lang === 'dt' ? 'abfahrt' : 'abfahrt_en') + '.mp3'); //Abfahrt

            playback.addToList('/audio/' + lang + '/stunden/' + (abfahrtStunde < 10 ? '0' + abfahrtStunde : abfahrtStunde) + '.mp3'); //Abfahrt Stunde
            playback.addToList('/audio/' + lang + '/minuten/' + (abfahrtMinute < 10 ? '0' + abfahrtMinute : abfahrtMinute) + '.mp3'); //Abfahrt Stunde
            playback.addToList('/audio/' + lang + '/worte/' + (lang === 'dt' ? 'vorsicht' : 'attention') + '.mp3'); //Vorsicht bei der Einfahrt
        }
        playback.play();
    }
}


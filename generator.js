
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


        playback.addToList('/audio/gong/513/513_2.wav'); //Gong

        for (var langNo in langu) {
            var lang = langu[langNo];

            playback.addToList('/audio/' + lang + '/module_3_1/' + (lang === 'dt' ? '016' : lang === 'en' ? '023' : '042') + '.wav'); //Gleis
            ZahlenManager.parseZahl(playback, gleis, true, lang); //Gleiszahl
            playback.addToList('/audio/' + lang + '/module_3_1/' + (lang === 'dt' ? '012' : '022') + '.wav'); //Einfahrt
            playback.addToList('/audio/' + lang + '/zuggattungen/hoch/' + zuggattung + '.wav'); //Zuggattung
            ZahlenManager.parseZahl(playback, zugnummer, true, lang); //Zugnummer
            playback.addToList('/audio/' + lang + '/module/' + (lang === 'dt' ? '0054' : '0049') + '.wav'); //nach
            if (via !== '0') {
                playback.addToList('/audio/' + lang + '/ziele/variante2/hoch/' + ziel); //nach (hoch!)
                playback.addToList('/audio/' + lang + '/module_3_1/' + (lang === 'dt' ? '035' : '035') + '.wav'); //über
                playback.addToList('/audio/' + lang + '/ziele/variante2/tief/' + via); //via
            } else
                playback.addToList('/audio/' + lang + '/ziele/variante2/tief/' + ziel); //nach (tief!)

            if (verspaetet)
                playback.addToList('/audio/' + lang + '/module_3_1/' + (lang === 'dt' ? '002' : '027') + '.wav'); //Abfahrt ursprünglich
            else
                playback.addToList('/audio/' + lang + '/module_3_1/' + (lang === 'dt' ? '001' : '008') + '.wav'); //Abfahrt

            playback.addToList('/audio/' + lang + '/zeiten/stunden/hoch/' + (abfahrtStunde < 10 ? '0' + abfahrtStunde : abfahrtStunde) + '.wav'); //Abfahrt Stunde
            playback.addToList('/audio/' + lang + '/zeiten/minuten/tief/' + (abfahrtMinute < 10 ? '0' + abfahrtMinute : abfahrtMinute) + '.wav'); //Abfahrt Stunde
            playback.addToList('/audio/' + lang + '/module_3_1/' + (lang === 'dt' ? '046' : '005') + '.wav'); //Vorsicht bei der Einfahrt
        }
        playback.play();
    }

}


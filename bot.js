const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var isReady = true;
var lastChannel = null;
var lastVoice = null;

client.on('ready', () => {
    console.log("Ready!");
});

client.on('message', message => {
    if (isReady && message.content.substring(0, 1) == '!') {
        console.log('Recieved command "'+message.content+'"');
        lastChannel = message.channel;
        var args = message.content.substring(1).split(' ');
        var cmd = args[0].toLowerCase();

        args = args.splice(1);
        switch(cmd) {

            case 'gonktts':
            case 'gonk':
                if (args.length < 1){
                    if (cmd === 'gonktts') {
                        message.channel.send("Gonk!", {tts: true})
                            .then(message => console.log(`Sent TTS message: ${message.content}`))
                            .catch(console.error);
                    } else {
                        message.channel.send("Gonk!")
                            .then(message => console.log(`Sent message: ${message.content}`))
                            .catch(console.error);
                    }
                } else {
                    var words = [];
                    for (var i = 0, len = args.length; i < len; i++) {
                        if (args[i].length >= 4) words.push(args[i]);
                    }
                    if (words.length == 0) {
                        if (cmd === 'gonktts') {
                            message.channel.send("Gonk!", {tts:true});
                        } else {
                            message.channel.send("Gonk!");
                        }
                    } else {
                        var r = Math.floor(Math.random()*words.length);
                        var word = words[r];
                        var t = Math.floor(Math.random()*(word.length-4));
                        var newWord = word.substring(0,t);
                        for (var i = 0; i < 4; i++) {
                            character = word.charAt(i);
                            if (!isNaN(character * 1)){
                                newWord += 'gonk'.charAt(i).toLowerCase();
                            } else {
                                if (character == character.toUpperCase()) {
                                    newWord += 'gonk'.charAt(i).toUpperCase();
                                }
                                if (character == character.toLowerCase()){
                                    newWord += 'gonk'.charAt(i).toLowerCase();
                                }
                            }
                        }
                        newWord += word.substring(t+4);
                        newMessage = args;
                        newMessage[args.indexOf(word)] = newWord;
                        if (cmd === 'gonktts') {
                            message.channel.send(newMessage.join(" "), {tts:true})
                                .then(message => console.log(`Sent TTS message: ${message.content}`))
                                .catch(console.error);
                        } else {
                            message.channel.send(newMessage.join(" "))
                                .then(message => console.log(`Sent message: ${message.content}`))
                                .catch(console.error);
                        }

                    }
                }
            break;

            case 'jojo':
                soundPlayer(args, jojo_sounds, 'jojo', message);
            break;

            case 'animemes':
            case 'anime':
                soundPlayer(args, anime_sounds, 'anime', message);
            break;

            case 'hots':
            case 'heroes':
                soundPlayer(args, hots_sounds, 'hots', message);
            break;

            default:
                console.log('Invalid command');
        }
    }
});

var jojo_sounds = {
'yaredaze': 'yaredaze.mp3',
'yareyaredaze': 'yaredaze.mp3',
'muda': 'muda4.mp3',
'ora': 'ora.mp3',
'oraora': 'oradarby.mp3',
//'oraoraora': 'ora206.mp3',
'zawarudo': 'zawarudo2.mp3',
'theworld': 'zawarudo2.mp3',
'zawarudoeffect': 'zawarudosound.mp3',
'theworldeffect': 'zawarudosound.mp3',
'baseball': 'ohbaseball.mp3',
'selectyourcar': 'serectcar.mp3',
'serectyourcar': 'serectcar.mp3',
'car': 'serectcar.mp3',
'konodioda': 'konodio.mp3',
'roadrollerda': 'roadroller.mp3',
'roadroller': 'roadroller.mp3',
'omg': 'omg2.mp3',
'no': 'no4.mp3',
'yes': 'yes6.mp3',
'killdaho': 'killdaho.mp3',
'hermitpurple': 'hermit.mp3',
'ohno': 'ohno2.mp3',
'jojo': 'joooojo.mp3',
'joooojo': 'joooojo.mp3',
'holyshit': 'holys.mp3',
'goodbye': 'goodbye.mp3',
'goodbyejojo': 'goodbye.mp3',
'wry': 'WRYYYY.wav',
'wryy': 'WRYYYY.wav',
'wryyy': 'WRYYYY.wav',
'wryyyy': 'WRYYYY.wav',
'sonochinosadame': 'Sono.wav',
'killerqueen': 'killerqueen.wav',
'dora': 'dora.wav',
'dorarara': 'dora.wav',
'roundabout': 'roundabout.mp3',
'tbc': 'roundabout.mp3',
'tobecontinued': 'roundabout.mp3',
'morioh': 'moriohcho.wav',
'moriohcho': 'moriohcho.wav',
'radio': 'moriohcho.wav'
}

var anime_sounds = {
'stupid': 'stupid.mp3',
'whatareyoustupid': 'stupid.mp3',
'tirofinale': 'tirofinale.wav',
'onepunch': 'punch.wav',
'punch': 'punch.wav',
'opm': 'opmtheme.wav',
'nani': 'nani.mp3',
'alreadydead': 'omae-wa-mou-shindeiru.mp3',
'omae': 'omae-wa-mou-shindeiru.mp3',
'omaewamoushindeiru': 'omae-wa-mou-shindeiru.mp3',
'tuturu': 'tuturu.mp3'
}

var hots_sounds = {
'sobeit': 'sobeit.wav',
'hatred': 'hatred.ogx',
'notprepared': 'prepared.ogx',
'stukovshove': 'StukovBase_Ultimate1UsedEnemy00.mp3',
'stukovhadenough': 'StukovBase_Ultimate1Used01.mp3',
'stukovpermission': 'StukovBase_IntroResponse_Dismissive00.mp3',
'stukovdegenerate': 'StukovBase_IntroResponse_Degenerate00.mp3',
'stukovfire': 'StukovBase_IntroResponse_Angry00.mp3',
'stukovgoodtoseeyou': 'StukovBase_IntroQuestion_Positive00.mp3',
'stukovsuffer': 'StukovBase_Attack02.mp3',
'stukovwillnotdo': 'StukovBase_AI_Uhoh01.mp3',
'nothingpersonal': 'Nova_Kill00.mp3',
'nothingpersonnel': 'Nova_Kill00.mp3',
'bwlimbfromlimb': 'Brightwing_Pissed11.mp3',
'bwhappy': 'Brightwing_Pissed11.mp3',
'bweasy': 'Brightwing_KillSpreeEnd00.mp3',
'bwsuffer': 'Brightwing_Kill03.mp3',
'bwscaryvoice': 'Brightwing_IntroResponse_Abathur00.mp3',
'bwhurt': 'Brightwing_Attack06.mp3',
'bwinsides': 'Brightwing_AI_Attack02.mp3',
'byfirebepurged': 'RagnarosBase_Ultimate2Used00.mp3',
'byfire': 'RagnarosBase_Ultimate2Used00.mp3',
'dieinsects': 'RagnarosBase_Ultimate1Used02.mp3'
}

function generateList(sounds) {
    list = {}
    for (var i = 0; i < Object.keys(sounds).length; i++) {
        soundfile = sounds[Object.keys(sounds)[i]];
        sound = Object.keys(sounds)[i];
        if (soundfile in list){
            list[soundfile].push(sound);
        } else {
            list[soundfile] = [sound];
        }
    }
    liststr = "```\n"
    for (var i = 0; i < Object.keys(list).length; i++) {
        commands = list[Object.keys(list)[i]];
        if (commands.length == 1) {
            liststr+=commands[0]+'\n';
        } else {
            liststr+=commands[0]+' < '+commands.splice(1).join(", ")+' >\n';
        }
    }
    liststr+= "```"
    console.log(liststr);
    return liststr;
}

function soundPlayer(args, sounds, folder, message) {
    if (args.length > 0) {
        sound = args[0];
        if (sound == 'help') {
            console.log('displaying help')
            message.channel.send("Avaliable sounds to play:\n"+generateList(sounds))
                .then(message => console.log(`Sent message: ${message.content}`))
                .catch(console.error);
            return;
        }
        if (sound in sounds) {
            console.log('Playing sound "'+folder+'/'+sounds[sound]+'"');
            playFile(message.member.voiceChannel, './sounds/'+folder+'/'+sounds[sound]);
        }
    }
}

function playFile(voiceChannel, file) {
    isready = false;
    if (voiceChannel == undefined) {
        console.log("User must be in a channel");
        return;
    }
    lastVoice = voiceChannel;
    voiceChannel.join().then(connection => {
        const dispatcher = connection.playFile(file);
        dispatcher.on("end", end => {voiceChannel.leave();isready = true;});
    }).catch(err => console.log(err));
}

rl.on('line', (input) => {
    console.log(`Received: ${input}`);


        var args = input.split(' ');
        var cmd = args[0].toLowerCase();

        args = args.splice(1);
        switch(cmd) {
            case 'say':
                if (lastChannel != null) {
                    lastChannel.send(args.join(" "))
                        .then(message => console.log(`Sent message: ${message.content}`))
                        .catch(console.error);
                }
            break;
            case 'tts':
                if (lastChannel != null) {
                    lastChannel.send(args.join(" "), {tts:true})
                        .then(message => console.log(`Sent message: ${message.content}`))
                        .catch(console.error);
                }
            break;
            case 'play':
                if (lastVoice != null) {
                    console.log(args[0]);
                    playFile(lastVoice, args[0]);
                }
            break;
            case 'wtf':
                var lineReader = require('readline').createInterface({
                    input: require('fs').createReadStream('./gonk.txt')
                });
                lineReader.on('line', function (line) {
                    lastChannel.send(line, {tts:true})
                        .then(message => console.log(`Sent message: ${message.content}`))
                        .catch(console.error);
                });
        }
});

process.stdin.resume();// Black box so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
        console.log('Disconnected');
        client.destroy();
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}



//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {cleanup:true, exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

client.login(auth.token);

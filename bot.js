const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
var isReady = true;

client.on('ready', () => {
    console.log("Ready!");
});

client.on('message', message => {
    if (isReady && message.content.substring(0, 1) == '!') {
        console.log('Recieved command "'+message.content+'"');
        var args = message.content.substring(1).split(' ');
        var cmd = args[0].toLowerCase();

        args = args.splice(1);
        switch(cmd) {

            case 'gonktts':
            case 'gonk':
                if (args.length < 1){
                    if (cmd === 'gonktts') {
                        console.log('tts');
                        message.channel.send("Gonk!", {tts: true})
                            .then(message => console.log(`Sent TTS message: ${message.content}`))
                            .catch(console.error);
                    } else {
                        message.channel.send("Gonk!")
                            .then(message => console.log(`Sent message: ${message.content}`))
                            .catch(console.error);
                    }
                } else {
                    console.log("Begin gonk algorithm");
                    var words = [];
                    for (var i = 0, len = args.length; i < len; i++) {
                        if (args[i].length >= 4) words.push(args[i]);
                        console.log('Adding word '+ args[i]);
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
                                .then(message => console.log('Sent TTS message: ${message.content}'))
                                .catch(console.error);
                        } else {
                            message.channel.send(newMessage.join(" "))
                                .then(message => console.log('Sent message: ${message.content}'))
                                .catch(console.error);
                        }

                    }
                }
            break;

            case 'jojo':
                if (args.length > 0) {
                    sound = args[0];
                    if (sound in sounds) {
                        console.log('Playing sound "'+sound+'"');
                        playFile(message, sounds[sound]);
                    }
                }
            break;

            default:
                console.log('Invalid command');
        }
    }
});

var sounds = {
'yaredaze': 'yaredaze',
'yareyaredaze': 'yaredaze',
'muda': 'muda4',
'ora': 'ora',
'oraora': 'oradardy',
//'oraoraora': 'ora206',
'zawarudo': 'zawarudo2',
'zawarudoeffect': 'zawarudosound',
'baseball': 'ohbaseball',
'selectyourcar': 'serectcar',
'serectyourcar': 'serectcar',
'car': 'serectcar',
'konodioda': 'konodio',
'roadrollerda': 'roadroller',
'roadroller': 'roadroller',
'omg': 'omg2',
'no': 'no4',
'yes': 'yes6',
'killdaho': 'killdaho',
'hermitpurple': 'hermit',
'ohno': 'ohno2'
}

function playFile(message, file) {
    isready = false;
    var voiceChannel = message.member.voiceChannel;
    voiceChannel.join().then(connection => {
        const dispatcher = connection.playFile('./sounds/'+file+'.mp3');
        dispatcher.on("end", end => {voiceChannel.leave();isready = true;});
    }).catch(err => console.log(err));
}

client.login(auth.token);

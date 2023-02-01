const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

const uwu = require('uwuifier');
const uwuifier = new uwu.Uwuifier({
	spaces: {
        faces: 0.05,
        actions: 0.005,
        stutters: 0.05
    },
    words: 1,
    exclamations: 0.4});

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('uwu')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		messagecontent = interaction.targetMessage.content;
				
		console.log(`Uwuing message: ${messagecontent}`);
		uwumessage = uwuifier.uwuifySentence(messagecontent);
		//uwumessage.replace("\*", "\\\*");
		
		interaction.reply(uwumessage)
	},
};
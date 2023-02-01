const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gonk')
		.setDescription('Gonk!'),
	async execute(interaction) {
		await interaction.reply('Gonk!');
	},
};
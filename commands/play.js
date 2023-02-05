const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState } = require('@discordjs/voice');
const path = require('node:path');

const sound_lists = require('../sound_list.js')
const soundsPath = path.join(__dirname, '../sounds');

let main_command = new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play an audio clip!')
		
for (const command in sound_lists) {
	main_command = main_command.addSubcommand(subcommand => subcommand
						.setName(command)
						.setDescription(`Play a "${command}" audio clip`)
						.addStringOption(option =>
							option.setName('clip')
								.setDescription('Clip to play')
								.setAutocomplete(true)
								.setRequired(true)
							)
						);
}

module.exports = {
	data: main_command,
	async execute(interaction) {
		const category = interaction.options.getSubcommand(true);
		const clip = interaction.options.getString('clip');
		if (Object.keys(sound_lists[category]).includes(clip)){
			const sound_file_name = sound_lists[category][clip];
			const sound_file = path.join(soundsPath, category, sound_file_name)
			
			// Check for existing connection
			let connection = getVoiceConnection(interaction.guild.id);
			const preexisting = (connection != undefined)
			if (!preexisting) {
				const channel = interaction.member.voice.channel;
				if (channel == undefined) {
					await interaction.reply({ content: `You must be in a voice channel!`, ephemeral: true });
					return;
				}
				connection = joinVoiceChannel({
					channelId: channel.id,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				});
				
			}
			
			
			// Play clip to connection
			const player = createAudioPlayer();

			player.on('error', error => {
				console.error('Error:', error.message, 'with track', error.resource.metadata.title);
			});

			player.on('stateChange', (oldState, newState) => {
				console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
			});
			
			const resource = createAudioResource(sound_file);

			// console.log(sound_file);
			// console.log(resource);

			player.play(resource);
			connection.subscribe(player);

			// Cleanup
			player.on(AudioPlayerStatus.Idle, () => {
				player.stop();
				
				if (!preexisting) {
					connection.destroy();
				}
			});
			
			try {
				await entersState(player, AudioPlayerStatus.Playing, 5_000);
				await interaction.reply({ content: `Playing ${clip}`, ephemeral: true });
			} catch (error) {
				await interaction.reply({ content: `Error playing ${clip}!`, ephemeral: true });
				console.log(error);
			}
			
		} else {
			await interaction.reply({ content: `Sound clip ${clip} not found in category ${category}!`, ephemeral: true });
		}
	},
	async autocomplete(interaction) {
		const category = interaction.options.getSubcommand(true);
		const focusedOption = interaction.options.getFocused(true);
		const focusedValue = interaction.options.getFocused();
		const choices = Object.keys(sound_lists[category])
		const filtered = choices.filter(choice => choice.includes(focusedValue)).sort(choice => choice.startsWith(focusedValue) ? -1 : 0).slice(0,25);
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
};
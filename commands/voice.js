const { SlashCommandBuilder, CommandInteractionOptionResolver} = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('voice')
		.setDescription('Have the bot join or leave a voice channel, to avoid it constantly connecting/disconnecting')
		.addSubcommand(subcommand => subcommand
			.setName('join')
			.setDescription('Join your voice channel')
		)
		.addSubcommand(subcommand => subcommand
			.setName('leave')
			.setDescription('Leave current voice channel')
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand(true);
		if (subcommand == 'join') {
			interaction.deferReply({ephemeral: true });
			const channel = interaction?.member?.voice?.channel;
			if (channel == undefined) {
				await interaction.reply({ content: `You must be in a voice channel!`, ephemeral: true });
				return;
			}
			const connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: interaction.guild.id,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});

			connection.on('stateChange', (oldState, newState) => {
				console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
			});
			
			interaction.client.on('debug', console.log);
			connection.on('debug', console.log);
			
			
			connection.on(VoiceConnectionStatus.Destroyed, async (oldState, newState) => {
				if (timer) clearInterval(timer);
			});
			
			connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
				try {
					await Promise.race([
						entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
						entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
					]);
					// Seems to be reconnecting to a new channel - ignore disconnect
				} catch (error) {
					// Seems to be a real disconnect which SHOULDN'T be recovered from
					connection.destroy();
				}
			});

			try {
				await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
				await interaction.editReply({ content: `Joined ${channel.name}!`, ephemeral: true });

				const timer = setInterval(() => {
					const num_members = interaction.guild.voiceStates.cache.get(interaction.client.user.id)?.channel?.members?.size ?? 1;
					console.log(`Number of members in channel: ${num_members}`)
					if (connection == undefined || num_members <= 1) {
						try {
							console.log('destroying connection');
							connection?.destroy();
						} catch (error) {
							console.log(error);
						}
						if (timer) clearInterval(timer);
					}
				}, 30000);
			} catch (error) {
				console.log(error);
				await interaction.editReply({ content: `Error joining ${channel.name}!`, ephemeral: true });
			}

		} else if (subcommand  == 'leave') {
			const connection = getVoiceConnection(interaction?.guild.id);
			if (connection == undefined) {
				await interaction.reply({ content: `Not in a voice channel!`, ephemeral: true });
			} else {
				connection.destroy();
				await interaction.reply({ content: 	`Leaving voice`, ephemeral: true });
			}
		}
		
	},
};
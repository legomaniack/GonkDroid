const { SlashCommandBuilder} = require('discord.js');
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
			
			const timer = setInterval(() => {
				const num_members = channel?.members?.size ?? 1;
				console.log(`Number of members in channel: ${num_members}`)
				if (connection == undefined || num_members == 1) {
					connection?.destroy();
					clearInterval(timer);
				}
			}, 30000);

			try {
				await entersState(connection, VoiceConnectionStatus.Ready, 5_000);
				await interaction.reply({ content: `Joined ${channel.name}!`, ephemeral: true });
			} catch (error) {
				await interaction.reply({ content: `Error joining ${channel.name}!`, ephemeral: true });
				console.log(error);
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
const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

const { Configuration, OpenAIApi } = require('openai');

const { open_ai_key } = require('../auth.json');

const configuration = new Configuration({
    organization: "org-BfIWcPBAoAZR6L9HcIPkaZvi",
    apiKey: open_ai_key,
});
const openai = new OpenAIApi(configuration);

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('urianger')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		messagecontent = interaction.targetMessage.content;
		
        interaction.deferReply();
        try {
            // const completion = await openai.createEdit({
            //     model: "text-davinci-edit-001",
            //     input: messagecontent,
            //     instruction: `Rewrite this using the character Urianger from Final Fantasy XIV's speech mannerisms`,
            //     temperature: 0.9,
            // });
    
            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `Rewrite the message in the style of the character Urianger from Final Fantasy XIV. Use an archaic and formal manner, often using old-fashioned words and sentence structures.\n\nMessage: ${messagecontent}`,
                temperature: 0.9,
                max_tokens: 2048,
            });

            console.log(completion.data.choices[0].text);
            
            await interaction.editReply(completion.data.choices[0].text);
        }
		catch (error) {
            console.error(error);
            await interaction.editReply('An error has occured');
        }
	},
};
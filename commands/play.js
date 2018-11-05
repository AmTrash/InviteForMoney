

const ytdl = require(`ytdl-core`);


exports.run = async (client, message, args, ops) => {
  if (!message.member.voiceChannel) return message.channel.send(`Please connect to a voice channel to hear some jam.`);
  if (message.guild.me.voiceChannel) return message.channel.send(`Sorry, the bot is already connected to the guild.`);
  if(!args[0]) return message.channel.send(`Sorry, please input a url following the command.`);
  let validate = await ytdl.validateURL(args[0]);

  if (!validate) {
    let commandFile = require(`./search.js`);
    return commandFile.run(client, message, args, ops);
  }
  let info = await ytdl.getInfo(argas[0]);
  let connection = await message.member.voiceChannel.join();
  let dispatcher = await connectiong.play(ytdl(args[0], { filter: `audioonly` }));
  message.channel.send(`Alright now am playing ${info.title}`);
}

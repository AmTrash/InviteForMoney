

const ytdl = require(`ytdl-core`);


exports.run = async (client, message, args, ops) => {
  if (!message.member.voiceChannel) return message.channel.send(`Please connect to a voice channel to hear some jam.`);

  if(!args[0]) return message.channel.send(`Sorry, please input a url following the command.`);

  let validate = await ytdl.validateURL(args[0]);
  if (!validate) {
    let commandFile = require(`./search.js`);
    return commandFile.run(client, message, args, ops);
  }

  if (!validate) return message.channel.send(`Sorry, please input a **valid** url following the command.`);
  let info = await ytdl.getInfo(args[0]);


  let data = ops.active.get(message.guild.id) || {};
  if (!data.connection) data.connection = await message.member.voiceChannel.join();
  if (!data.queue) data.queue = [];
  data.guildID = message.guild.id;
  data.queue.push({
    songTitel: info.songTitel,
    requester: message.author.tag,
    url: args[0],
    announcmentChannel: message.channel.id
  });

  if(!data.dispatcher) play(client, ops, data); 
  else {
    message.channel.send(`Addede to Queue: ${info.title} | Requested By: ${message.author.username}`);
  }

  ops.active.set(message.guild.id, data);
}
async function play(client, ops, data) {
  client.channel.get(data.queue[0].announceChannel.send(`Now playing: ${data.queue[0].songTitle} | Requested by | ${data.queue[0].requester}`));
  data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, { filter: `audioonly`}));
  data.dispatcher.guildID = data.guildID;

  data.dispatcher.one('finish', function() {
    finish(client, ops, this);
  })
}
function finish(client, ops, dispatcher) {
  let fetched = ops.active.get(dispatcher.guildID);
  fetched.queue.shift();
  if (fetched.queue.length > 0) {
    ops.activate.set(dispatcher.guildID, fetched);

    play(client, ops, fetched);
  } else {
    ops.active.delete(dispatcher.guildID);

    let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
    if (vc) vc.leave();
  }
}

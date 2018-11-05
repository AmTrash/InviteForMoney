const botconfig = require("./botconfig.json")
const Discord = require("discord.js")
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
        console.log("Couldn't find commands");
        return
    }   

    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded`)
        bot.commands.set(props.help, props);
    });
});

bot.on("ready", async(message) => {
    console.log(`${bot.user.username} is online`);
    bot.user.setActivity("Invite to get rewards!")
});

bot.on("message", async (message) => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix
    let messageArray = message.content.split(".")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd == `${prefix}serverinfo`){

        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setAuthor("Server Info")
        .setColor("GOLD")
        .setThumbnail(url="http://2.bp.blogspot.com/-jlNRMff0pDY/VRBWTCW5pAI/AAAAAAAAAqE/9ujJilGYcRw/s1600/114385__marlon-brando-godfather-godfather-don-vito-corleone-style-classic-movie_p.jpg")
        .addField("Server Name", message.guild.name)
        .addField("You joined in", message.member.joinedAt)
        .addField("Total Members", message.guild.memberCount);

        return message.channel.send(serverembed)
    }

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);
    if(cmd.toLowerCase() == `${botconfig.prefix}new`){
    var channel;
    var Member;
    channel = await message.guild.createChannel(`${message.author.username}`, "text").catch(ex => console.error(ex));
    var newMessage = await channel.send(`${botconfig.prefix}close to close your ticket`);
    var Roles = await message.member.roles.array();
    var AuthorRole = await message.guild.createRole({
        name: message.author.username,
    }).catch(ex => console.error(ex));
    Roles.forEach(async(role) => {
        await channel.overwritePermissions(role, {
            READ_MESSAGES: false,
            VIEW_MESSAGES: false
        });
    });
    channel.overwritePermissions(AuthorRole, {
        READ_MESSAGES: true,
        VIEW_MESSAGES: true
    });
    await message.member.addRole(AuthorRole);
    message.channel.send("Ticket has been succesfully created :white_check_mark:");
  }

  if (cmd.toLowerCase() == `${botconfig.prefix}close`/* && message.channel.name == message.author.username*/){
    f (boolean){
      message.member.send("Your support ticket is closed!");
      message.channel.delete();
      let AuthorRole = message.guild.roles.find("name", message.author.username);
      message.member.removeRole(AuthorRole);
    }
    else {
      return;
    };
  };
})
  
bot.login(process.env.BOT_TOKEN)

const botconfig = require("./botconfig.json")
const Discord = require("discord.js")
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection
const active = new Map();

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
    if(cmd == `${prefix}fuckyou`){
        client.on("message", (message) => {
            if (message.content.startsWith("fuckyou")) {
              message.channel.send("What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little \"clever\" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.");
            }
        });
    
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

  if (cmd.toLowerCase() == `${botconfig.prefix}close`){
    var boolean = message.channel.name.toLowerCase() == message.author.username.toLowerCase();//Boolean expression, will return true or false.
    if (boolean){
      message.member.send("Your support ticket is closed!");
      message.channel.delete();
      let AuthorRole = message.guild.roles.find("name", message.author.username);
      message.member.removeRole(AuthorRole);
    }
    else {
      return;
    }
  }
})
  
bot.login(process.env.BOT_TOKEN)

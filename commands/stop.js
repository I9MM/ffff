const { MessageEmbed } = require("discord.js")
const { COLOR } = require("../config.json");



const discord = require("discord.js");

module.exports = {
  name: "stop",
  description: "لئقاف اي اغنية ;)",
  execute(client, message, args) {
    
    
let embed = new MessageEmbed()
.setColor(COLOR);

    const { channel } = message.member.voice;
      
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      embed.setAuthor("يجب الدخول في روم :/")
      return message.channel.send(embed);
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      embed.setAuthor("لا يوجد شيئ يعمل حاليا لذالك سئتوقف")
      return message.channel.send(embed);
    }

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
};

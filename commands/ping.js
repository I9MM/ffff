//FIRST TEST HANDLER IS WORKING OR NOT
const Discord = require("discord.js");
module.exports = {
  name: "ping",
  description: "لمعرفة بنق البوت",
  execute(client, message, args) {
    let ping = new Discord.MessageEmbed()
      .setTitle(`بنق البوت`)
      .setDescription(`${client.ws.ping}ms`);
    message.channel.send(ping);
  }
};

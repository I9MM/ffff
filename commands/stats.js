const { MessageEmbed } = require("discord.js")
const { COLOR } = require("../config.json");



module.exports = {
  name: "stats",
  description: "لمعرفة الحالة الحالية",
  execute(client, message, args) {
    
    let embed = new MessageEmbed()
    .setColor(COLOR)
    .setThumbnail(client.user.displayAvatarURL())
    .setAuthor(`حالتي و معلوماتي`, client.user.displayAvatarURL())
    .setDescription(`اسمي هوا  **${client.user.username}** وعملي هو تشغيل الاغاني والفديوهات`)
    .addField("عدد السيرفرات", client.guilds.cache.size, true)
    .addField("الايدي", client.user.id, true)
    .addField("الحالة", client.user.presence.activities[0].name, true)
    .addField("مدة التشغيل", client.uptime, true)
    .addField("الحالة", client.user.presence.status, true)
    .addField("عدد الاعضاء", client.users.cache.size)
 console.log(client.user.presence)
    message.channel.send(embed)
  }
};

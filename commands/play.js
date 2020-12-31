const { MessageEmbed } = require("discord.js");

const ms = require("ms");

const { Util } = require("discord.js");
const { YOUTUBE_API_KEY, QUEUE_LIMIT, COLOR } = require("../config.json");
const ytdl = require("ytdl-core");
const YoutubeAPI = require("simple-youtube-api");
const youtube = new YoutubeAPI(YOUTUBE_API_KEY);
const { play } = require("../system/music.js");
module.exports = {
  name: "play",
  description: "لتشغيل الاغاني",
  async execute(client, message, args) {
    let embed = new MessageEmbed().setColor(COLOR);

    //FIRST OF ALL WE WILL ADD ERROR MESSAGE AND PERMISSION MESSSAGE
    if (!args.length) {
      //IF AUTHOR DIDENT GIVE URL OR NAME
      embed.setAuthor("Syntax Error");
      embed.setDescription("جرب استخدام ``play <song name/ URL>``");
      return message.channel.send(embed);
    }

    const { channel } = message.member.voice;

    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      embed.setAuthor("يجب عليك ان تكون في روم  :/");
      return message.channel.send(embed);
    }

    //WE WILL ADD PERMS ERROR LATER :(

    const targetsong = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const urlcheck = videoPattern.test(args[0]);

    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      embed.setAuthor("لايمكنني تشغيل قائمة الاغانية حاليا");
      return message.channel.send(embed);
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    const voteConstruct = {
      vote: 0,
      voters: []
    };

    let songData = null;
    let song = null;

    if (urlcheck) {
      try {
        songData = await ytdl.getInfo(args[0]);

        song = {
          title: songData.videoDetails.title,
          url: songData.videoDetails.video_url,
          duration: songData.videoDetails.lengthSeconds,
          thumbnail: songData.videoDetails.thumbnail.thumbnails[3].url
        };
      } catch (error) {
        if (message.include === "copyright") {
          return message
            .reply("يوجد حقوق في الاغنية -_-")
            .catch(console.error);
        } else {
          console.error(error);
        }
      }
    } else {
      try {
        const result = await youtube.searchVideos(targetsong, 1);
        songData = await ytdl.getInfo(result[0].url);

        song = {
          title: songData.videoDetails.title,
          url: songData.videoDetails.video_url,
          duration: songData.videoDetails.lengthSeconds,
          thumbnail: songData.videoDetails.thumbnail.thumbnails[3].url
        };
      } catch (error) {
        console.log(error);
        return message.channel.send("حدث خطا | i9mm#0001 للمساعدة");
      }
    }

    if (serverQueue) {
      if (
        serverQueue.songs.length > Math.floor(QUEUE_LIMIT - 1) &&
        QUEUE_LIMIT !== 0
      ) {
        return message.channel.send(
          `لايمكنك اصافة اغاني اكثر من  ${QUEUE_LIMIT} في الانتظار`
        );
      }

      serverQueue.songs.push(song);
      embed.setAuthor(
        "Added New Song To Queue",
        client.user.displayAvatarURL()
      );
      embed.setDescription(`**[${song.title}](${song.url})**`);
      embed.setThumbnail(song.thumbnail);

      return serverQueue.textChannel.send(embed).catch(console.error);
    } else {
      queueConstruct.songs.push(song);
    }

    if (!serverQueue)
      message.client.queue.set(message.guild.id, queueConstruct);
    message.client.vote.set(message.guild.id, voteConstruct);
    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(`Could not join voice channel: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel
          .send({
            embed: {
              description: `😭 | لا يمكنني دخول الروم : ${error}`,
              color: "#ff2050"
            }
          })
          .catch(console.error);
      }
    }
  }
};

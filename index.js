const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const ms = require("ms");

const botConf = require('./botConf.json');
const userConf = require('./userConf.json');


client.on('ready', () => {

  console.log(`${client.user.tag} est connecté !`);

  let activNum = 0;

  setInterval(function () {
    if (activNum === 0) {
        client.user.setActivity(`!help | j'écoute vos conversations.`);
        activNum = 1;
    } else if (activNum === 1) {
        client.user.setActivity(`!help | ${client.guilds.size} serveur et ${client.users.size} utilisateurs.`);
        activNum = 2;
    } else if (activNum === 2) {
          client.user.setActivity('!help | Je suis à votre service.');
          activNum = 0;
    }
  }, 5 * 1000) 
});

client.on('message', async (message) => {
  if(message.author.bot) return;
  if(!message.guild) return;

    const prefix = botConf.prefix
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

  if (message.content.startsWith(prefix)) {

    console.log(`${message.author.tag} (${message.author.id}) a utilisé la commande ${messageArray} sur ${message.guild.name} (${message.guild.id}).`)

  }


  if (message.content.startsWith(prefix + "help")) {

    const i = prefix

    const helpEmbed = new Discord.RichEmbed()
    .setTitle("LISTE DES COMMANDES")
    .setDescription(`\`\`\`${i}kick [membre] <raison>\n${i}ban [membre] <raison>\n${i}clear <membre> [nombre]\n${i}warn [membre] <raison>\n${i}unwarn [membre] <raison>\n${i}checkwarn [membre]\n${i}mute [membre] [temps d/h/m/s] <raison>\n${i}unmute [membre] <raison>\`\`\`\n\`[]\` = obligatoire | \`<>\` = optionel`, true)
    .setFooter(`${message.author.tag}`, message.author.displayAvatarURL)
    .setColor(`#7289DA`)
    .setTimestamp()

    message.channel.send(helpEmbed)

  }

  if (message.content.startsWith(prefix + "kick")) {

      const user = message.mentions.users.first();
      const member = message.guild.member(user);

    if (!message.member.hasPermission(`KICK_MEMBERS`)) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Seule un modérateur peut exécuter cette commande.`);

    if (!member) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous n'avez pas mentionez la personne que vous voulez expulser.`)
    
    if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas la permission \`KICK_MEMBERS\`.`)

    if (user.id === client.user.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne peut pas m'expulser' moi même.`)

    if (!member.kickable) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne peut pas expulser cette personne car son rôle est au dessus du mien.`)
    
    if (user.id === message.author.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez pas vous expulser vous même.`)

    if ((!message.member.hasPermission(`ADMINISTRATOR`)) && (member.hasPermission("KICK_MEMBERS"))) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez kick un modérateur.`)

    let reason = args.slice(1).join(' ');
    if (!reason) {
        reason = "Aucune raison fournie"
    }

    member.send(`Vous avez étez expulsé de __${message.guild.name}__ par **${message.author.tag}** pour la raison :\n>>> ${reason}`)
    .catch(() => {

      message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas pu avertire **${user.username}** en message privé.`)

    })
    .then(() => {

        member.kick(reason).then(() => {
            message.channel.send(`**${user.tag}** a était expulsé par __${message.author.username}__ pour la raison :\n>>> ${reason}`);
            }).catch(err => {
                  message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> je n'ai pas la permission de kick cette personne.`);
                });

    })

    message.delete();

  }

  if (message.content.startsWith(prefix + "ban")) {

    const user = message.mentions.users.first();
    const member = message.guild.member(user);

    if (!message.member.hasPermission(`BAN_MEMBERS`)) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Seule un modérateur peut exécuter cette commande.`);

    if (!member) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous n'avez pas mentionez la personne que vous voulez bannir.`)
    
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas la permission \`BAN_MEMBERS\`.`)

    if (user.id === client.user.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne peut pas me bannir me même.`)

    if (!member.bannable) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne peut pas bannir cette personne car son rôle est au dessus du mien.`)
    
    if (user.id === message.author.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez pas vous bannir vous même.`)

    if ((!message.member.hasPermission(`ADMINISTRATOR`)) && (member.hasPermission("BAN_MEMBERS"))) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez bannir un modérateur.`)

    let reason = args.slice(1).join(' ');
    if (!reason) {
        reason = "Aucune raison fournie"
    }

    member.send(`Vous avez étez banni de __${message.guild.name}__ par **${message.author.tag}** pour la raison :\n>>> ${reason}`)
    .catch(() => {

      message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas pu avertire **${user.username}** en message privé.`)

    })
    .then(() => {

        member.ban({
            reason: `${message.author.tag} | ${reason}`,
          }).then(() => {
            message.channel.send(`**${user.tag}** a était banni par __${message.author.username}__ pour la raison :\n>>> ${reason}`);
            }).catch(err => {
                  message.reply(`**${message.author.username}**, une erreur c'est produite :\n>>> je n'ai pas la permission de ban cette personne.`);
                });

    })

    message.delete();

  } 

  if (message.content.startsWith(prefix + "clear")) {

    let amount = Number(args[0])

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Seule un modérateur peut exécuter cette commande.`);

    if (!amount) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous n'avez pas précisez le nombre de message à supprimer.`)

    if (amount <= 1) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Le nobre de message à supprimer doit être supérieur à 1.`)

    if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas la permission \`MANAGE_MESSAGES\`.`)

    await message.delete();

    let user = message.mentions.users.first();

    let messages = await message.channel.fetchMessages({ limit: 100 });
    messages = messages.array();
    if (user) {
        messages = messages.filter((m) => m.author.id === user.id);
    }
    if (messages.length > amount) {
        messages.length = parseInt(amount, 10);
    }
    amount++;

    message.channel.bulkDelete(messages, true);

    let toDelete = null;

    if (user) {

        toDelete = await message.channel.send(`${amount - 1} message de ${user} ont été supprimés.`);
    } else {
        toDelete = await message.channel.send(`${amount - 1} message ont été supprimés.`);
    }

    setTimeout(function () {
        toDelete.delete();
    }, 2000);

  }

  if (message.content.startsWith(prefix + "warn")) {
  
    const user = message.mentions.users.first();
    const member = message.guild.member(user);

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Seule un modérateur peut exécuter cette commande.`);

    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas la permission \`MANAGE_ROLES\`.`)

    if (!member) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous n'avez pas mentionez la personne que vous voulez warn.`)

    if (user.id === message.author.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez pas vous warn vous même.`)

    if (user.id === client.user.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne peut pas me warn me même.`)

    if (!userConf[member.id + message.guild.id]) { 
        userConf[member.id + message.guild.id] = {warn: 0}
        }
         fs.writeFile('./userConf.json', JSON.stringify(userConf, null, 2), (err) => {
             if (err) console.log(err)
        })

    let reason = args.slice(1).join(' ');

    if (!reason) {
        reason = "Aucune raison fournie"
    }

    user.send(`Vous avez étez warn sur __${message.guild.name}__ par **${message.author.tag}** pour la raison :\n>>> ${reason}`)
    .catch(() => {

        message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas pu avertire **${user.username}** en message privé.`)

    })
    .then(() => {

        message.channel.send(`**${user.tag}** a était warn par __${message.author.username}__ pour la raison :\n>>> ${reason}`);

        userConf[member.id + message.guild.id].warn += 1;
        fs.writeFile('./userConf.json', JSON.stringify(userConf, null, 2), (err) => {
            if (err) console.log(err)
       })


       if ((userConf[member.id + message.guild.id].warn >= 5)) {

        reason = "Nombreuses infractions"
    
        member.send(`Vous avez étez ban de __${message.guild.name}__ par **${message.author.tag}** pour la raison :\n>>> ${reason}`)
        .catch(() => {})
        .then(() => {
    
            member.ban({
                reason: `${message.author.tag} | ${reason}`,
              })
              .catch(err => {
                message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> je n'ai pas la permission de ban cette personne.`);
              })
              .then(() => {
                message.channel.send(`**${user.tag}** a était ban par __${message.author.tag}__ pour la raison :\n>>> ${reason}`);
                })
    
        })
    

    }

    })

    message.delete();

  }

  if (message.content.startsWith(prefix + "unwarn")) {
  
    const user = message.mentions.users.first();
    const member = message.guild.member(user);

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Seule un modérateur peut exécuter cette commande.`);

    if (!member) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous n'avez pas mentionez la personne que vous voulez unwarn.`)

    if (user.id === message.author.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez pas vous unwarn vous même.`)

    if (user.id === client.user.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne peut pas me unwarn me même.`)

    if ((!userConf[member.id + message.guild.id]) || (userConf[member.id + message.guild.id].warn === 0)) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Cette personne ne possède pas de warn.`)

    let reason = args.slice(1).join(' ');

    if (!reason) {
        reason = "Aucune raison fournie"
    }

    user.send(`Vous avez étez unwarn sur __${message.guild.name}__ par **${message.author.tag}** pour la raison :\n>>> ${reason}`)
    .catch(() => {

        message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas pu avertire **${user.username}** en message privé.`)

    })
    .then(() => {

        message.channel.send(`**${user.tag}** a était unwarn par __${message.author.username}__ pour la raison :\n>>> ${reason}`);

        userConf[member.id + message.guild.id].warn -= 1;
        
        fs.writeFile('./userConf.json', JSON.stringify(userConf, null, 2), (err) => {
            if (err) console.log(err)
       })
     
    })   

    message.delete();

  }

  if (message.content.startsWith(prefix + "checkwarn")) {
  
    const user = message.mentions.users.first();
    const member = message.guild.member(user);

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Seule un modérateur peut exécuter cette commande.`);

    if (!member) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous n'avez pas mentionez de personne.`)

    if ((!userConf[member.id + message.guild.id]) || (userConf[member.id + message.guild.id].warn === 0)) return message.channel.send(`**${member.user.tag}** ne possède pas de warn.`)

    message.channel.send(`**${member.user.tag}** possède \`${userConf[member.id + message.guild.id].warn}\` warn.\nIl sera automatiquement ban dans \`${5 - userConf[member.id + message.guild.id].warn}\` warn.`)

  }

  if (message.content.startsWith(prefix + "mute")) {

    let tomute = message.guild.member(message.mentions.users.first());

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Seule un modérateur peut exécuter cette commande.`);

    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas la permission \`MANAGE_ROLES\`.`)

    if (!args[0]) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous n'avez pas mentionez la personne que vous voulez mute.`)

    if (!tomute) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne trouve pas la personne que vous voulez mute.`)

    if (tomute.id === client.user.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne peut pas me mute moi même.`)

    if ((!message.member.hasPermission(`ADMINISTRATOR`)) && (member.hasPermission("MANAGE_MESSAGES"))) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez mute un modérateur.`)

    if (tomute.id === message.author.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez pas vous mute vous même.`)

    let muterole = message.guild.roles.find(r => r.name === "Muet");
  
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "Mute",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            SPEAK: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }

    const hasRole = tomute.roles.get(muterole.id)

    if (hasRole) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Cette personne est déja mute.`)
  
    let mutetime = args[1];

    if(!ms(mutetime)) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous n'avez pas spécifié de temps.`);

    let reason = args.slice(2).join(' ');

    if (!reason) {
        reason = "Aucune raison fournie"
    }

    tomute.send(`Vous avez été mute sur __${message.guild.name}__ par **${message.author.tag}** pendant \`${ms(ms(mutetime))}\` pour la raison :\n>>> ${reason}`)
    .catch(() => {

        message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas pu avertire **${user.username}** en message privé.`)

    })
    .then(() => {
  
    tomute.addRole(muterole.id)
    message.channel.send(`**${tomute.user.tag}** a été mute par __${message.author.username}__ pendant \`${ms(ms(mutetime)).replace("s", " seconde(s)").replace("d", " jour(s)").replace("h", " heure(s)").replace("m", " minute(s)")}\` pour la raison \n>>> ${reason}`);

  })

  setTimeout(function(){
    tomute.removeRole(muterole.id);
  }, ms(mutetime));
  
    message.delete();
  
  }

  if (message.content.startsWith(prefix + "unmute")) {

    let tomute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Seule un modérateur peut exécuter cette commande.`);

    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je n'ai pas la permission \`MANAGE_ROLES\`.`)

    if (!args[0]) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous n'avez pas mentionez la personne que vous voulez unmute.`)

    if (!tomute) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne trouve pas la personne que vous voulez unmute.`)

    if (tomute.id === client.user.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Je ne peut pas me unmute moi même.`)

    if ((!message.member.hasPermission(`ADMINISTRATOR`)) && (member.hasPermission("MANAGE_MESSAGES"))) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez unmute un modérateur.`)

    if (tomute.id === message.author.id) return message.channel.send(`**${message.author.username}**, une erreur c'est produite :\n>>> Vous ne pouvez pas vous unmute vous même.`)


    let role = message.guild.roles.find(r => r.name === "Muet")
    
    if(!role || !tomute.roles.has(role.id)) return message.channel.sendMessage(`**${message.author.username}**, une erreur c'est produite :\n>>> Cette personne n'est pas mute.`);

    await tomute.removeRole(role);
    message.channel.send(`**${tomute.user.tag}** a été unmute par ${message.author.username}`);

  }

});
  

client.login(botConf.token);
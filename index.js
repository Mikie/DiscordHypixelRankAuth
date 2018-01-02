const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const hypixel = require("./hypixel");

const rank_whitelist = [
    "HELPER",
    "MODERATOR",
    "ADMIN",
    "YOUTUBER"
];

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function findRole(member, role) {
    return member.guild.roles.find("name", role)
}

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.find("name", "welcome");

    if (!channel) return;

    channel.send(`Welcome to the server, ${member}! Verify your rank by typing .ign (your username) on the #auth channel!`);
    member.addRole(member.guild.roles.find("name", "Unverified"))
});

client.on("message", message => {
    if (message.content === "ping") {
        message.reply("pong");
    }

    if (message.content.startsWith(".ign ")) {
        let name = message.content.split(" ")[1];
        console.log(name);

        const sender = `${message.author.username}#${message.author.discriminator}`;
        hypixel.getPlayerRank(name, sender, (err, rank) => {
            if (err) {
                message.reply(`Failed to authenticate! ${err}`)
            } else if (rank === "MVP_PLUS_PLUS") {
                message.member.addRole(findRole(message.member, "MVP++"));
                message.member.removeRole(findRole(message.member, "Unverified"));
            } else if (rank_whitelist.indexOf(rank) !== -1) {
                message.member.addRole(findRole(message.member, capitalizeFirstLetter(rank.toLowerCase())));
                message.member.removeRole(findRole(message.member, "Unverified"))
            } else {
                message.member.kick("You need MVP++ to join this discord!")
            }
        })
    }

    if (message.content.startsWith(".linkhelp ")) {
        message.reply("")
    }

});

client.login(auth.bot_token);
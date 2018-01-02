const request = require("request");
const auth = require("./auth.json");

function getPlayerRank(player, sender, cb) {
    request({
        url: `https://api.hypixel.net/player?key=${auth.hypixel_api_key}&name=${player}`,
        json: true
    }, (err, res, body) => {
        if (err
            || !res
            || res.statusCode !== 200
            || !body
            || !body.success
        ) {
            return cb("Error", null)
        }
        const player = body.player || {};

        // Get player's rank
        let rank;
        if (player.rank === "NORMAL") {
            rank = player.newPackageRank || player.packageRank || null;
        } else {
            rank = player.rank || player.newPackageRank || player.packageRank || null;
        }

        if (rank === "MVP_PLUS" && player.monthlyPackageRank === "SUPERSTAR") {
            rank = "MVP_PLUS_PLUS"
        }

        if (rank === "NONE") {
            rank = null;
        }
        // Verify discord user
        let social = player.socialMedia || {};
        let links = social.links || {};
        let discord = links.DISCORD || null;
        if (sender !== discord) {
            return cb("You entered incorrect username or you haven't linked your discord account. Type `.linkhelp` for more info.", null);
        }
        cb(null, rank)
    })
}

module.exports = {
    getPlayerRank
};
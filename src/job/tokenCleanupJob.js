const cron = require('node-cron');
const TokenRepository = require('../repository/tokenRepository');

const tokenRepository = new TokenRepository();

function startTokenCleanupJob() {
     cron.schedule('0 0 */12 * * *', async () => {  //every 12hr
        try {
            console.log("Running token cleanup job...");

            await tokenRepository.destroyExpiredToken();

            console.log("Expired tokens deleted");
        } catch (error) {
            console.error("Cleanup job failed:", error);
        }
    });
}

module.exports = startTokenCleanupJob;
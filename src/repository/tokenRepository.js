const {Refresh_tokens}  = require('../models/index');
const {Op} = require('sequelize');


class TokenRepository {
    async create(data){
        try {
            data.expiresAt = new Date(Date.now() + 15*24*60*60*1000);
            const res = await Refresh_tokens.create(data);
            return res;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async getById(userId){
        try {
            const res = await Refresh_tokens.findOne({
                where : {
                    userId
                }
            });
            return res;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async getByToken(token){
        try {
            const res = await Refresh_tokens.findOne({
                where : {
                    token
                }
            });
            return res;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async findBySessionId(sessionId){
        try {
            const res = await Refresh_tokens.findOne({
                where : {
                    sessionId
                }
            });
            return res;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async countSessions(userId){
        try {
            const count = await Refresh_tokens.count({
                where : {
                    userId,
                    expiresAt: {
                        [Op.gt]: new Date() // only non-expired token/sessions
                    }
                }
            });
            return count;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async deleteOldestSession(userId) {
        try {
            const oldest = await Refresh_tokens.findOne({
                where: { userId },
                order: [['createdAt', 'ASC']]
            });

            if (oldest) {
                await oldest.destroy();
            }

        } catch (error) {
            console.log("Error deleting oldest session");
            throw error;
        }
    }
    async deleteById(userId){
        try {
            await Refresh_tokens.destroy({
                where : {
                    userId
                }
            });
            return true;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async deleteByToken(token){
        try {
            const res = await Refresh_tokens.destroy({
                            where : {
                                token
                            }
                        });
            return {
                success:true,
                message: res? "Successfully logged out" : "Already logged out"
            };
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async destroyExpiredToken(){
        try {
            await Refresh_tokens.destroy({
                where: {
                    expiresAt: {
                        [Op.lt]: new Date()
                    }
                }
            });

           
        } catch (error) {
            console.log("Something went wrong in deleting expired token in token repository");
            console.log(error);
            throw error;
        }
    }
}

module.exports = TokenRepository;
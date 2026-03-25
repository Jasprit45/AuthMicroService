const {Refresh_tokens}  = require('../models/index')

class TokenRepository {
    async create(data){
        try {
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
            await Refresh_tokens.destroy({
                where : {
                    token
                }
            });
            return true;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
}

module.exports = TokenRepository;
const {password_reset_token}  = require('../models/index');

class PasswordResetToken {
    async create(data){
        try {
            data.expiresAt = new Date(Date.now() + 10*60*1000);
            const res = await password_reset_token.create(data);
            return res;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async get(attribute) {
        try {
            const res = await password_reset_token.findOne({where:{
                attribute
            }});
            return res;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async delete(id){
        try {
            await password_reset_token.destroy({where:{
                id
            }});
            return true;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async deleteByUserId(userId){
        try {
            await password_reset_token.destroy({where:{
                userId
            }});
            return true;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
}

module.exports = PasswordResetToken;
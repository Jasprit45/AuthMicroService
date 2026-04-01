const {email_tokens}  = require('../models/index');

class EmailTokenRepository {
    async create(data){
        try {
            data.expiresAt = new Date(Date.now() + 10*60*1000);
            const res = await email_tokens.create(data);
            return res;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
    async delete(id){
        try {
            const res = await email_tokens.delete({where:{
                id
            }});
            return true;
        } catch (error) {
            console.log("Something went wrong in token repository");
            console.log(error);
            throw error;
        }
    }
}

module.exports = EmailTokenRepository;
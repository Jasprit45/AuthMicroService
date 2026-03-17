const {User} = require('../models/index');

class UserRepository {
    async create(data){
        try {
            const user = await User.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }
    async delete(userId){
        try {
            await User.destroy({
                where: {
                    id:userId
                }
            });
           
        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }
    async getByEmail(email){
        try {
            const user = await User.findOne({ where: { email: email}});
            if(!user) throw {error: "User not found"};

            // console.log(user);
            return user.dataValues;

        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }
   
}

module.exports = UserRepository;
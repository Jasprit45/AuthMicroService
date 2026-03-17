const UserRepository  = require('../repository/userRepository');

const userRepository = new UserRepository();

class UserService {

    async signUp(data) {
        try {
            const user = await userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in user service layer");
            throw error;
        }
    }

}

module.exports = UserService;
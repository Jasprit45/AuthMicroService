const UserRepository  = require('../repository/userRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {JWT_KEY} = require('../config/serverConfig');


class UserService {
    
    constructor() {
        this.userRepository = new UserRepository();

    }

    async signUp(data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in user service layer");
            throw error;
        }
    }

    createToken(user) {
        try {
            const token = jwt.sign(user,JWT_KEY,{expiresIn: '1d'});
            return token;
        } catch (error) {
            throw error;
        }
    }

    verifyToken(token){
        try {
            const isvalid = jwt.verify(token,JWT_KEY);
            return isvalid;
        } catch (error) {
            throw error;
        }
    }

    comparePassword(plainPassword,encryptedPassword){
        try {
            console.log(plainPassword);
            const isMatch = bcrypt.compareSync(plainPassword,encryptedPassword);
            return isMatch;
        } catch (error) {
            throw error;
        }
    }

    async signIn(email,plainPassword){
        try {
            const user = await this.userRepository.getByEmail(email);
            // console.log(user);
            if(!user) throw {error: "User not found"};
            const isMatch = this.comparePassword(plainPassword,user.password);
            // console.log(isMatch);
            
            if(!isMatch) throw {error:"Password Not Matched"};

            const token = this.createToken(user);
            return token;
        } catch (error) {
            console.log("Something went wrong in user service layer");
            throw error;
        }
    }

}

module.exports = UserService;
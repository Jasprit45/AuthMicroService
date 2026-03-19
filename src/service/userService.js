const UserRepository  = require('../repository/userRepository');
const RoleRepository = require('../repository/roleRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {JWT_KEY,SALT} = require('../config/serverConfig');


class UserService {
    
    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
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
            const user = await this.userRepository.getByEmail(email);  // get a json object 
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

    async isAuthenticated(token) {
        try {
            const response = this.verifyToken(token);

            if(!response) throw {error:"Invalid Token!!"};

            const user = await this.userRepository.getById(response.id); //get a sequelize object 
            if(!user) throw {error: "No user with this token"};

            // console.log(user);
            return user.dataValues.id;

        } catch (error) {
            console.log("Something went wrong in user service layer");
            throw error;
        }
    }

    

    async updatePassword(token, oldPassword, newPassword){
        try {
            // is user is authenticated
            const userId = await this.isAuthenticated(token);

            //get the user
            const user  = await this.userRepository.getById(userId); //sequelize object
            

            //compare old-password
            const isMatch = this.comparePassword(oldPassword,user.dataValues.password);
            if(!isMatch) throw {error: "OLD PASSWORD NOT MATCHED"};
            
            //encrypting password before update 
            user.dataValues.password = bcrypt.hashSync(newPassword,SALT);

            await user.save();  //save in userdb
            return user; 

        } catch (error) {
            console.log("Something went wrong in userService");
            throw error;
        }
    }
    
    async isAdmin(userId){
        try {
            const user = await this.userRepository.getById(userId); //sequelize object 
            const adminRole = await this.roleRepository.findAdminRole(); //sequelize object 

            const res = await user.hasRole(adminRole);
            
            return res;
            
        } catch (error) {
            console.log("Something went wrong in user service layer");
            throw error;
        }
    }
    async makeAdmin(userId){
        try {
            const user = await this.userRepository.getById(userId); //sequelize object 
            if(!user) throw {error: "Not a valid user"};

            const adminRole = await this.roleRepository.findAdminRole(); //sequelize object 
            if(!adminRole) throw {error: "Admin is not a Role"};

            // console.log(typeof user.addRole);
            await user.addRole(adminRole);
            return true;

        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
    async isManager(userId){
        try {
            const user = await this.userRepository.getById(userId); //sequelize object 
            const managerRole = await this.roleRepository.findManagerRole(); //sequelize object 

            const res = await user.hasRole(managerRole);
            
            return res;
            
        } catch (error) {
            console.log("Something went wrong in user service layer");
            throw error;
        }
    }
    async makeManager(userId){
        try {
            const user = await this.userRepository.getById(userId); //sequelize object 
            if(!user) throw {error: "Not a valid user"};

            const managerRole = await this.roleRepository.findManagerRole(); //sequelize object 
            if(!managerRole) throw {error: "Admin is not a Role"};

            // console.log(typeof user.addRole);
            await user.addRole(managerRole);
            return true;

        } catch (error) {
            console.log("Something went wrong in user service layer", error);
            throw error;
        }
    }
}

module.exports = UserService;
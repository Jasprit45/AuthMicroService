const { Op } = require('sequelize');
const {User} = require('../models/index');

class UserRepository {
    async create(data){
        try {
            const user = await User.create(data);
            return {
                id: user.id,
                name:user.name,
                email:user.email,
                role:user.role
            };
        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }
    async createGoogleUser(data){
        try {
            const user = await User.create(data);
            return {
                id: user.id,
                name:user.name,
                role:user.role
            };
        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }
    async updateRoleToAdmin(userId){
        try {       
            const user = await User.update({ role: 'ADMIN' } , {where: {id:userId}});
            if(!user) throw new Error("User not found!!");

            return user;
        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }
    async updateRoleToManager(userId){
        try {       
            const user = await User.update({ role: 'MANAGER' } , {where: {id:userId}});
            if(!user) throw new Error("User not found!!");

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
            return user.dataValues; //return plain json object

        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }
    async getById(id){
        try {
            const user = await User.findByPk(id);
            if(!user) throw {error: "User not found"};

            return user; //return sequelize object

        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }
    async getAllUsers(query){
        try {
            // console.log(query);
            const limit = query.limit;
            const offset = (query.page-1)* limit;


            let whereClause = {};

            if (query.role) {
                whereClause.role = query.role;
            }
            if (query.search) {
                whereClause.email = {
                    [Op.like]: `%${query.search}%`
                };
            }

            const users = await User.findAndCountAll({
                where: whereClause,
                attributes: ['id', 'name', 'email', 'role', 'createdAt'],
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return users;

        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }

    async updateProvider(userId,googleId,provider) {
        try {
            return await User.update(
            { provider, googleId },
            { where: { id: userId } }
        );
        } catch (error) {
            console.log("Something went wrong in userRepository");
            throw error;
        }
    }


    
   
}

module.exports = UserRepository;
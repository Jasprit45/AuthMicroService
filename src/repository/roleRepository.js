const {Role}  = require('../models/index');

class RoleRepository{

    async findAdminRole(){
        try {
            const adminRole = await Role.findOne({
                where:{
                    name: 'Admin'
                }
            })
            return adminRole;  //return sequelize object 

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async findManagerRole(){
        try {
            const managerRole = await Role.findOne({
                where:{
                    name: 'Manager'
                }
            })
            return managerRole;  //return sequelize object 

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

module.exports = RoleRepository;

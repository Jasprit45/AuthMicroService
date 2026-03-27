const express = require('express');
const bodyParser = require('body-parser')
const {PORT} = require('./config/serverConfig');
const apiRoutes = require('./routes/apiRoutes');
const db = require('./models/index');
const startTokenCleanupJob = require('./job/tokenCleanupJob')
const app = express();

const startServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.use('/api', apiRoutes);

    app.listen(PORT, () => {
        console.log(`Server started at : ${PORT}`);
    });

    startTokenCleanupJob();

    if(process.env.DB_SYNC){
        db.sequelize.sync({alert: true})
    }
    
}

startServer();
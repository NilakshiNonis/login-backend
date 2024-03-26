import { Sequelize } from 'sequelize-typescript';
import * as config from '../../../config/config.json';
import { Dialect } from 'sequelize';
import { User } from '../../models/user.model';


const env = 'development';
const dbConfig = config[env];

const sequelize =  new Sequelize({
    database: dbConfig.database,
    dialect: dbConfig.dialect as Dialect,
    username: dbConfig.username,
    host: dbConfig.host,
    password: dbConfig.password,
    port: 5432,
    models: [User],
    // modelMatch: (filename, member) => {
    //   return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    // },
  });
  
// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
sequelize.addModels([User]);

testConnection();


export default sequelize;
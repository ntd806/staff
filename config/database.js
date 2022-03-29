// import sequelize
import { Sequelize } from "sequelize"
 
// create connection
const db = new Sequelize(process.env.DATABASE,process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})
 
// export connection
export default db
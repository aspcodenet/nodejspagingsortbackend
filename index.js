// onetimer  npx sequelize-cli db:seed:all


const express = require('express')
const {check} = require('express-validator')
const cors = require('cors')
const {Product} = require('./models')
const {Op} = require('sequelize')
const migrationhelper = require('./migrationhelper')
const app = express()
const port = 3000 // "Radiofrekvens"



app.use(express.json())
app.use(cors({
    origin:"http://localhost:5500",
    credentials:true 
}))


app.get('/products', check('q').escape(), async (req,res) => {
    let sortBy = req.query.sortBy || 'id';
    let sortOrder = req.query.sortOrder || 'asc';
    // let offset = req.query.offset || 0;
    // let limit = req.query.limit || 20;
    const products = await Product.findAll({
        where:{
            name:{
                [Op.like]: '%' + req.query.q + '%'
            }
        },
        order:[
            [sortBy,sortOrder]
        ],
        

        // offset: offset,
        // limit:limit
    })
    const result = products.map(p=>{
         return {
            id:p.id,
            name:p.name,
            unitPrice:p.unitPrice,
            stockLevel:p.stockLevel
        }
})
    return res.json(result)

})




app.get('/productswithpaging', check('q').escape(), async (req,res) => {
    let sortBy = req.query.sortBy || 'id';
    let sortOrder = req.query.sortOrder || 'asc';
    let offset =   Number(req.query.offset) || 0;
    let limit = Number(req.query.limit) || 20;
    const products = await Product.findAndCountAll({
        where:{
            name:{
                [Op.like]: '%' + req.query.q + '%'
            }
        },
        order:[
            [sortBy,sortOrder]
        ],
        

        offset: offset,
        limit:limit
    })
    const result = products.rows.map(p=>{
         return {
            id:p.id,
            name:p.name,
            unitPrice:p.unitPrice,
            stockLevel:p.stockLevel
        }
})
    return res.json({count:products.count, rows:result})

})


app.listen(port, async () => {
    await migrationhelper.migrate()
    console.log(`Example app listening2 on port ${port}`)
})
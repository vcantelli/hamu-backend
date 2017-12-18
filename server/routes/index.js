const Inventions = require('../models').Inventions;
const Categories = require('../models').Categories;
var Sequelize = require('sequelize');

module.exports = app => {
    app.get('/', (req, res) => res.render('index.ejs', { title: 'Evnts' }));
    
    app.get('/inventions/:categoryName', (req, res) => 
    {             
        const categoryName = req.params.categoryName;
        if(categoryName){
            return Categories
            .find({
                where:{
                    name: categoryName
                }
            })
            .then(category => {
                Inventions
                .findAll({
                    where: {
                        CategoryId: category.dataValues.id
                    },
                    include: [{
                        model: Categories,
                        as: 'Categories',
                        attributes: ['name']
                    }]
                })
                .then(customers => 
                    res.render('inventions.ejs', { title: 'Evnts',data: customers})
                )
                .catch(err => 
                    res.status(500).send(err)
                );
            })
            .catch(err => 
                res.status(500).send(err)
            );
        }
        res.status(500).send(err)
    });
}
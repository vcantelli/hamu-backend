const Inventions = require('../models').Inventions;
const Categories = require('../models').Categories;
var Sequelize = require('sequelize');

module.exports = {
  create (req, res) {
    return Inventions.create({
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        discountPrice: req.body.discountPrice,
        CategoryId: req.body.categoryId
    })
    .then(invention => 
        Categories
        .find({
            where: {
                id: invention.CategoryId
            }
        })
        .then(category => {
            invention.dataValues.categoryName = category.dataValues.name
            res.status(201).send(invention.dataValues)
        })
        .catch(err => 
            res.status(500).send(err)
        )
    )
    .catch(err => 
        res.status(500).send(err)
    );
  },

  list (req, res) {      
    const categoryName = req.body.categoryName;
    if(categoryName){
        return Inventions
        .findAll({
            where:{
                name: categoryName
            },
            include: [{
                model: Categories,
                as: 'Categories',
                attributes: ['name']
            }]
        })
        .then(customers => 
            res.status(201).send(customers)
        )
        .catch(err => 
            res.status(500).send(err)
        );
    }
    return Inventions
    .findAll({
      include: [{
        model: Categories,
        as: 'Categories',
        attributes: ['name']
      }]
    })
    .then(customers => 
        res.status(201).send(customers)
    )
    .catch(err => 
        res.status(500).send(err)
    );
  },  

  categories (req, res) {
    return Categories
    .findAll()
    .then(categories => 
        res.status(201).send(categories)
    )
    .catch(err => 
        res.status(500).send(err)
    );
  }  
};
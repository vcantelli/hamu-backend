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
        CategoryId: req.body.CategoryId
    })
    .then(invention => 
        res.status(201).send(invention)
    )
    .catch(err => 
        res.status(500).send(err)
    );
  },

  list (req, res) {
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
  }  
};
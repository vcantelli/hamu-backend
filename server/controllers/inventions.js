const Inventions = require('../models').Inventions;
const Categories = require('../models').Categories;
const InventionImages = require('../models').InventionImages;
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
            res.status(200).send(invention.dataValues)
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
    return Inventions
    .findAll({
      include: [{
        model: Categories,
        as: 'Categories',
        attributes: ['name']
      },
      {
        model: InventionImages,
        as: 'InventionImages',
        attributes: ['image']
      }],
    })
    .then(customers =>
        res.status(200).send(customers)               
    )
    .catch(err => 
        res.status(500).send(err)
    );
  },  

  categories (req, res) {
    return Categories
    .findAll()
    .then(categories => 
        res.status(200).send(categories)
    )
    .catch(err => 
        res.status(500).send(err)
    );
  }
};
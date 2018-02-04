const ced_csmarketplace_vendor_products = require('../models').ced_csmarketplace_vendor_products;
const ced_csmarketplace_vendor_shop = require('../models').ced_csmarketplace_vendor_shop;
var Sequelize = require('sequelize');

module.exports = {
  create (req, res) {
    return ced_csmarketplace_vendor_shop.create({
      vendor_id: 1,
      shop_disable: 0
    })
    .then(shop => 
      res.status(200).send(shop)
    )
    .catch(err => 
        res.status(500).send(err)
    );
  },

  list (req, res) {   
    return ced_csmarketplace_vendor_products
    .findAll()
    .then(customers =>
        res.status(200).send(customers)               
    )
    .catch(err => 
        res.status(500).send(err)
    );
  },  
  
  edit (req, res) {
    ced_csmarketplace_vendor_shop.find({
        where: {
            id: 1
        }
    })
    .then(shop => {    
      shop.updateAttributes({            
          shop_disable: 1
        });    
        res.status(200).send(shop);
    })
    .catch(err => {
        res.status(500).send(err);
    });
  },
  
  destroy (req, res) {
    ced_csmarketplace_vendor_shop.destroy({
        where: {
            id: 1
        }
    })
    .then(shop => {    
        res.status(200).send();
    })
    .catch(err => {
        res.status(500).send(err);
    });
  }
};
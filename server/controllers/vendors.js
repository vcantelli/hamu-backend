const ced_csmarketplace_vendor_products = require('../models').ced_csmarketplace_vendor_products;
const ced_csmarketplace_vendor_shop = require('../models').ced_csmarketplace_vendor_shop;
var Sequelize = require('sequelize');
var MagentoAPI = require('magento');
var md5 = require('md5');

var magento = new MagentoAPI({
    host: 'www.hamu.com.br',
    port: 80,
    path: '/api/xmlrpc/',
    login: 'admgeral',
    pass: 'paineldeacesso2017'
  });

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
  },

  checkPassword (req, res) {      
    magento.login(function(err, sessId) {
        if (err) 
            res.status(500).send(err);
        
        magento.customer.info({
            customerId: req.body.customerId
        }, 
        function(err, customer){
            if(err)
                res.status(500).send(err);
            return res.status(200).send(checkPasswordHash(req.body.password, customer.password_hash));
        });
    })
  },
  
  addImage (req, res) {      
    magento.login(function(err, sessId) {
        if (err) 
            res.status(500).send(err);        
        
        magento.catalogProductAttributeMedia.list({
            product: req.body.productId,
        },  
        function(err, product){
            if (err) 
                res.status(500).send(err);  

            var new_image = 
            {
                file:
                {
                    content: req.body.imageBase64,
                    mime: 'image/jpeg',
                    name: req.body.imageName
                },
                label: '',
                position: product.lenght,
                types: [],
                exclude: '0'
            }

            magento.catalogProductAttributeMedia.create({
                product: req.body.productId,
                data: new_image,
            },  function(err, image){
                if (err) 
                    res.status(500).send(err);  
                console.log(image)
                res.status(200).send(image);  
            });
        });        
    })
  },
};

function checkPasswordHash(password, hash){
    var hash_split = hash.split(":")

    if(hash_split[0] == md5(hash_split[1] + password))
        return true
    else
        return false
}

// magento.login(function(err, sessId) {
//     if (err) {
//       // deal with error 
//       return;
//     }
//     var passwordHash = '45690e2bdeb92e845cdc3080e497a0ef:X5q6mZkXVPQZKKbLl2Fi30LuV8wZD59q'
//     var passwordHash2 = 'X5q6mZkXVPQZKKbLl2Fi30LuV8wZD59q'
//     var password = 'y94rywvx'
//     var hash = md5(passwordHash2 + password)
//     // magento.catalogProduct.info({
//     //     id: 163
//     // }, function(err, product){
//     //     console.log("err"+err) 
//     //     console.log(product)
//     // })
//     var new_image = 
//     {
//         file:
//         {
//             content: '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAXABcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDLooor8XP4DCiiigAooooAKKKKAP/Z',
//             mime: 'image/jpeg',
//             name: 'Teste'
//         },
//         label: '',
//         position: 3,
//         types: [],
//         exclude: '0'
//     }
//     // magento.catalogProductAttributeMedia.list({
//     //     product:    163,
//     //   },  function(err, product){
//     //     console.log("err"+err) 
//     //     console.log(product)
//     // });

//     magento.customer.login({
//         email: 'v.cantelli@hotmail.com',
//         password: 'y94rywvx'
//       }, function(err, product){
//         console.log("err"+err) 
//         console.log(product)
//     });


//     // magento.customer.info({
//     //     customerId: 34
//     //   }, function(err, product){
//     //     console.log("err"+err) 
//     //     console.log(product)
//     // });

//     // magento.catalogProductAttributeMedia.create({
//     //     product: 163,
//     //     data: new_image,
//     //   },  function(err, product){
//     //     console.log("err"+err) 
//     //     console.log(product)
//     // });
//     // magento.catalogProduct.list(function(err,product) 
//     // {
//     //     console.log("err"+err) 
//     //     console.log(product)
//     // })
//     // use magento 
//   });
const cedCsmarketplaceVendorProducts = require('../models').ced_csmarketplace_vendor_products
const cedCsmarketplaceVendorShop = require('../models').ced_csmarketplace_vendor_shop
const cedCsmarketplaceVendor = require('../models').ced_csmarketplace_vendor
const cedCsmarketplaceVendorDatetime = require('../models').ced_csmarketplace_vendor_datetime
const cedCsmarketplaceVendorInt = require('../models').ced_csmarketplace_vendor_int
const cedCsmarketplaceVendorVarchar = require('../models').ced_csmarketplace_vendor_varchar
var MagentoAPI = require('magento')
var md5 = require('md5')
var customerEntity = require('../models').customer_entity

var magento = new MagentoAPI({
  host: 'www.hamu.com.br',
  port: 80,
  path: '/api/xmlrpc/',
  login: 'admgeral',
  pass: 'paineldeacesso2017'
})

module.exports = {
  create (req, res) {
    if (req.body.email && req.body.firstname &&
      req.body.lastname && req.body.password &&
      req.body.company_name && req.body.company_address && req.body.company_cnpj) {
      var newCustomer = {
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        website_id: 1,
        store_id: 1,
        group_id: 1
      }
      let vendorId = 0
      magento.login(function (err, sessId) {
        if (err) return res.status(500).send(err)
        magento.customer.create({
          customerData: newCustomer
        },
        function (err, customerInfo) {
          if (err) return res.status(500).send(err)
          cedCsmarketplaceVendor.create({
            entity_type_id: 9,
            attribute_set_id: 0,
            increment_id: '',
            store_id: 0,
            created_at: new Date(),
            updated_at: new Date(),
            is_active: 1,
            website_id: 1
          })
          .then(vendor => {
            vendorId = vendor.null
            return cedCsmarketplaceVendorDatetime.create({
              entity_type_id: 9,
              attribute_id: 133,
              store_id: 0,
              entity_id: vendorId,
              value: new Date()
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorInt.create({
              entity_type_id: 9,
              attribute_id: 132,
              store_id: 0,
              entity_id: vendorId,
              value: customerInfo
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorInt.create({
              entity_type_id: 9,
              attribute_id: 140,
              store_id: 0,
              entity_id: vendorId,
              value: 1
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorVarchar.create({
              entity_type_id: 9,
              attribute_id: 137,
              store_id: 0,
              entity_id: vendorId,
              value: req.body.company_name
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorVarchar.create({
              entity_type_id: 9,
              attribute_id: 134,
              store_id: 0,
              entity_id: vendorId,
              value: (req.body.company_name).toLowerCase().replace(/\s/g, '')
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorVarchar.create({
              entity_type_id: 9,
              attribute_id: 135,
              store_id: 0,
              entity_id: vendorId,
              value: 'approved'
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorVarchar.create({
              entity_type_id: 9,
              attribute_id: 136,
              store_id: 0,
              entity_id: vendorId,
              value: 'general'
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorVarchar.create({
              entity_type_id: 9,
              attribute_id: 139,
              store_id: 0,
              entity_id: vendorId,
              value: req.body.firstname + ' ' + req.body.lastname
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorVarchar.create({
              entity_type_id: 9,
              attribute_id: 144,
              store_id: 0,
              entity_id: vendorId,
              value: req.body.company_name
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorVarchar.create({
              entity_type_id: 9,
              attribute_id: 148,
              store_id: 0,
              entity_id: vendorId,
              value: req.body.company_address
            })
          })
          .then(() => {
            return cedCsmarketplaceVendorVarchar.create({
              entity_type_id: 9,
              attribute_id: 161,
              store_id: 0,
              entity_id: vendorId,
              value: req.body.company_cnpj
            })
          })
          .then(() => {
            if (req.body.facebookId) {
              return cedCsmarketplaceVendorVarchar.create({
                entity_type_id: 9,
                attribute_id: 153,
                store_id: 0,
                entity_id: vendorId,
                value: req.body.facebookId
              })
            }
          })
          .then(() => {
            return res.status(200).send(customerInfo)
          })
          .catch(err => {
            return res.status(500).send(err)
          })
        })
      })
    }
  },

  list (req, res) {
    return cedCsmarketplaceVendorProducts
    .findAll()
    .then(customers =>
        res.status(200).send(customers)
    )
    .catch(err =>
        res.status(500).send(err)
    )
  },

  edit (req, res) {
    cedCsmarketplaceVendorShop.find({
      where: {
        id: 1
      }
    })
    .then(shop => {
      shop.updateAttributes({
        shop_disable: 1
      })
      res.status(200).send(shop)
    })
    .catch(err => {
      res.status(500).send(err)
    })
  },

  destroy (req, res) {
    cedCsmarketplaceVendorShop.destroy({
      where: {
        id: 1
      }
    })
    .then(shop => {
      res.status(200).send()
    })
    .catch(err => {
      res.status(500).send(err)
    })
  },

  checkPassword (req, res) {
    if (!(req.query.email && req.query.password)) return res.status(200).send(false)
    customerEntity.find({
      where: {
        email: req.query.email
      }
    }).then(customer => {
      if (customer) {
        magento.login(function (err, sessId) {
          if (err) return res.status(500).send(err)
          magento.customer.info({
            customerId: customer.dataValues.entity_id
          },
          function (err, customerInfo) {
            if (err) return res.status(500).send(err)
            return res.status(200).send(checkPasswordHash(req.query.password, customerInfo.password_hash))
          })
        })
      } else {
        res.status(200).send(false)
      }
    }).catch(err => {
      return res.status(400).send(err)
    })
  },

  addImage (req, res) {
    magento.login(function (err, sessId) {
      if (err) res.status(500).send(err)
      magento.catalogProductAttributeMedia.list({
        product: req.body.productId
      },
      function (err, product) {
        if (err) res.status(500).send(err)
        var newImage = {
          file: {
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
          data: newImage
        },
        function (err, image) {
          if (err) res.status(500).send(err)
          console.log(image)
          res.status(200).send(image)
        })
      })
    })
  }
}

function checkPasswordHash (password, hash) {
  var hashSplit = hash.split(':')
  if (hashSplit[0] === md5(hashSplit[1] + password)) return true
  else return false
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
//   })

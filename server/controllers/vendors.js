const {
  cedCsmarketplaceVendorProducts,
  cedCsmarketplaceVendorShop,
  cedCsmarketplaceVendor,
  cedCsmarketplaceVendorDatetime,
  cedCsmarketplaceVendorInt,
  cedCsmarketplaceVendorVarchar
} = require('../models')
const MagentoAPI = require('magento-api')
const md5 = require('md5')
const customerEntity = require('../models').customer_entity
const magento = new MagentoAPI(require('../config/magento'))

module.exports = {
  create ({ body }, response) {
    if (customerDataIsComplete(body)) {
      const customerData = {
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        password: body.password,
        website_id: 1,
        store_id: 1,
        group_id: 1
      }
      let vendorId = 0
      magento.login(function (error, _sessionId) {
        if (error) return response.status(500).send({ error: error.message || error })
        magento.customer.create({ customerData }, function (error, customerInfo) {
          if (error) return response.status(500).send({ message: error.message || error })
          cedCsmarketplaceVendor.create({
            entity_type_id: 9,
            attribute_set_id: 0,
            increment_id: '',
            store_id: 0,
            created_at: new Date(),
            updated_at: new Date(),
            is_active: 1,
            website_id: 1
          }).then(vendor => {
            vendorId = vendor.null
            return Promise.all([
              cedCsmarketplaceVendorDatetime.create(generateEntity(9, 133, 0, vendorId, new Date())),
              cedCsmarketplaceVendorInt.create(generateEntity(9, 132, 0, vendorId, customerInfo)),
              cedCsmarketplaceVendorInt.create(generateEntity(9, 140, 0, vendorId, 1)),
              cedCsmarketplaceVendorVarchar.create(generateEntity(9, 137, 0, vendorId, body.company_name)),
              cedCsmarketplaceVendorVarchar.create(generateEntity(9, 149, 0, vendorId, body.telephone.replace(',', '').replace('.', ''))),
              cedCsmarketplaceVendorVarchar.create(generateEntity(9, 134, 0, vendorId, (body.company_name).toLowerCase().replace(/\s/g, ''))),
              cedCsmarketplaceVendorVarchar.create(generateEntity(9, 135, 0, vendorId, 'approved')),
              cedCsmarketplaceVendorVarchar.create(generateEntity(9, 136, 0, vendorId, 'general')),
              cedCsmarketplaceVendorVarchar.create(generateEntity(9, 139, 0, vendorId, `${body.firstname} ${body.lastname}`)),
              cedCsmarketplaceVendorVarchar.create(generateEntity(9, 144, 0, vendorId, body.fantasy_name)),
              cedCsmarketplaceVendorVarchar.create(generateEntity(9, 148, 0, vendorId, body.company_address)),
              cedCsmarketplaceVendorVarchar.create(generateEntity(9, 161, 0, vendorId, body.company_cnpj)),
              body.facebookId ? cedCsmarketplaceVendorVarchar.create(generateEntity(9, 153, 0, vendorId, body.facebookId)) : Promise.resolve()
            ])
          }).then(() => {
            response.status(200).send(vendorId.toString())
          }).catch(error => {
            response.status(500).send({ message: error.message || error })
          })
        })
      })
    } else response.status(400).send({ message: 'There are mandatory fields missing' })
  },

  list ({ query }, response) {
    magento.login(function (error, _sessionId) {
      if (error) return response.status(500).send(error)
      return cedCsmarketplaceVendorProducts.findAll({
        where: { vendor_id: query.vendorId }
      }).then(products => {
        return Promise.all(products.map(({ dataValues }) => {
          return new Promise((resolve, _reject) => {
            magento.catalogProductAttributeMedia.list({
              product: dataValues.product_id
            }, function (_error, product) {
              resolve({ ...dataValues, Media: product || null })
            })
          })
        }))
      }).then(productsList => {
        var newList = productsList.filter(item => !!item)
        console.log(newList)
        response.status(200).send(newList)
      }).catch(error => response.status(500).send(error))
    })
  },

  createProduct (req, res) {
    let newProduct = {
      category_ids: [req.body.categoria, req.body.bairro],
      website_ids: [ 1 ],
      name: req.body.name,
      description: req.body.description,
      short_description: req.body.shortDescription,
      weight: req.body.weight,
      status: '1',
      url_key: req.body.urlKey,
      url_path: req.body.urlPath,
      visibility: '4',
      price: req.body.price,
      tax_class_id: 1,
      meta_title: req.body.metaTitle,
      meta_keyword: req.body.metaKeyword,
      meta_description: req.body.metaDescription
    }

    magento.login(function (err, sessId) {
      if (err) return res.status(500).send(err)
      magento.catalogProduct.create({
        type: 'simple',
        set: 4,
        sku: req.body.sku,
        data: newProduct
      }, function (err, product) {
        if (err) return res.status(500).send(err)
        cedCsmarketplaceVendorProducts.create({
          vendor_id: req.body.vendorId,
          product_id: product,
          type: 'simple',
          price: req.body.price,
          special_price: 0,
          name: req.body.name,
          description: req.body.description,
          short_description: req.body.shortDescription,
          sku: req.body.sku,
          weight: req.body.weight,
          check_status: 1,
          qty: req.body.quantity,
          is_in_stock: 1,
          website_ids: '1',
          is_multiseller: 0,
          parent_id: 0
        })
          .then(vendorProduct => {
            magento.catalogProductAttributeMedia.list({
              product: vendorProduct.dataValues.product_id
            },
            function (err, product) {
              if (err) return res.status(200).send(vendorProduct.dataValues.product_id.toString())
              var newImage = {
                file: {
                  content: req.body.imageBase64,
                  mime: 'image/jpeg',
                  name: req.body.imageName
                },
                label: '',
                position: 0,
                types: ['image', 'small_image', 'thumbnail'],
                exclude: '0'
              }
              magento.catalogProductAttributeMedia.create({
                product: vendorProduct.dataValues.product_id,
                data: newImage
              },
              function (err, image) {
                if (err) return res.status(200).send(vendorProduct.dataValues.product_id.toString())
                if (req.body.image2Base64) {
                  var newImage2 = {
                    file: {
                      content: req.body.image2Base64,
                      mime: 'image/jpeg',
                      name: req.body.image2Name
                    },
                    label: '',
                    position: 1,
                    types: [],
                    exclude: '0'
                  }
                  magento.catalogProductAttributeMedia.create({
                    product: vendorProduct.dataValues.product_id,
                    data: newImage2
                  },
                  function (err, image2) {
                    if (err) return res.status(200).send(vendorProduct.dataValues.product_id.toString())
                    if (req.body.image3Base64) {
                      var newImage3 = {
                        file: {
                          content: req.body.image3Base64,
                          mime: 'image/jpeg',
                          name: req.body.image3Name
                        },
                        label: '',
                        position: 2,
                        types: [],
                        exclude: '0'
                      }
                      magento.catalogProductAttributeMedia.create({
                        product: vendorProduct.dataValues.product_id,
                        data: newImage3
                      },
                      function (err, image3) {
                        if (err) return res.status(200).send(vendorProduct.dataValues.product_id.toString())
                        return res.status(200).send(vendorProduct.dataValues.product_id.toString())
                      })
                    } else {
                      return res.status(200).send(vendorProduct.dataValues.product_id.toString())
                    }
                  })
                } else {
                  return res.status(200).send(vendorProduct.dataValues.product_id.toString())
                }
              })
            })
          })
          .catch(err => res.status(500).send(err))
      })
    })
  },

  getProduct ({ query }, response) {
    magento.login(function (error, _sessionId) {
      if (error) return response.status(500).send(error)
      magento.catalogProduct.info({
        id: query.productId
      }, function (error, product) {
        if (error) return response.status(500).send(error)
        cedCsmarketplaceVendorProducts.find({
          where: {
            product_id: query.productId
          }
        }).then(vendorProduct => {
          const newProduct = {
            product_id: Number(product.product_id),
            price: Number(product.price),
            special_price: Number(product.special_price),
            name: product.name,
            description: product.description,
            shortDescription: product.short_description,
            sku: product.sku,
            qty: vendorProduct.dataValues.qty,
            category: product.category_ids[0],
            neighbourhood: product.category_ids[1]
          }
          console.log(newProduct)
          response.status(200).send(newProduct)
        }).catch(error => { response.status(500).send(error) })
      })
    })
  },

  editProduct (req, res) {
    let editProduct = {
      category_ids: [req.body.categoria, req.body.bairro],
      price: req.body.price,
      name: req.body.name,
      description: req.body.description,
      short_description: req.body.shortDescription
    }
    magento.login(function (err, sessId) {
      if (err) return res.status(500).send(err)
      magento.catalogProduct.update({
        id: req.body.productId,
        data: editProduct
      }, function (err, product) {
        if (err) return res.status(500).send(err)
        cedCsmarketplaceVendorProducts.update(
          {
            price: req.body.price,
            name: req.body.name,
            description: req.body.description,
            short_description: req.body.shortDescription,
            qty: req.body.quantity
          },
          { where: {
            product_id: req.body.productId
          }})
          .then(vendorProduct => {
            res.status(200).send(true)
          })
          .catch(err => res.status(500).send(err))
      })
    })
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
            if (err && !checkPasswordHash(req.query.password, customerInfo.password_hash)) return res.status(500).send(err)
            cedCsmarketplaceVendorInt.find({
              where: {
                attribute_id: 132,
                value: customer.dataValues.entity_id
              }
            }).then(vendor => {
              return res.status(200).send(vendor.dataValues.entity_id.toString())
            }).catch(err => {
              return res.status(400).send(err)
            })
          })
        })
      } else {
        return res.status(200).send('0')
      }
    }).catch(err => {
      return res.status(400).send(err)
    })
  },

  checkFacebookId (req, res) {
    if (!req.query.facebookId) return res.status(200).send(false)
    cedCsmarketplaceVendorVarchar.find({
      where: {
        attribute_id: 153,
        entity_type_id: 9,
        store_id: 0,
        value: req.query.facebookId
      }
    }).then(customer => {
      if (customer) {
        res.status(200).send(customer.dataValues.entity_id.toString())
      } else {
        return res.status(200).send('0')
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

function customerDataIsComplete (data) {
  return (
    data.email &&
    data.firstname &&
    data.lastname &&
    data.password &&
    data.fantasy_name &&
    data.company_name &&
    data.company_address &&
    data.company_cnpj &&
    data.telephone
  )
}

function generateEntity (entity_type_id, attribute_id, store_id, entity_id, value) {
  return { entity_type_id, attribute_id, store_id, entity_id, value }
}

// magento.login(function (err, sessId) {
//   if (err) return res.status(500).send(err)
//      magento.catalogProductAttributeMedia.list({
//       product : 163
//     }, function(err, product){
//         console.log("err"+err)
//         console.log(product)
//     })
// })

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

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
        if (error) return response.status(500).send(errorSanitizer(error))
        magento.customer.create({ customerData }, function (error, customerInfo) {
          if (error) return response.status(500).send(errorSanitizer(error))
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
            response.status(500).send(errorSanitizer(error))
          })
        })
      })
    } else response.status(400).send(errorSanitizer({ name: 'Missing fields', message: 'There are mandatory fields missing' }))
  },

  list ({ query }, response) {
    magento.login(function (error, _sessionId) {
      if (error) return response.status(500).send(errorSanitizer(error))
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
      }).catch(error => {
        response.status(500).send(errorSanitizer(error))
      })
    })
  },

  createProduct ({ body }, response) {
    let productId
    let newProduct = {
      category_ids: [body.categoria, body.bairro],
      website_ids: [ 1 ],
      name: body.name,
      description: body.description,
      short_description: body.shortDescription,
      weight: body.weight,
      status: '1',
      url_key: body.urlKey,
      url_path: body.urlPath,
      visibility: '4',
      price: body.price,
      tax_class_id: 1,
      meta_title: body.metaTitle,
      meta_keyword: body.metaKeyword,
      meta_description: body.metaDescription
    }

    magento.login(function (error, _sessionId) {
      if (error) return response.status(500).send(errorSanitizer(error))
      magento.catalogProduct.create({
        type: 'simple',
        set: 4,
        sku: body.sku,
        data: newProduct
      }, function (error, product) {
        if (error) return response.status(500).send(errorSanitizer(error))
        cedCsmarketplaceVendorProducts.create({
          vendor_id: body.vendorId,
          product_id: product,
          type: 'simple',
          price: body.price,
          special_price: 0,
          name: body.name,
          description: body.description,
          short_description: body.shortDescription,
          sku: body.sku,
          weight: body.weight,
          check_status: 1,
          qty: body.quantity,
          is_in_stock: 1,
          website_ids: '1',
          is_multiseller: 0,
          parent_id: 0
        }).then(result => {
          productId = result.dataValues.product_id
          return new Promise(resolve => {
            magento.catalogProductAttributeMedia.list({
              product: productId
            }, resolve)
          })
        }).then(error => {
          if (error) return Promise.resolve()
          const images = [
            [body.imageBase64, body.imageName],
            [body.image2Base64, body.image2Name],
            [body.image3Base64, body.image3Name]
          ]
          return Promise.all(images.map((img, i) => createProductImage(img[0], img[1], productId, i, magento)))
        }).then(() => {
          response.status(200).send(productId.toString())
        }).catch(error => {
          response.status(500).send(errorSanitizer(error))
        })
      })
    })
  },

  getProduct ({ query }, response) {
    magento.login(function (error, _sessionId) {
      if (error) return response.status(500).send(errorSanitizer(error))
      magento.catalogProduct.info({
        id: query.productId
      }, function (error, product) {
        if (error) return response.status(500).send(errorSanitizer(error))
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
            qty: vendorProduct && vendorProduct.dataValues.qty,
            category: product.category_ids[0],
            neighbourhood: product.category_ids[1]
          }
          console.log(newProduct)
          response.status(200).send(newProduct)
        }).catch(error => {
          response.status(500).send(errorSanitizer(error))
        })
      })
    })
  },

  editProduct ({ body }, response) {
    let editProduct = {
      category_ids: [body.categoria, body.bairro],
      price: body.price,
      name: body.name,
      description: body.description,
      short_description: body.shortDescription
    }
    magento.login(function (error, _sessionId) {
      if (error) return response.status(500).send(errorSanitizer(error))
      magento.catalogProduct.update({
        id: body.productId,
        data: editProduct
      }, function (error) {
        if (error) return response.status(500).send(errorSanitizer(error))
        cedCsmarketplaceVendorProducts.update(
          {
            price: body.price,
            name: body.name,
            description: body.description,
            short_description: body.shortDescription,
            qty: body.quantity
          }, {
            where: {
              product_id: body.productId
            }
          }
        ).then(() => {
          response.status(200).send(true)
        }).catch(error => {
          response.status(500).send(errorSanitizer(error))
        })
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

  addImage ({ body }, response) {
    magento.login(function (error, _sessionId) {
      if (error) response.status(500).send(errorSanitizer(error))
      magento.catalogProductAttributeMedia.list({
        product: body.productId
      },
      function (error, product) {
        if (error) response.status(500).send(errorSanitizer(error))
        createProductImage(
          body.imageBase64,
          body.imageName,
          body.productId,
          product.lenght,
          magento
        ).then((error, image) => {
          if (error) response.status(500).send(errorSanitizer(error))
          console.log(image)
          response.status(200).send(image)
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

function createProductImage (content, name, productId, position, magento) {
  if (!content) return Promise.resolve()
  return new Promise(function (resolve) {
    var newImage = {
      file: {
        content,
        mime: 'image/jpeg',
        name
      },
      label: '',
      position,
      types: position === 0 ? ['image', 'small_image', 'thumbnail'] : [],
      exclude: '0'
    }
    magento.catalogProductAttributeMedia.create({
      product: productId,
      data: newImage
    }, function (error) {
      if (error) console.error(error)
      resolve()
    })
  })
}

function errorSanitizer (error) {
  return {
    name: error.name || error,
    message: error.message || error
  }
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

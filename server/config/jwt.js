module.exports = {
  secret: process.env.JWT_SECRET || [
    '^4adRz7@E6CBMowLfH8gu6Bk2vy@gGWe',
    '2YyjFKUfvEEtqe5o68FfCzkENktTgRo&',
    'a9vxBJdtha65Z*mvM&!ks5k1$18Px0C3',
    'p7uZx#zmG6p$kon7Qlc5N8oHJ#kkQgcr'
  ].join(''),
  config: {
    expiresIn: '1y'
  }
}

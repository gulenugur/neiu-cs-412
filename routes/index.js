const express = require('express')
const router = express.Router()

router.get('/', async function(req, res, next) {
  let options = {title: 'Puppy Paw', img: 'puppy-care.jpg', default: 'default', styles: ['style.css','center.css'],isHomeActive: 'active'}
  res.render('index', options)
})

module.exports = router

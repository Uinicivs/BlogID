const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users:users})
    })
})

router.get('/admin/users/create', adminAuth, (req, res) => {
    res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if(user == undefined){
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash
            }).then(() => res.redirect('/'))
            .catch(() => res.redirect('/'))
        }
        else
        res.redirect('/admin/users/create')
    })
})

router.get('/user/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined){
            const correct = bcrypt.compareSync(password, user.password)

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles')
            }
            else
                res.redirect('/user/login')
        }
        else
            res.redirect('/user/login')
    })
})

router.get('/user/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router
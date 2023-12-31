const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/newCategory')
})

router.post('/categories/save', (req, res) => {
    const categoryTitle = req.body.category_input
    Category.create({
        title: categoryTitle,
        slug: slugify(categoryTitle)
    }).then(() => res.redirect('/admin/categories'))
})

router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', {
            categories: categories
        })
    })
})

router.post('/categories/delete', (req, res) => {
    const id = req.body.id
    if(id != undefined && !isNaN(id)){
        Category.destroy({
            where: {
                id: id
            }
        })
        .then(() => res.redirect('/admin/categories'))
    }
    else
        res.redirect('/admin/categories')
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id

    isNaN(id) ? res.redirect('/admin/categories') : null

    Category.findByPk(id).then(category => {
        if(category != 'undefined'){
            res.render('admin/categories/edit', {category: category})
        }
        else
        res.redirect('/admin/categories')
    })
    .catch(() => res.redirect('/admin/categories'))
})

router.post('/categories/update', (req, res) => {
    const id = req.body.category_id
    const newTitle = req.body.category_input

    Category.update({title: newTitle, slug: slugify(newTitle)}, 
        {where:{
            id: id
    }}).then(() => res.redirect('/admin/categories'))
})

module.exports = router
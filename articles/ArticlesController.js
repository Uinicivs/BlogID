const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')


router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles})
    })
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/newArticle', {categories: categories})
    })
    
})

router.post('/articles/save', (req, res) =>{
    const articleTitle = req.body.article_title
    const articletext = req.body.article_text
    const categoryID = req.body.category_id

    Article.create({
        title: articleTitle,
        slug: slugify(articleTitle),
        body: articletext,
        categoryId: categoryID
    }).then(() => res.redirect('/admin/articles'))
})

router.post('/articles/delete', (req, res) => {
    const id = req.body.id
    if(id != undefined && !isNaN(id)){
        Article.destroy({
            where: {
                id: id
            }
        })
        .then(() => res.redirect('/admin/articles'))
    }
    else
        res.redirect('/admin/articles')
})

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id
    Article.findByPk(id).then(article => {
        if(article != undefined)
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {article: article, categories: categories})
            })
        else
            res.redirect('/admin/articles')
    })
    .catch(() => res.redirect('/admin/articles'))
})

router.post('/articles/update', (req, res) => {
    const id = req.body.article_id
    const title = req.body.article_title
    const category = req.body.category_id
    const text = req.body.article_text

    Article.update({
        title: title,
        body: text,
        categoryId: category,
        slug: slugify(title)
    }, {where: {id: id}}).then(() => res.redirect('/admin/articles'))
    .catch(() => res.redirect('/admin/articles'))
})

router.get('/articles/page/:num', (req, res) => {
    const page = req.params.num
    var offset
    (isNaN(page) || parseInt(page) == 1) ? offset = 0 : offset = parseInt(page) - 1
    Article.findAndCountAll({
        limit: 5,
        offset: offset * 5
    }).then(articles => {
        var next 
        if(offset + 5 >= articles.count)
            next = false
        else
            next = true
        
        var result = {
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result: result, categories: categories})
        })
    })
})

module.exports = router
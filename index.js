const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const session = require('express-session')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const userController = require('./user/UserController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')

//CARREGANDO VIEW ENGINE
app.set('view engine', 'ejs')

//SESSIONS
app.use(session({
    secret: 'kdpssd',
    cookie: {maxAge: 30000000}
}))

//ARQUIVOS ESTÁTICOS
app.use(express.static('public'))

//BODY PARSER
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//BANCO DE DADOS
connection.authenticate()
    .then(() => {console.log('deu certo conex')})
    .catch((error) => console.log(error))

//ROTAS
app.get('/', (req, res) => {
    Article.findAll({limit: 5}).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories})
        })
    })
    
})

app.get('/:slug', (req, res) => {
    const slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => 
        (article != undefined) ? Category.findAll().then(categories => {res.render('article', {article: article, categories: categories})}) : res.redirect('/'))
    .catch(() => res.redirect('/'))
})

app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined)
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            })
        else
            res.redirect('/')
    })
    .catch(() => res.redirect('/'))
})



app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', userController)

app.listen(8081, () => console.log('ok'))

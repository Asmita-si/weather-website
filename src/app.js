const path  = require('path')
const express = require('express')
const hbs = require('hbs')
const { readSync } = require('fs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))

const app =express()
const port =process.env.PORT || 3000

//Define paths for Express config
const pulbicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use( express.static(pulbicDirectoryPath) )

app.get( '', (req,res) =>{
    res.render('index', {
        title: 'Weather ',
        name: 'Asmita'
    })
} )

app.get( '/about', (req,res) =>{
    res.render('about', {
        title: 'About me ',
        name: 'Asmita Si'
    })
} )

app.get( '/help', (req,res) =>{
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name : 'Asmita'
    })
} )



app.get( '/weather', (req, res) =>{
    if( !req.query.address ){
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location}={})=>{
        if(error){
            return res.send({error})
        }
        forecast( latitude,longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })

        })
    })




} )

app.get( '/products', (req, res) =>{
    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })

} )

app.get('/help/*', (req, res)=> {
    res.render('404', {
        errorMessage : 'Help article not found',
        title: '404',
        name: 'Asmita'
    })
})

app.get('*', (req, res)=> {
    res.render('404', {
        title: '404',
        errorMessage : 'Page not found',
        name: 'Asmita'
    })
})


app.listen( port, ()=>{
    console.log('Server is up on port '+ port)
} )
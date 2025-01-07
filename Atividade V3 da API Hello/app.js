const express = require('express')
const app = express()
const PORT = 3000

app.listen(PORT, () => {
    console.log('Hello API on port 3000')
})

app.get('/', function(req, res) {
    res.send('hello')
})

app.get('/v2/:name', function(req, res) {
    res.send('hello' + res.params.name)
})

const messages = {
    'en': 'hello',
    'pt-br': 'olá',
    'es': 'hola'
}

app.get('/v3/:lang/:name/json', function(req, res) {
    const lang = req.params.lang
    const name = req.params.name
    const message = messages[lang]

    if (message) {
        res.json({msg: message + ' ' + name})
    } else {
        res.json({err: 'invalid language'})
    }
})

app.get('/v3/*', function(req, res) {
    res.json({err: 'invalid endpoint'})
})

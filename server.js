/* global require __dirname */
var express = require('express')
  , template = require('./lib/template')
  , md = require('ghm').parse
  , fs = require('fs')
  , path = require('path')
  , contentRoot = path.resolve(__dirname ,'content/')

var app = express()
  , required = {}
  , oneYear = 31557600000

app.use(express.favicon(__dirname + '/htdocs/favicon.ico'));
app.use(express.static(__dirname + '/htdocs' ,{ maxAge: oneYear }));

app.get('/' ,function (req ,res) {
  var content = readFile('index.md')
  processIndex(content ,res)
})

app.get('/:route' ,function (req ,res) {
  var content
  try {
    content = readFile(req.params.route + '.md')
  } catch (err) {
    content = null
  }
  if (!content) content = readFile('error.md')
  processIndex(content ,res)
})

var readFile = function (filename) {
  return fs.readFileSync(contentRoot + '/' + filename ,'utf8')
}

var processIndex = function (content ,res) {
  res.send(template.process( 'index'
                           , { title:  'Thom Blake'
                             , content: md(content ,'thomblake/thomblake')
                             }
                           ))
}

app.listen(80)


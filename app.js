const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const graphHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
app.use(bodyParser.json());

app.use(isAuth);
app.use('/graphql', graphHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));
/*Adds the react production build to serve react requests*/
// app.use(express.static('frontend/public'));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/frontend/public/index.html'));
// });
// console.log(process.env , process.env.MONGO_USER, process.env.MONGO_PASSWORD);
const port = process.env.PORT || 8000;
const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@multisiam-pugea.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
// mongoose.connect(`mongodb+srv://siam:123456789SA@multisiam-pugea.mongodb.net/eventDB?retryWrites=true&w=majority`, {useNewUrlParser:  true, useUnifiedTopology: true})
mongoose.connect(URI, {useNewUrlParser:  true, useUnifiedTopology: true})
.then(()=> {
    app.listen(port, console.log("server running 8000"));
}).catch(err => {
    console.log(err);
})





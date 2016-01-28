var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var createHashHistory = require('history/lib/createHashHistory')
const history = createHashHistory()

var Main = require('./pages/main.jsx');

module.exports = (
    <Router history={history}>
        <Route path="/" component={Main}>
        </Route>
    </Router>
);
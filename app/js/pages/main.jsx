var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

var Logger = require('../utils/logger.jsx');
var TestPage = require('./test-page.jsx');
var HomePage = require('./home-page.jsx');

module.exports = React.createClass({
    componentDidUpdate: function(){
        componentHandler.upgradeDom();
    },
    render: function(){
        return <div className="row">
            {this.renderChildren()}
        </div>
    },
    renderChildren: function(){
        if(this.props.children){
            return this.props.children;
        } else {
            return <HomePage />
        }
    },
});
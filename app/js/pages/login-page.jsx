var React = require('react');
var $ = require('jquery');

var Header = require('../components/header.jsx');
module.exports = React.createClass({
    getUrlVars: function()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = decodeURIComponent(hash[1]);
        }
        return vars;
    },
    componentWillMount: function(){
        this.postURL = window.location.href;
    },
    render: function(){
        return <div className="col-md-8 col-md-offset-2" id="loginPage">
            <Header />
            <form action={this.postURL} method="post">
                <text><i>(This is a https tunnel to our Slack2Peach server to ensure secure login)</i></text>
                <br />
                <text>Peach Email ID:</text>
                <input type="text" name="peach-email"/>
                <text>Peach Password:</text>
                <input type="password" name="peach-password"/>
                <br />
                <input
                    type="submit"
                    value="Submit"
                    className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                    style={{backgroundColor: "#fe4e72", color: "#ffffff"}}/>
            </form>
        </div>
    },
});
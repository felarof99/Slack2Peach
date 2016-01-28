var React = require('react');

var Header = require('../components/header.jsx');
var InfoCardList = require('../components/info-card-list.jsx');
var Footer = require('../components/footer.jsx');

module.exports = React.createClass({
    render: function(){
        return <div className="col-md-4 col-md-offset-4" id="homePage">
            <Header />
            <p>A 3rd party open source Slack Client for <a href="http://peach.cool/">Peach</a> - built using unannounced API endpoints intercepted from the official iOS app.</p>
            <div id="homePageBtnsRow">
                <a href="https://slack.com/oauth/authorize?scope=commands&client_id=4304225474.19453169991"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"/></a>
                <a
                    href="https://github.com/felarof99/Slack2Peach"
                    className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                    style={{backgroundColor: "#fe4e72", color: "#ffffff", height: 39}}>Browse on GitHub</a>
            </div>
            <p>The app communicates directly with the Peach API servers, so you can rest assured that any data transmitted or received is safe and secure (including login credentials).</p>
            <InfoCardList />
            <br />
            <br />
            <Footer />
        </div>
    },
});

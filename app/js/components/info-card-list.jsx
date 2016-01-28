var React = require('react');

var InfoCard = require('./info-card.jsx');

module.exports = React.createClass({
    render: function(){
        return <div className="flexbox-col">
            <h4><u>Instructions:</u></h4>
            <div className="info-card-list">
                <InfoCard info="First, login to your Peach account; login to the account that you want to use from Slack. (one-time only)." commands={["/peach login"]}/>

                <InfoCard info="Then, you can wave at your Friends!" commands={["/peach cake @username", "/peach wave @username", "/peach boop @username", "/peach hiss @username", "/peach quarantine @username"]}/>

                <InfoCard info="Or post updates directly from Slack." commands={["/peach post Hello, from Slack2Peach!"]} />
            </div>
            <br />
            <br />
            <h5><i>More commands will be supported soon!</i></h5>
        </div>
    },
});

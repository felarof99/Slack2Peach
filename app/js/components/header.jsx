var React = require('react');

module.exports = React.createClass({
    render: function(){
        return <div className="header">
            <br />
            <img src="./img/icon.png" width="80" height="80" />
            <br />
            <h2>Slack2Peach<br/>
                <small>Use Peach from Slack!</small>
            </h2>
        </div>
    },
});
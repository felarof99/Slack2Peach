var React = require('react');

module.exports = React.createClass({
    render: function(){
        return <div className="mdl-card mdl-shadow--2dp info-card bg-primary-color-transparent">
            <h6>{this.props.info}</h6>
            <div className="info-card-commands">
                {this.renderCommands()}
            </div>
        </div>
    },
    renderCommands: function(){
        return this.props.commands.map(function(command){
            return <div className="bg-secondary-color-transparent" style={{color: "#000000", borderRadius: 5, padding: 4, marginTop: 4, marginBottom: 4}}>
                <h5>{command}</h5>
            </div>
        });
    }
});
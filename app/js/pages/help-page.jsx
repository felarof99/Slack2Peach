var React = require('react');

var Header = require('../components/header.jsx');
var InfoCardList = require('../components/info-card-list.jsx');
var Footer = require('../components/footer.jsx');

module.exports = React.createClass({
    render: function(){
        return <div className="flexbox-col">
            <Header />
            <br />
            <br />
            <InfoCardList />
            <br />
            <br />
            <Footer />
        </div>
    },
});
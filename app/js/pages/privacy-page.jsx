var React = require('react');

var Header = require('../components/header.jsx');
var Footer = require('../components/footer.jsx');

module.exports = React.createClass({
    render: function(){
        return <div className="flexbox-col col-md-4 col-md-offset-4">
            <Header />
            <br />
            <br />
            <div id="privacyPageContent">
                <h1><a id="Privacy_Policy_0"></a>Privacy Policy</h1>
                <p>Slack2Peach just acts a tunnel between Slack and Peach APIs. The absolute minimum amount of data is stored for the purpose of interacting with the Slack API. Additionally, this project is open source. For more details check <a href="https://github.com/felarof99/Slack2Peach/">https://github.com/felarof99/Slack2Peach/</a>.</p>
                <h3><a id="Stored_Data_3"></a>Stored Data</h3>
                <p>Some data is stored by Slack2Peach server, so that interaction with the Slack API is possible. This includes the Slack username and their access token to Peach API.</p>
                <h3><a id="Explicitly_NOT_stored_data_6"></a>Explicitly NOT stored data</h3>
                <p>By design, Slack2Peach has very little access to your team’s data: Slack2Peach cannot view a lot of information about your team, it cannot view any activities in any of the channels and it also does not have access to any of your files. The only data it can access is the data that you are sending via the slash command (/peach cake @username). In this example Slack2Peach will receive the text of the slash command, namely @username. This data is directly passed to Peach API and is not stored in ANY way!</p>
                <h3><a id="Third_Party_Services_9"></a>Third Party Services</h3>
                <p>Slack2Peach uses Firebase Please refer to the Firebase Privacy Policy for more details: <a href="https://www.firebase.com/terms/privacy-policy.html">https://www.firebase.com/terms/privacy-policy.html</a></p>
                <h3><a id="Advertising_12"></a>Advertising</h3>
                <p>Slack2Peach does not display any advertisements, and does not share any of the (already little data) it has with advertisers.</p>
                <h3><a id="Policy_15"></a>Policy</h3>
                <p>This privacy policy may change over time.</p>
            </div>
            <br />
            <br />
            <Footer />
        </div>
    },
});

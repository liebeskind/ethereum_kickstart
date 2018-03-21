import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';

class CampaignIndex extends Component {
  
  static async getInitialProps() { // static defines a class object and is a requirement of next.js.
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true // Makes card stretch the entire width of container.
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
          <h3>Open Campaigns</h3>
          {this.renderCampaigns()}
          <Button  
            content="Create Campaign"
            icon="add circle"
            primary // Same thing as primary={true}.
          />
        </div>;
      </Layout>
    )
  }
}

export default CampaignIndex;
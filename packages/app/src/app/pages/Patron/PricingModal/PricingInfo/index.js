import React from 'react';

import Feature from './Feature';

import { Title } from '../elements';
import { Container, CenteredHeader } from './elements';

function PricingInfo() {
  return (
    <Container>
      <Title>Lifted Limits</Title>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th />
            <CenteredHeader>Free</CenteredHeader>
            <CenteredHeader supporter>Patron</CenteredHeader>
          </tr>
        </thead>
        <tbody>
          <Feature feature="Private Sandboxes" free="No" supporter="Yes" />
          <Feature feature="Sandbox Limit" free="50" supporter="Unlimited" />
          <Feature feature="Dependency Limit" free="20" supporter="40" />
          <Feature
            disabled
            feature="Static File Hosting"
            free="10Mb"
            supporter="1Gb"
          />
        </tbody>
      </table>
    </Container>
  );
}

export default PricingInfo;

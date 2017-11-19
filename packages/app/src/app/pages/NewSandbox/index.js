import React from 'react';

import Navigation from 'app/containers/Navigation';

import MaxWidth from 'common/components/flex/MaxWidth';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import Title from 'app/components/text/Title';

import NewSandbox from 'app/components/sandbox/NewSandbox';

export default () => (
  <MaxWidth>
    <Margin style={{ height: '100%' }} vertical={1.5} horizontal={1.5}>
      <Navigation title="New Sandbox" />

      <Margin top={9}>
        <Centered horizontal vertical>
          <Title>New Sandbox</Title>
          <Margin top={2}>
            <NewSandbox />
          </Margin>
        </Centered>
      </Margin>
    </Margin>
  </MaxWidth>
);

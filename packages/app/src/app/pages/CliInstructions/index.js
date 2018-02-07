import React from 'react';

import Navigation from 'app/pages/common/Navigation';
import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';

import { Container, Content, Code } from './elements';

function CliInstructions() {
  return (
    <MaxWidth>
      <Margin vertical={1.5} horizontal={1.5}>
        <Container>
          <Navigation title="CLI Import" />
          <Content vertical>
            <Title>Import from CLI</Title>
            <SubTitle>
              1. Install the CLI <Code>npm i -g codesandbox</Code>
            </SubTitle>
            <SubTitle>
              2. Go to your `create-react-app` project{' '}
              <Code>cd path-of-your-project</Code>
            </SubTitle>
            <SubTitle>
              3. Deploy your project to CodeSandbox <Code>codesandbox ./</Code>
            </SubTitle>
          </Content>
        </Container>
      </Margin>
    </MaxWidth>
  );
}

export default CliInstructions;

// @flow
import React from 'react';
import styled from 'styled-components';

import ModulesContainer from './ModulesContainer';

import type { Module } from '../../store/entities/modules';
import type { Sandbox } from '../../store/entities/sandboxes/';

const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  width: 20rem;
`;

const Title = styled.h2`
  padding: 1rem;
  margin: 0 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: white;
  font-weight: 300;

  border-bottom: 1px solid ${props => props.theme.background.lighten(0.5)};
`;


type Props = {
  activeModuleId: string;
  url: (module: Module) => string;
  sandbox: ?Sandbox;
}
export default ({
  sandbox,
  activeModuleId,
  url,
}: Props) => (
  <Container>
    <Title>{sandbox ? sandbox.title : 'Loading...'}</Title>
    {sandbox &&
      <ModulesContainer activeModuleId={activeModuleId} url={url} />}
  </Container>
);

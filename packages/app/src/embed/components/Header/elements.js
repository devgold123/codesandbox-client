// @flow
import styled from 'styled-components';
import MenuIconSVG from 'react-icons/lib/md/menu';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background.darken(0.3)};
  background-color: ${props => props.theme.background};
`;

export const MenuIcon = styled(MenuIconSVG)`
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 1rem;
  cursor: pointer;
  z-index: 10;
`;

export const RightAligned = styled.div`
  position: absolute;
  right: 1rem;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export const Title = styled.div`
  @media (max-width: 450px) {
    display: none;
  }
`;

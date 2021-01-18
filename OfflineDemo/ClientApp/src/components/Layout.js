import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import NewVersionBanner from './NewVersionBanner';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
    <div>
        <NewVersionBanner />
        <NavMenu />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}

import React, { Component } from 'react'
import './navbar.scss'
import {layout as Layout} from '../Layout/layout'
import {cell as Cell} from '../Cell/cell'
import PropTypes from 'prop-types'
export class navbar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            height: 8,
            width: 8,
            mines: 10
        }
    }

    render() {
        const { height, width, mines } = this.state;
        return (
            <div className="game">
                <Layout height={height} width={width} mines={mines} />
            </div>
        );
    }
}
Cell.propTypes = {
    value: PropTypes.func
  }

export default navbar

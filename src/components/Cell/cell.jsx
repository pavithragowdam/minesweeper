import React, { Component } from 'react'
import './cell.scss'
export class cell extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }
    get_value() {
        const { value } = this.props;

        if (!value.is_box_revealed) {
            return this.props.value.is_flag ? "F" : null;
        }
        if (value.is_mime) {
            return "M";
        }
        if (value.neighbour === 0) {
            return null;
        }
        return value.neighbour;
    }

    render() {
        const { value, onClick, cMenu } = this.props;
        let className =
            "cell" +
            (value.is_box_revealed ? "" : " hidden") +
            (value.is_mime ? " is-mime" : "") +
            (value.is_flag ? " is-flag" : "");
        return (
            <div
                onClick={onClick}
                className={className}
                onContextMenu={cMenu}
            >
                {this.get_value()}
            </div>
        )
    }
}

export default cell

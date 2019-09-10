import React, { Component, PropTypes } from 'react';
import classNames from "classnames";



// This manager class allows us to assign ids to each instance of HoverDialog,
// and then remeber which is open to make sure we don't have more than one open
// at once.

class HoverDialogManager {


	constructor() {
		this.openId = null;
		this.nextId = 0;
	}

	openNew(id) {
		this.openId = id
	}

	getOpenId() {
		return this.openId;
	}

	getNextId() {
		return this.nextId++;
	}

}

let manager = new HoverDialogManager();
export default class HoverDialog extends Component {

	static propTypes = {
		dialog: PropTypes.element,
		hoverTimeout: PropTypes.number,
		className: PropTypes.string
	}

	static defaultProps = {
		hoverTimeout: 500,
		manager: manager
	}


	constructor(props) {
		super(props);
		this.hoverTimeout;
		this.id = this.props.manager.getNextId();
		this.state = {
			isHovering: false
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (!this.state.isHovering && nextState.isHovering) {
			this.props.manager.openNew(this.id);
		}
	}

	onMouseOver = () => {
		clearTimeout(this.hoverTimeoutObj);
		if (!this.props.disabled) {
			this.setState({
				isHovering: true
			})
		}
	}

	onMouseOut = () => {
		clearTimeout(this.hoverTimeoutObj);
		this.hoverTimeoutObj = setTimeout(()=> {
			this.setState({
				isHovering: false
			})
		}, this.props.hoverTimeout);
	}

	render() {

		const showHoverDialog = (this.state.isHovering || this.props.alwaysShowIf) && (this.props.manager.getOpenId() === this.id);
		const classnames = classNames({
			[this.props.className]: this.props.className != undefined,
			'hover-dialog': true,
			'hover-dialog--hovering': showHoverDialog,
			'hover-dialog--disabled': this.props.disabled
		})

		return (
			<div className={classnames} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
				{ this.props.children }
				<div className='hover-dialog__dialog'>
					{ this.props.dialog }
				</div>
			</div>
		)
	}
}
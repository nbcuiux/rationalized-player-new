import React, { Component, PropTypes } from 'react';

export default class VolumeControl extends Component {

	static propTypes = {
		onStartHandleDrag: PropTypes.func,
		onChange: PropTypes.func
	}

	static contextTypes = {
		theme: PropTypes.object
	}

	constructor(props) {
		super(props);
	}

	getVolFromMousePos(y) {
		let offsetTop = this.bar.getBoundingClientRect().top + this.bar.offsetHeight + window.pageYOffset;
		console.log("The offse top", offsetTop);
		let amt = (offsetTop - y) / this.bar.offsetHeight;
		amt = Math.max(0, amt);
		amt = Math.min(1, amt);
		return amt;
	}

	onStartHandleDrag = (e) => {
		e.preventDefault();
		let amt = this.getVolFromMousePos(e.pageY);
		this.props.onChange(amt, true);
		window.addEventListener('mousemove', this.onMouseMove);
		window.addEventListener('mouseup', this.onStopHandleDrag);
	}

	onStopHandleDrag = (e) => {
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('mouseup', this.onStopHandleDrag);
		let amt = this.getVolFromMousePos(e.pageY);
		this.props.onChange(amt, false);
	}

	onMouseMove = (e) => {
		console.log("mouse move");
		e.preventDefault();
		let amt = this.getVolFromMousePos(e.pageY);
		this.props.onChange(amt);
	}

	render() {

		const { currentTime, duration, value, theme } = this.props;
		const styleLeft = ((currentTime/duration) * 100) + "%";

		const top = (value * 100) + "%";  
	

		return (
			<div className="volume-control">
				<div className="volume-control__slider" onMouseDown={this.onStartHandleDrag} ref={(el)=>{ this.bar = el }}> 
					<div className="volume-control__highlight" style={{height: top, background: this.context.theme.colorHighlight}}>
					</div>
					<div className="volume-control__handle" style={{bottom: top}}>
					</div>
				</div>
			</div>
		)
	}
}
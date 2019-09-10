import React, { Component, PropTypes } from 'react';
import classNames from "classnames";


var languagePresets = [
	{
		label: "English",
		active: false
	},
	{
		label: "Spanish",
		active: false
	},
	{
		label: "Off",
		active: true
	}
];

export default class CCDialog extends Component {

	static propTypes = {
		onClickSettings: PropTypes.func
	}

	static contextTypes = {
		theme: PropTypes.object
	}

	constructor(props) {
		super(props);
	}

	onClickSettings = (e) => {
		this.props.onClickSettings();
	}

	onSelectQuality (index) {
		for (var i in languagePresets) {
			languagePresets[i].active = false;
			if (i == index) languagePresets[i].active = true;
		}
	}

	render() {

		return (
			<div className="cc-dialog">
				<div className="cc-dialog__title">Closed Captions</div>
				<ul className="cc-dialog__languages">
					{
						languagePresets.map((preset, index) => {
							let classnames = classNames({
								'active': preset.active
							});
							let style = preset.active ? { color: this.context.theme.colorHighlight } : {};
							return (
								<li key={index} style={style} className={classnames} onClick={this.onSelectQuality.bind(this, index)}>{preset.label}</li>
							);
						})
					}
				</ul>
				<ul className="cc-dialog__settings">
					<li onClick={this.onClickSettings}><i className="fa fa-cog"></i>Settings</li>
				</ul>
			</div>
		)
	}
}
import React, { Component, PropTypes } from 'react';
import classNames from "classnames";


var qualityPresets = [
	{
		label: "1080p (HD)",
		active: false
	},
	{
		label: "720p (HD)",
		active: false
	},
	{
		label: "480p",
		active: false
	},
	{
		label: "360p",
		active: false
	},
	{
		label: "240p",
		active: false
	},
	{
		label: "144p",
		active: false
	},
	{
		label: "Auto",
		active: true
	}
];

export default class QualityDialog extends Component {

	constructor(props) {
		super(props);
	}

	onSelectQuality (index) {
		for (var i in qualityPresets) {
			qualityPresets[i].active = false;
			if (i == index) qualityPresets[i].active = true;
		}
	}

	render() {
		return (
			<div className="quality-dialog">
				<div className="quality-dialog__title">Quality</div>
				<ul className="quality-dialog__option">
					{
						qualityPresets.map((preset, index) => {
							let classnames = classNames({
								'active': preset.active
							});
							return (
								<li key={index} className={classnames} onClick={this.onSelectQuality.bind(this, index)}>{preset.label}</li>
							);
						})
					}
				</ul>
			</div>
		)
	}
}
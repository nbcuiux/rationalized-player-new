import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Slider, { Range } from 'rc-slider';
import classNames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};


const fontSizes = [
	{
		label: "Xsmall",
		value: "10px"
	},
	{
		label: "Small",
		value: "15px"
	},
	{
		label: "Medium",
		value: "20px"
	},
	{
		label: "Large",
		value: "28px"
	},
	{
		label: "Xlarge",
		value: "35px"
	}
]


const fonts = [
	"Helvetica",
	"Arial",
	"Arial Black",
	"Verdana",
	"Courier New",
	"Georgia",
	"Impact",
	"Palatino",
	"Tahoma",
	"Times New Roman"
]




const edgeEffects = [
	{
		label: "None",
		value: ""
	},
	{
		label: "Drop shadow",
		value: "rgb({0}) 1px 1px 0px, rgb({0}) -1px 1px 0px"
	},
	{
		label: "Depressed",
		value: "rgb({0}) -1px 1px 0px, rgb({1}) 1px -1px 0px"
	},
	{
		label: "Raised",
		value: "rgb({0}) 1px 1px 0px, rgb({1}) -1px -1px 0px"
	},
	{
		label: "Uniform",
		value: "rgb({0}) -1px -1px 0px, rgb({0}) 1px -1px 0px, rgb({0}) -1px 1px 0px, rgb({0}) 1px 1px 0"
	}
]


const presets = [
	{
		font: "Verdana",
		fontSize: "20px",
		backgroundColor: "255,255,255",
		textColor: "0,0,0",
		borderColor: "none",
		textOpacity: "1",
		backgroundOpacity: "1",
		edgeEffect: "None",
		borderColor: "0,0,0"
	},
	{
		font: "Courier New",
		fontSize: "20px",
		backgroundColor: "34,34,34",
		textColor: "175,175,175",
		borderColor: "none",
		textOpacity: "1",
		backgroundOpacity: "1",
		edgeEffect: "Depressed",
		borderColor: "0,0,0"
	},
	{
		font: "Arial",
		fontSize: "20px",
		backgroundColor: "137,170,200",
		textColor: "255,255,255",
		borderColor: "none",
		textOpacity: "1",
		backgroundOpacity: "1",
		edgeEffect: "Drop shadow",
		borderColor: "0,0,0"
	},
	{
		font: "Times New Roman",
		fontSize: "20px",
		backgroundColor: "0,0,0",
		textColor: "85,194,183",
		borderColor: "none",
		textOpacity: "1",
		backgroundOpacity: "1",
		edgeEffect: "Uniform",
		borderColor: "0,0,0"
	},
	{
		font: "Arial",
		fontSize: "20px",
		backgroundColor: "255,255,255",
		textColor: "91,220,252",
		borderColor: "none",
		textOpacity: "1",
		backgroundOpacity: "1",
		edgeEffect: "Raised",
		borderColor: "255,255,255"
	},
	{
		font: "Times New Roman",
		fontSize: "20px",
		backgroundColor: "0,0,255",
		textColor: "255,255,0",
		borderColor: "none",
		textOpacity: "1",
		backgroundOpacity: "1",
		edgeEffect: "Uniform",
		borderColor: "0,0,0"
	}
]

const colorPalette = [
	{
		label: "White",
		value: "255,255,255"
	},


	{
		label: "Red",
		value: "255,0,0"
	},
	{
		label: "Green",
		value: "0,255,0"
	},
	{
		label: "Blue",
		value: "0,0,255"
	},
	{
		label: "Yellow",
		value: "255,255,0"
	},
	{
		label: "Purple",
		value: "255,0,255"
	},
	{
		label: "Cyan",
		value: "0,255,255"
	},
	{
		label: "Black",
		value: "0,0,0"
	},
]






export default class CCCard extends Component {

	static propTypes = {
		show: PropTypes.bool,
		onSave: PropTypes.func,
		onCancel: PropTypes.func
	}


	static defaultProps = {
		presets: presets,
		fontSizes: fontSizes,
		fonts: fonts,
		edgeEffects: edgeEffects,
		colorPalette: colorPalette
	}

	static contextTypes = {
		theme: PropTypes.object
	}

	constructor(props) {
		super(props);

		this.state = {
			selectedPreset: null,
			styleProps: Object.assign({}, presets[0]),
			selectedTab: 0
		}
	}

	getStyles(styleProps) {

		let textShadowTemplate = this.props.edgeEffects.find(item=>item.label === styleProps.edgeEffect).value;
		let borderColors = styleProps.borderColor.split(',');
		let borderColorsDarker = borderColors.map(color=> Math.max(color-127, 0)).join(',');
		let textShadow = textShadowTemplate.format(styleProps.borderColor, borderColorsDarker);
		return {
			fontFamily: styleProps.font,
			fontSize: styleProps.fontSize,
			backgroundColor: "rgba(" + styleProps.backgroundColor + "," + styleProps.backgroundOpacity + ")",
			color: "rgba(" + styleProps.textColor + "," + styleProps.textOpacity + ")",
			textShadow: textShadow
		}
	}

	getPreviewStyle() {
		return this.getStyles(this.state.styleProps);
	}

	selectColor = (propName, val) => {
		let styleProps = Object.assign({}, this.state.styleProps);
		styleProps[propName] = val;
		this.setState({
			styleProps: styleProps
		})
	}

	selectDropValue = (propName, val) => {
		let styleProps = Object.assign({}, this.state.styleProps);
		styleProps[propName] = val;
		this.setState({
			styleProps: styleProps
		})
	}

	onTextOpacityChange = (val) => {
		let styleProps = Object.assign({}, this.state.styleProps);
		styleProps["textOpacity"] = val;
		this.setState({
			styleProps: styleProps
		})
	}

	onBackgroundOpacityChange = (val) => {
		let styleProps = Object.assign({}, this.state.styleProps);
		styleProps["backgroundOpacity"] = val;
		this.setState({
			styleProps: styleProps
		})
	}

	selectPreset = (index) => {
		let styleProps = this.props.presets[index];
		this.setState({
			selectedPreset: index,
			styleProps: styleProps
		})
	}

	selectTab = (index) => {
		this.setState({
			selectedTab: index
		});
	}

	reset = () => {
		let styleProps = this.props.presets[0];
		this.setState({
			selectedPreset: 0,
			styleProps: styleProps
		})
	}

	render() {

		let { presets, fonts, fontSizes, edgeEffects, colorPalette, show } = this.props;
		let { selectedPreset, styleProps, selectedTab } = this.state;
		let previewStyle = this.getPreviewStyle();

		const content = show ? 
			(
				<div className="cc-card">
					<div className="cc-preview-wrapper">
						<div className="cc-preview" style={previewStyle}>
							Closed Caption Preview
						</div>
					</div>
					<div className="cc-window-wrapper">
						<div className="cc-options-close" onClick={this.props.onCancel}>
							<i className="iconcss icon-close"></i>
						</div>
						<ul className="options">
							<li className={selectedTab === 0 ? "cc-panel--active" : ""}>
								<div className="cc-tab" onClick={this.selectTab.bind(this, 0)}>Presets</div>
								<div className="options-details presets">
									{
										presets.map((preset, index) => {
											let classnames = classNames({
												'cc-preset': true,
												'cc-preset--selected': selectedPreset === index
											});
											let style = this.getStyles(preset);
											return (
												<div className={classnames} key={index} onClick={this.selectPreset.bind(this, index)} style={style}>
													Aa
												</div>
											);
										})
									}
								</div>
							</li>
							<li className={selectedTab === 1 ? "cc-panel--active" : ""}>
								<div className="cc-tab" onClick={this.selectTab.bind(this, 1)}>Text</div>
								<div className="options-details options-details--vertical">

									<div className="cc-options__field">
										<label>Text color</label>
										<Colorpicker palette={colorPalette} value={styleProps.textColor} onChange={this.selectColor.bind(this, "textColor")}  />
									</div>
									<div className="cc-options__field">
										<label>Text opacity</label>
										<div className="slider-wrapper">
											<Slider value={styleProps.textOpacity} min={0} max={1} step={0.2} onChange={this.onTextOpacityChange} />
											<div className="slider-count">{ styleProps.textOpacity * 100 + "%" } </div>
										</div>
									</div>

									<div className="cc-options__field">
										<label>Font</label>





										<Dropdown 
											items = { fonts.map((font, index) => { return { name : font, value : font }})} 
											defaultIndex = {0} 
											onChange={this.selectDropValue.bind(this, "font")}
										/>


									</div>
									<div className="cc-options__field">
										<label>Font size</label>
										<Dropdown 
											items = { fontSizes.map((fontSize, index) => { return { name : fontSize.label, value : fontSize.value }})} 
											defaultIndex = { 2 } 
											onChange={this.selectDropValue.bind(this, "fontSize")}
										/>
									</div>
								</div>
							</li>

							<li className={selectedTab === 2 ? "cc-panel--active" : ""}>
									<div className="cc-tab" onClick={this.selectTab.bind(this, 2)}>Border</div>
									<div className="options-details options-details--vertical">
									<div className="cc-options__field">
										<label>Border effect</label>
										<Dropdown 
											items = { edgeEffects.map((edgeEffect, index) => { return { name : edgeEffect.label, value : edgeEffect.label }})} 
											defaultIndex = { 2 } 
											onChange={this.selectDropValue.bind(this, "edgeEffect")}
										/>
									</div>
									<div className="cc-options__field">
										<label>Border color</label>
										<Colorpicker palette={colorPalette} value={styleProps.borderColor} onChange={this.selectColor.bind(this, "borderColor")}  />
									</div>
								</div>
							</li>


							<li className={selectedTab === 3 ? "cc-panel--active" : ""}>
								<div className="cc-tab" onClick={this.selectTab.bind(this, 3)}>Background</div>
								<div className="options-details options-details--vertical">
									<div className="cc-options__field">
										<label>Background color</label>
										<Colorpicker palette={colorPalette} value={styleProps.backgroundColor} onChange={this.selectColor.bind(this, "backgroundColor")}  />
									</div>
									<div className="cc-options__field">
										<label>Background opacity</label>
										<div className="slider-wrapper">
											<Slider value={styleProps.backgroundOpacity} min={0} max={1} step={0.2} onChange={this.onBackgroundOpacityChange}/>
											<div className="slider-count">{styleProps.backgroundOpacity * 100 + "%"} </div>
										</div>
									</div>
								</div>
							</li>
						</ul>
						<div className="cc-buttons">
		          <button className="cc-save button-primary" onClick={this.props.onSave}>Save</button>
							<button onClick={this.reset}>Reset</button>
						</div>
						<a style={{color: this.context.theme.colorHighlight}} className="fcc" href="http://www.usanetwork.com/closed-captioning" target="_blank">FCC</a>
					</div>
				</div>
			)
		:
			null;



		return (
			<ReactCSSTransitionGroup transitionName="cc-card" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
				{content}
			</ReactCSSTransitionGroup>

		)
	}
}


class Dropdown extends Component {

	constructor(props) {
		super(props);
		this.state = {
			defaultIndex : 0 || props.defaultIndex,
			open : false || props.open
		}
	}

	toggleOpen = () => {
		this.setState({
			open : !this.state.open
		})
	}

	onBlur = () => {
		this.setState({
			open : false
		})
	}

	selectState(selectedItem){
		this.props.onChange(this.props.items[selectedItem].value);
		this.setState({
			defaultIndex : selectedItem,
			open : false
		})
	}

	render() {

		let items = this.props.items;

		return (
			<div className={"dropdown" + (this.state.open ? " dropdown--active" : "")} tabIndex="-1" onClick={this.toggleOpen} onBlur={this.onBlur}>
				<div className="dropdown__value-holder">
					<div className="dropdown__value truncate">{ this.props.items[this.state.defaultIndex].name }</div>
					<div className="dropdown__pick"><i className="fa fa-caret-down"></i></div>
				</div>
				<ul className="dropdown__selector">
				{
					this.props.items.map((item,index)=> {
						return <li key={index} onClick={this.selectState.bind(this, item.name)} className={"dropdown__option" + ((this.state.defaultIndex == index) ? " dropdown__option--active" : "")} onClick={this.selectState.bind(this, index)} >{item.name}</li>
					})
				}
				</ul>
			</div>
		)
	}
}






class Colorpicker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			open: true
		}
	}

	static contextTypes = {
		theme: PropTypes.object
	}

	toggleOpen = ()=> {
		this.setState({
			open: !this.state.open
		})
	}

	selectColor(color) {
		this.props.onChange(color);
		/*
		this.setState({
			open: false
		})
		*/
	}

	render () {

		let { value } = this.props;

		let classnames= classNames({
			'color-picker': true,
			'color-picker--open': this.state.open
		})

		return (
			<div className={classnames}>
				<div className="color-picker__box" style={{backgroundColor: "rgb(" + value + ")"}} onClick={this.toggleOpen}>


				</div>
				<div className="color-picker__palette-wrapper">
					<div className="color-picker__palette">
						{
							this.props.palette.map( (color,index)=> {
								let lighterBorder =
									color.value.split(',')
									.map(color=> Math.min(color+100, 255)).join(',');

								let style = {
									backgroundColor: "rgb(" + color.value + ")"
								}
								return (
									<div key={index} className={"color-picker__color-holder" + ((value == color.value) ? " color-picker__color-holder--active" : "")}>
										<div style={{ borderColor: this.context.theme.colorHighlight }} className="color-picker__color" style={style} onClick={this.selectColor.bind(this,color.value)}></div>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	}
}

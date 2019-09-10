import React, { Component, PropTypes } from 'react';

export default class NextDialog extends Component {

	static propTypes = {
		item: PropTypes.object,
		goToNextPlaylistItem: PropTypes.func
	}


	constructor(props) {
		super(props);
	}

	render() {
		const { item } = this.props;
		return (
			<div className="next-dialog">
			  <div className="next-dialog__img" onClick={this.props.goToNextPlaylistItem}>
				  <i className="fa fa-play"></i>
				  <img src={item.coverImgSrc} />
			 </div>
			 <div className="next-dialog__text">
				 <h2>{item.title}</h2>
				 <h3>{item.subtitle}</h3>
				 <p>{item.description}</p>
			 </div>
			</div>
		)
	}
}
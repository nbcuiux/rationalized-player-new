import React from 'react'
import { render } from 'react-dom'


import App from '../components/App'
import Crisp from '../components/Crisp'

window.mountPlayer = function(options, el) {

	render(
		<App {...options} />,
	  document.getElementById('root')
	)

}


window.mountCrisp= function(options, el) {

	render(
		<Crisp />,
	  document.getElementById('root')
	)

}

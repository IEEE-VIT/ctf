import React, { Component } from 'react';
//import 'firebase';

// importing StyleSheets
import './newHomeScreen.css';
import '../HomeScreen/homeScreen.css';
import '../../Styles.css';

import {LandingGlobe} from '../../uiComponents/LandingGlobe/landingGlobe.js';
import SocialMediaIcons from '../../uiComponents/socialMediaIcons/socialMediaIcons.js';

//Importing assets
import ctfLogo from '../../assets/CTF.svg';

class NewHomeScreen extends Component {

	constructor(props) {
		super(props);
		this.state={
			page: 'map',
		};
	}

	render() {
		const {page} = this.state;
			return (
				<React.Fragment>
					<div className="newLandingScreen__main-container">
						<nav className="newHomePage__nav">
							<div className="newHomePage__nav__ctf"><img src={ctfLogo} alt=""/></div>
						</nav>
						<SocialMediaIcons />
					</div>
					<div className = 'landing__logo-play'>
						<div className = 'newHomeScreen__center_text'>We will be live soon!</div>
						<div className = 'newHomeScreen__center_text' style={{"paddingTop": "60px"}}>Stay tuned!</div>
						<LandingGlobe />
					</div>
				</React.Fragment>
			);
	}
}

export default NewHomeScreen;

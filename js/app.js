////////////////////////////////////////////////////////////////////////////////////////////////////
//App Outline

//This app is going to look REALLY COMPLICATED but at its core it is going to be straightforward
//to build
//Our focus is going to be on React/Redux, not any complicated backend process

//So What are We Going to Build? --> Clone of twitch.tv application:
	//used by people to livestream recordings on their desktops/laptops
		//popular for video gaming but there are other uses.

//We'll be building the core experience, which is video streaming

//So how does video streaming work?
	//Streamer's Computer is running OBS (Open Broadcast Software) 
		//-> Video Stream + Stream Key --> Real Time Messaging Protocol (RTMP) Server:
											//specialized server that will receive a video steam + key
												//--> Viewer's Browser
												//--> Viewer's Browser
												//--> Viewer's Browser
												//--> Viewer's Browser
												//--> Viewer's Browser
	//RTMP: Soul Purpose is to stream video

	//But we have some other info we want to share with our users:
		//Users want to know what's currently broadcating:
			//API will store list of streams/channels inside browser
			//Users can select a stream --> make req. to RTMP to view that stream

	//3 differnet moving pieces
		//React APP - runing in the users browser
		//RTMP - responsible for handling the video streams (very simple)
		//TINY API server - list out what channels users can watch (even more simple than )
////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
//Mockups (WireFrames) in Detail

//There are a lot of different pages users can visist
	//url user visits will determine what content will be shown on screen
	//--> depending on URL we'll show an entirely different set of components 
		//--> this is entirely new.

	//--> REACT NAVIGATION WILL BE KEY

//WireFrames:

	//INDEX PAGE: When user visit they'll be shown a list of available streams
	//SHOW PAGE: will show stream and details when user selects a stream from the INDEX page

	//Login/Logout - authentication system we'll use w/ google.login

//Different between Our App and Twitch:
	//Twitch --> user has one stream/channel they can stream to.
	//Our App --> Every user can create unlimited channels/streams that they can stream to.

//Accessibility: Login vs. Logout:
	//LoggedOut:
		//User can view a list of all streams
		//User can view video for a single stream
	//LoggedIn:
		//Can CREATE new stream
		//Can EDIT stream they have created
		//Can DELETE stream they have created
////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
//App Challenges
	//We're going to have a couple of sub project folders for the various parts of the application:
	//Project directory 'streams':
		//inside stream create react project 'client' npx create-react-app client

	//App Challenges
		//Need to be able to navigate around to separate pages in our app
		//Need to allow a user to login/logout (google OAuth)
		//Need to handle forms in Redux
		//Need to master CRUD operations in React/Redux
		//Errors will likely occur!  Need good error handling
////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
//Initial Setup
	//in 'client' clean out src folder:
	//We're now going to add some boilerplate, src/index.js, src/App.js to render App on screen:
	//Next, npm install --save react-router-dom in client directory

	//react-router -- core navigation library, we don't install this manually
	//react-router-dom -- navigation for dom-based apps (we want this!)
	//react-router-native -- navigation for react-native apps (mobile apps)
	//react-router-redux -- bindings between REDUX and REACT ROUTER (not necessary)
		//** own authors of documentation say not to keep track of navigation stuff in redux

	//Ok so let's import some properties from react-dom router library, and write some code!, App.js:
	import React from 'react';
	import { BrowserRouter, Route } from 'react-router-dom';

	const PageOne = () => {
		return <div>Page One</div>
	};

	const PageTwo = () => {
		return <div>Page Two</div>
	};

	const App = () => {
		return (
			<div>
				<BrowserRouter>
					<div>
						<Route path="/" exact component={PageOne}/>
						<Route path="/pagetwo" component={PageTwo}/>
					</div>
				</BrowserRouter>
			</div>;
		);
	};
	export default App;//it's easiest router when you just write the code
////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
//How React Router Works
	//So we noticed that based upon our url we saw different content:
		//localhost:3000/ --> Page One
		//localhost:3000/pagetwo --? Page Two [CLICKME!]
			//RR only cares about what's after the domain and port: '/'

	//REACT ROUTER FLOW:
		// history 						--> 	BrowserRouter: listens to 'history' for url changes
			//keeps track of address			^							^
			//bar in browser 					^							^

										//--> Route Path = '/'				Route Path = '/pagetwo'
											//--><PageOne/>						//--> <PageTwo/>
	//BEWARE: there are some 'gotchas' with the <Route path='/'/>
////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
//How Paths Get Matched
	//Let's take a look at this code:
	<Route path="/pagetwo" component={PageTwo}/>
		//path: '/pagetwo' takes you to <PageTwo/>

	//WARNING: different routes can be matched by the same url!
		<Route path="/" exact component={PageOne} />
		<Route path="/" exact component={PageOne} />
			//now when you visit '/' <PageOne/> is rendered twice
				//--> we can easily have multiple components that match the routes url 
				//and all show themselves
				//this is by design - by deeply nesting routes we can customize how our app looks
				//based upon the url
					//don't have to depend upon the parent-child rendering the pass the data through
					//components!

	//So now let's remove the exact kw:
		<Route path="/" component={PageOne} />
		<Route path="/pagetwo" component={PageTwo} />
			//now when we visit 'pagetwo' we're rendering both <PageOne/> and <PageTwo/>

	//So here's what's happening:
	//address 				Extracted 'path'
		//myapp:8000/ ==> 		/				path= '/'
		//myapp:8000/page 		/page 			path='/page'
		//myapp:8000/page/5		/page/5			path='/page/5'
			//===> extractedPath.contains(path);

	//We navigated to http://localhost:3000/pagetwo
		<Route path="/" component={PageOne} />
			//Does '/pagetwo' contain '/'?
				//actually yes - '/pagetwo' starts with '/'
		<Route path="/pagetwo" component={PageTwo} />
			//Does '/pagetwo' contain '/pagetwo' ?
				//yes also - therefore both of these components are rendered

	//To override this behavior, we can add the 'exact' prop
		// when we use exact , react interprets it as exact={true}
		<Route path="/" exact component={PageOne} />
		<Route path="/pagetwo" component={PageTwo} />
			//since there's no exact kw ^this^ will be rendered at '/' and '/pagetwo'
		<Route path="/pagetwo" exact component={PageTwo} />
			//changes logic to extractedPath === path
////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
//How NOT TO Navigate with React Router
	//WE DO NOT USE ANCHOR TAGS TO NAVIGATE LIKE IN HTML PAGES
		const PageOne = () => {
			return(
				 <div>Page One
				 	<a href="/pagetwo">Navigate to Page Two!</a>
				 </div>
			);
		};

		const PageTwo = () => {
			return(
				 <div>Page Two
				 	<a href="/">Navigate to Page One!</a>
				 </div>
			);
		};//***DON'T DO THIS!!! ^^^^

	//WHY? - THAT'S BAD NAVIGATION:
		//You add an <a/> tag to your app, w/ href="/pagetwo" and click it
		//Your browser makes a request to localhost:3000/pagetwo
		//Development server responds with index.html file
		//Browser receives index.html files, dumps old HTML file it was showing
			//==> INCLUDING ALL YOUR REACT/REDUX STATE DATA!
		//Index.html file lists our JS files in script tags - browser downloads and executes these scripts
		//Our App Starts Up
	//When you click on an <a/> tag, it'll make a request to an outsider server
		//and during that operation all memory gets entirely dumped
		//data you had is not 100% wiped and you entirely loose access to it.
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Navigating with React Router
	//The Link Tag: <Link/>, import it in App.js, and replace <a href="/> with <Link to="/>:
		import { BrowserRouter, Route, Link } from 'react-router-dom';
		const PageOne = () => {
			return(
				 <div>Page One
				 	<Link to="/pagetwo">Navigate to Page Two!</Link>
				 </div>
			);
		};
		const PageTwo = () => {
			return(
				 <div>Page Two
				 	<Link to="/">Navigate to Page One!</Link>
				 </div>
			);
		};//now we can navigate between the different pages w/o reloading the browser


	//When we want our User to Navigate to another Page...
		//User clicks a "link" tag
		//RR prevents the browser from navigating to the new page and fetching new index.html file!
		//URL still changes
		//'History' sees updated URL, takes URL and send it to BrowserRouter
		//BrowserRouter communicates the URL to Route components
		//Route components rerender to show new set of components

		//ALL WE'RE DOING IS SHOWING AND HIDING A DIFFERENT SET OF COMPONENTS BASED UPON THE URL
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Different Router Types
	//This lecture is optional b/c it will only be relevant when you're deploying your apps:

	//CORE OF DICSUSSION === <BrowserRouter/>
		//React router actually has 3 different routers:
			//the only different is the part of the url they'll look at when deciding what to show 
			//on screen.

	//BrowserRouter: uses everything after TLD, ==> localhost:3000/'pagetwo'
	/*(.com, .net), or port as the 'path'*/

	//HashRouter: uses everything after a 		==> localhost:3000/#'/pagetwo'
	/*# as the 'path*/

	//MemoryRouter: doesn't use URL to 			==> localhost:3000'/'
	/*track navigation*/

	//We're going to use each one now in our app so we can understand how they work and why we need
	//to use each router, and why it's relevant to deployment.

	//HashRouter src/App.js:
		<HashRouter>
			<div>
				<Route path="/" exact component={PageOne} />
				<Route path="/pagetwo" exact component={PageTwo} />
			</div>
		</HashRouter>//localhost:3000/ === localhost:3000/#/

	//MemoryRouter src/App.js:
		<MemoryRouter>
			<div>
				<Route path="/" exact component={PageOne} />
				<Route path="/pagetwo" exact component={PageTwo} />
			</div>
		</MemoryRouter>//localhost:3000/ doesn't change as we navigate around


	//So Why do we care?
		//the BrowserRouter is BY FAR the most complicated to deploy inside of any realistic setting
			//in many cases deployment will be easy and lots of services make it straightforward w/ it
				//but many other cases it'll be very challenging... why?

	//What happens in a traditional server - always returns some html vs. react app
		//TraditionalHTML generating Server:
			//Do I have a route for '/pageone' ?
				//Yes, I am supposed to generate some HTML and send it to the browser
			//Do I have a route for '/pagetne' ?
				//--> No 
					//--> responds with 404 to browser

//Now, what happens creat-react-app DEV SERVER?:

															//CREATE-REACT-APP DEV SERVER
	//localhost:3000/pagetwo --> looking for '/pagetwo' --> 	Do I have anything for /pagetwo?
																//->check dev resources
																//->check public dir
		/*^^I don't know that route so I'll give you index.html	<<	Nope, guess, I'll serve index.html*/

	//If React doesn't have any resources that reference this route it doesn't know what to do with it
		//If it doesn't know what to do w/ the route it serves up the public/index.html not a 404
			//This is important b/c all our routes are in teh client side of the application:
				//When we navigate to localhost:3000/pagetwo
				//React serves up index.html finds <script/> reference to bundle.js
					//bundle.js: conatins all our applicant's code
				//App Loads
				//React Router Loads
				//'History' object (created by BrowserRouter) inspects current URL
					//see's that we're at '/pagetwo' --> tells BrowserRouter
				//Browser Router --> tells React, 'hey we're at '/pagetwo' render yourself appropriately

	//IF BROWSER ROUTER RESPONDED WITH A 404 IT'S BE MUCH EASIER B/C WE DON'T HAVE ANY 404 ERRORS
		//it responds with the INDEX.HTML file 
	//You might see an error thrown by your server that's weird b/c you haven't configured it appropriately
	//to work with your browser router



	//HashRouter - supposed to set up backend server to not look at anything afte the '#'
		//we can make a request to ALWAYS localhost:3000/ to always return our index.html
			//server should not look at anything after the #
				//# is only for client side routes!
					//more flexible - doesn't not require special configuration w/ html server
		//good for deploying to github.pages - 
			//expects to make requests to some defined resource
				//can go to github.pages.io/clayton/#/5 an and ignore everything after the #
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Component Scaffolding
	//We have predefined names for components taht will be shown when user is trying to do something
		//Index Page - StreamList
		//Show Stream - StreamShow
		//Create Stream - StreamCreate
		//Edit Stream - StreamEdit
		//Delete Stream - StreamDelete

	//We want to create all of these, scaffold them out and hook them up to route calls

	//What paths will we use for the respective components?

	//Path 						====> 				Component

	//streams/					====>				StreamList
	//streams/new				====>				StreamCreate
	//streams/edit				====>				StreamEdit
	//streams/delete			====>				StreamDelete
	//streams/show				====>				StreamShow

	//All five of these componewnts are related to streams so we're going to put them in a new directory:
	//src/components/streams, and create a new file for each comp.
		//in streams create all thsee componenets w/ boilerplate:
////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
//Wiring up Routes
	//Now let's wire up the components we just creates to some <Route path='/'> tags for routing:
	<BrowserRouter>
		<div>
			<Route path="/" exact component={StreamList} />
			<Route path="/streams/new" exact component={StreamCreate} />
			<Route path="/streams/edit" exact component={StreamEdit} />
			<Route path="/streams/delete" exact component={StreamDelete} />
			<Route path="/streams/show" exact component={StreamShow} />
		</div>
	</BrowserRouter>//now we can do to the path url and see the different components
////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
//Always Visible Components
	//How do we Make Our Header ALWAYS VISIBLE?
		//WE'RE GOING TO ADD THE HEADER COMPONENT TO OUR APP COMPONENT 'OUTSIDE' THE <BrowserRouter/>

	//example, in App.js:
	<div>
		<h1>HEADER!</h1>
		<BrowserRouter>
			<div>
				<Route path="/" exact component={StreamList} />
			</div>
		</BrowserRouter>
	</div>//<h1/> is always visible regardless of navigation now
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Connecting the Header
	//Header should have the following:
		//Should have a link to the home page (SteamList)
		//Another link to StreamList
		//Login Button
			//we're going to use semantic ui heavy here, of course

	//Create new header component, src/components/Header.js:
		//Now wire it up to App.js and return above <BrowserRouter/>:
		//Add "ui container" className to App.js top level div:

	//In Header.js:import { Link } from 'react-router-dom';
	const Header = () => {
		return (
		<div className="ui secondary pointing menu">
			<Link to="/" className="item">
				Streamy
			</Link>
			<div className="right menu">
				<Link to="/" className="item">
					All Streams
				</Link>
			</div>
		</div>
		); 
	};
////////////////////////////////////////////////////////////////////////////////////////////////////
//Links Inside Routers
	//We're getting this error right now: 
		//--> Error: Invariant failed: You should not use <Link> outside a <Router>

	//Remember the rule where always visible components 'OUTSIDE' THE <BrowserRouter/>?
		//-->the exception to this is ANY REACT ROUTER RELATED ELEMENT

	//For now let's move the header inside <BrowserRouter/>, App.js:
		<BrowserRouter>
			<div>
				<Header />
			</div>
		</BrowserRouter>
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
//Coding Challenge 14 - 
	//practice showing another component via a route and then navigating between the two

	//1st Goal: write new route that will show <ScreenDetails/> route='/screens/details'
	//2nd Goal: add in two different <Link/>s on each </> so we can navigate between them:
//App.js
import React from 'react';
import { BrowserRouter, Route } from './react-router-dom';
import { Header } from './Header';
import { StreamList } from './StreamList';
import { StreamDetails } from './StreamDetails';

const App = () => {
    return (
        <div className="ui container">
            <BrowserRouter>
                <div>
                    <Header />
                    <Route path="/" exact component={StreamList} />
                    {/*solution 1*/}
                    <Route path="/streams/details" exact component={StreamDetails}/>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;
//StreamList.js:
import React from 'react';
import { Link } from './react-router-dom';

const StreamList = () => {
    return (
        <div className="stream-list">
            <h3>StreamList</h3>
        	{/*solution 2*/}
            <Link to="/streams/details">Go to StreamDetails</Link>
        </div>
    );
};
export { StreamList };
//StreamDetails.js:
import React from 'react';
import { Link } from './react-router-dom';

const StreamDetails = () => {
    return (
        <div className="stream-details">
            <h3>StreamDetails</h3>
        	{/*solution 3*/}
            <Link to="/">Go to StreamList</Link>
        </div>
    );
};
export { StreamDetails };
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Exercise Solution: ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
////////////////////////////////////////////////////////////////////////////////////////////////////
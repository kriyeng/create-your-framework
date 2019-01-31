# Create your own framewrok in less than 350 lines of code
This repo contains all the code used in the tutorial "Create your own framework in less than 300 lines of code". You can find the tutorial in [my blog](http://blog.ibanyez.info)

### Install
This application doesn't need any server. Just open index.html on each folder on your browser to run the app.

If you have any trouble opening the file directly, you can use any kind of server that allows to use static files. If you don't have any server, you can use [Mongoose](https://cesanta.com/binary.html). It's a standalone web server, you can download and execute on the folder you want to run, no configuration needed.

### Pixabay key
In order to execute the search on Pixabay you need to have a user on that platform, and [go to the API document page](https://pixabay.com/api/docs/) and go to the first API example. There is your API key for your user. Copy the file `/js/pixabay-config-sample.js` to `pixabay-config.js` and set you API key there.

## How the project is structured
The repo has two main folder:

* **no-framework:** Contains the original version before your framework. You can start with this code to follow the tutorial.
* **with-framework:** This folder will contain the final result at the end of this tutorial.

### The Code

* **/index.html** - Contains the whole interface.
* **/js/app.js** - Where all the global functionality resides. These functions are:
	* **Navigation menu** - Receive the clicks on it and change the tab.
    * **Search process** - On keyup `enter` on search input box, calls the API, receive the results and calls the render function.
    * **Render function** - Receives the results and add them to the interface.
* **/js/ajax.js** - A very basic ajax functionality for the purpose of the app.
* **/js/pixabay-api.js** - Contains the API request functionality. Receive the search query and retrieve the data from the Pixabay API. Returns the results.
* **/js/pixabay-config-sample.js** - You need to rename it to `/js/pixabay-config.js` and set your own Pixabay API key. You can find how to get your key in the readme file of this repo.

### The Interface

* **Menu** - We have a navigation menu. When clicking on a menu item, we'll change the tab f the main content area.
* **Tabs** - We have three tabs on the main content area.
	* **Home** - A dummy home page
  * **Photos** - To search photos
  * **Videos** - To search videos
* **Search Bar** - On both photos and video tabs we have a search bar with an input text to write the search terms and submit when `enter` is pressed.

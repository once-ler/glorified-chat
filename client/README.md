### Chat Client

The chat client is a React/Redux client built on top of ```React Native Web``` and ```styled components```.

Async actions are created and managed using ```redux-observable```.  

Where practical, ```Flow``` annotations are used for static type checking.  

Finally, ```Webpack``` is used as the bundler.

### Prerequisites
* [Node.js 10.13.0 or greated](https://nodejs.org/en/download/)
  Install the latest version of node with the following command.
  ```
  sudo npm install -g n
  sudo n stable
  ```
* [yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable) package manager

### Installation
*  Go to the client folder.
   ```
   /path/to/glorified-chat/client
   ```

*  Download all dependencies by using the command.
   ```
   yarn
   ```

*  Bundle for __quick and dirty__ release with the command.
   ```
   npm run build:quick
   ```

  As of this release, running the command ```npm run build``` will fail because linting and flow check have not been fully implemented.

### Development
Start in development mode ```without``` redux devtools
```
npm run start
```

Start in development mode ```with``` redux devtools
```
npm run start:devtools
```

### Proxying requests during development
In development, the ```webpack-web-server``` will bind to ```8000``` by default.
It is assumed the chat server have been compiled, started, and listening on port 9001.

As a result, all requests to the chat server are proxied using the following configuration:
```javascript
'/user/**': {
  target: 'http://localhost:9001',
  secure: false,
  changeOrigin: true
},
'/ws/**': {
  target: 'ws://localhost:9001',
  secure: false,
  changeOrigin: true
}
```

### Running tests
Tests mostly involve communication between Redux and the Chat component.
```
npm run test
```

### Production deployment
The client application is intended to be served by the chat server.

1.  Run the command ```npm run build:quick```.
2.  Create a subfolder called ```static``` inside the directory where the ```glorified-chat-server-0.2.5.jar``` is located.
    For example, ```mkdir -p /path/to/glorified-chat/static```.
3.  Copy all built files from the client ```/path/to/glorified-chat/client/dist``` folder and place them in the above directory.
4.  The url to the client application will be ```http://somedomain.org:9001/static/index.html```.
    It is important to include ```index.html``` in the url.

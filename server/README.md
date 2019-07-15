### Chat Server

The chat server uses Akka HTTP library and specifically, its support for WebSockets.

In order to create the broadcast functionality of the chat room, an Actor is created for each WebSocket client connection.
When a client is connected, the actor created is added to user list.  For the lifetime of the connection, the actor can receive messages.

When the actor is destructed, we know the connection has ended and the client has exited.

There are 2 pipes in action that handles the bi-directional operations of the WebSocket connection.

The ```Sink.actorRef``` receives incoming messages from the WebSocket client and an actor is expected to be created beforehand.  

The ```Source.actorRef``` creates an actor when the user connects and this actor can be used to communicate with the WebSocket client to send outgoing messages.

### Prerequisites

* [Java JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [sbt](https://www.scala-sbt.org/download.html) build tool

### Installation

1.  Go to the server folder.
    ```/path/to/glorified-chat/server```
<br>
2.  Build the server with the following command.  All dependencies will be downloaded.
    ```sbt "project http" assembly```
    
    The ```sbt-assembly``` plugin will place the ```jar``` file in ```/path/to/glorified-chat/server/http/target/scala-2.12/glorified-chat-server-0.2.5.jar```.
<br>
3.  Run the server with the command.
    ```java -jar glorified-chat-server-0.2.5.jar```
<br>    
    To set minimum or maximum heap allowed, add the options with the command.
    ```java -Xms1G -Xmx3G -jar glorified-chat-server-0.2.5.jar```
<br>    
    The default port is ```9001```.  To use a different port pass the environment variable ```SERVER_PORT``` to the command.
    ```SERVER_PORT=8080 java -jar glorified-chat-server-0.2.5.jar``` 
    
### Running tests
Run tests for the web server with the following.
```
sbt "; project http; testOnly *TestWebServerSpec"
```

Run tests for persistence with Redis (if set up, see below).
```
sbt "; project datasource; testOnly *TestRedisSpec"
```

### Persistence

By default, the latest messages for each user will be stored in [Redis](https://redis.io/download).
The server will try to connect to the default address ```127.0.0.1``` and port ```6379```.

Connections to Redis is managed by a different dispatcher pool than that of the web server.
As a result, even if Redis is not set up, there is no impact to the main web application.

For testing, a ```Docker``` image for Redis may be used.
```
docker pull redis
docker run --name redis -d redis:latest redis-server
```

### Querying Redis

To inspect the messages created by the server when using Docker, use the following command.
```
docker run -it --link redis:redis --rm redis redis-cli -h redis -p 6379
```

Use the following Redis commands to view the data.

* Latest 10 user activities by date descending order.
```
zrevrangeByScore chat:users:last:time +inf -inf  withscores limit 0 10
```

* Total number of users.
```
scard chat:users
```

* Show the names of all users.
```
smembers chat:users
```

* Get the latest message from user ```foobar```
```
hgetall chat:foobar:last:message
```

### Getting lastest user activities using curl

To get the last 20 user messages from the web server, use the following command.
```
curl http://localhost:9001/stats
```

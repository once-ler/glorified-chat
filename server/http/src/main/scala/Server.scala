package com.eztier.glorified_chat

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import akka.http.scaladsl.server.Directives._

import scala.util._
// import com.eztier.glorified_chat.web.Routes
import com.eztier.glorified_chat.web.{UserRoutes, ChatRoutes, StaticRoutes, StatsRoutes}

object Server extends App with StaticRoutes with UserRoutes with ChatRoutes with StatsRoutes {

  val userPort = scala.util.Properties.envOrElse("SERVER_PORT", "9001")

  implicit val system = ActorSystem("WebServer")
  implicit val mat = ActorMaterializer()
  implicit val ec = system.dispatcher
  implicit val log = system.log

  val allRoutes =
    httpUserQueryRoutes ~
      httpStaticRoutes ~
        httpPublicRoutes ~
          httpApiRoutes ~
            httpStatsRoutes ~
              wsChatRoutes

  Http().bindAndHandle(allRoutes, "0.0.0.0", userPort.toInt).onComplete {
    case Success(binding) =>
      println(s"Server listening on http://${binding.localAddress.getHostName}:${binding.localAddress.getPort}\n")

    case Failure(ex) =>
      println(s"Failed to start.  Shutting down actor system. Error is: ${ex.getCause}: ${ex.getMessage}")
      system.terminate()
  }

}
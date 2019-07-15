package com.eztier.glorified_chat.web

import akka.NotUsed
import akka.actor.{ActorRef, ActorSystem}
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.OverflowStrategy
import akka.stream.scaladsl.{Flow, Sink, Source}
import io.circe.syntax._
import io.circe.parser._
import io.circe.generic.auto._
import com.eztier.glorified_chat.types.User.{Join, ShoutOut, UnJoin}
import com.eztier.glorified_chat.types.{Room, UserActor}
import com.eztier.glorified_chat.types.Storage.RedisPersistenceShoutOut


trait ChatRoutes {
  val system: ActorSystem

  lazy val wsChatRoutes = routes

  private def wsMessageHandler(name: String): Flow[Message, Message, NotUsed] = {
    // Each WS connection will own an Actor.
    val userActor: ActorRef = system.actorOf(UserActor.props(name))

    // Communication between akka streams to actor.
    val sink: Sink[Message, NotUsed] =
      Flow[Message]
        .map {
          case TextMessage.Strict(json) =>
            decode[ShoutOut](json) match {
              case Left(_) => ShoutOut(name, Room.rightNow, json)
              case Right(a) => a
            }
        }
        .alsoTo(Sink.foreach(RedisPersistenceShoutOut.persistenceQueue.offer(_))) // Persistence performed here.
        .to(Sink.actorRef(userActor, UnJoin(name))) // connect to the UserActor

    // Communication between akka streams to actor.
    val source: Source[Message, NotUsed] =
      Source
        .actorRef(bufferSize = 100, overflowStrategy = OverflowStrategy.dropBuffer)
        .mapMaterializedValue { actorRef =>
          // the actorRef is the way to talk back to the WS user.
          // The UserActor needs to know about this to send messages to the WS user.
          userActor ! Join(name, actorRef)
          // Do not pass the actorRef anymmore.
          NotUsed
        }
        .map((a: ShoutOut) => TextMessage.Strict(a.asJson.noSpaces))

    Flow.fromSinkAndSource(sink, source)
  }

  val routes: Route = path("ws" / Remaining) { name: String =>
    handleWebSocketMessages(wsMessageHandler(name))
  }
}

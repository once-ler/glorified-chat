package com.eztier.glorified_chat.types

import java.time.format.DateTimeFormatter
import java.time.{ZoneId, ZonedDateTime}

import akka.actor.ActorRef
import akka.http.scaladsl.model.ws.Message
import com.eztier.glorified_chat.types.User.Event

// We will only support one room for this application.
object Room {
  var users: Map[String, ActorRef] = Map.empty[String, ActorRef]

  // def broadcast(message: Message) : Unit = users.values.foreach(_ ! message)

  def broadcast(e: Event) : Unit = users.values.foreach(_ ! e)

  def rightNow = ZonedDateTime.now(ZoneId.systemDefault())
    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

}

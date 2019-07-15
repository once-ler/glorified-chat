package com.eztier.glorified_chat.types

import akka.actor.ActorRef

object User {
  sealed trait Action
  // "actorRef" is required to communicate with the connected WS client.
  case class Join(name: String, actorRef: ActorRef) extends Action

  case class UnJoin(name: String) extends Action

  sealed trait Event
  case class ShoutOut(name: String, timestamp: String, message: String) extends Event

  sealed trait Query
  case class UserQuery(name: String, exist: Boolean) extends Query
}

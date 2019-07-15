package com.eztier.glorified_chat.types

import akka.actor.{Actor, ActorRef, Props}
import com.eztier.glorified_chat.types.User._
import com.eztier.glorified_chat.types.Room._
import io.circe.parser._
import io.circe.generic.auto._

class UserActor(name: String) extends Actor {

  // Each actor will own an ActorRef to communicate with the WS connection.
  var actorRef: Option[ActorRef] = None

  override def receive: Receive = {
    case a: Action =>
      a match {
        case Join(name, actorRef) =>
          users += name -> actorRef
          this.actorRef = Some(actorRef)
          broadcast(ShoutOut(name, Room.rightNow, "Just joined."))

        case UnJoin(name) =>
          users -= name
          broadcast(ShoutOut(name, Room.rightNow, "Just left."))
      }
    // Incoming messages.
    case string: String =>
      decode[ShoutOut](string) match {
        case Left(_) => Unit
        case Right(a) => broadcast(a)
      }
    // Outgoing messages.
    case e: Event =>
      e match {
        case a: ShoutOut => broadcast(a)
      }
    case _ => broadcast(ShoutOut(name, Room.rightNow, "Oops, I don't know what I got."))
  }

}

object UserActor {
  def props(name: String): Props = Props(new UserActor(name))
}

package com.eztier.glorified_chat.web

import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.Directives._
import io.circe.syntax._
import io.circe.generic.auto._
import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport._

import com.eztier.glorified_chat.types.Room
import com.eztier.glorified_chat.types.User.UserQuery

trait UserRoutes {

  lazy val httpUserQueryRoutes = userQueryRoutes

  val userQueryRoutes: Route = path("user" / Remaining) { name: String =>
    // Does this user already exist in the room?
    val s = Room.users.filter(a => a._1.toLowerCase() == name.toLowerCase()).headOption match {
      case Some(a) => UserQuery(name, true)
      case None => UserQuery(name, false)
    }

    complete(s.asJson)
  }
}

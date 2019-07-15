package com.eztier.datasource.common.implicits

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import akka.util.Timeout
import scala.concurrent.duration._

object ExecutionContext {
  implicit val system = ActorSystem("datasource-actor-system")
  implicit val ec = system.dispatcher
  implicit val materializer = ActorMaterializer()
  implicit val logger = system.log
  // May opt to use custom excution context.
  val blockingDispatcher = system.dispatchers.lookup("blocking-dispatcher")
}

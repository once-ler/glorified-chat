package com.eztier.glorified_chat.web

import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.model.ContentTypes._
import akka.stream.scaladsl.Source
import akka.util.ByteString
import com.redis.protocol.SortedSetCommands.{`+Inf`, `-Inf`}
import scala.concurrent.{Future}

trait StatsRoutes {
  import akka.util.Timeout
  import com.redis.RedisClient
  import com.eztier.datasource.redis.session.implicits.Transactors._
  import scala.concurrent.duration._

  implicit val timeout = Timeout(1 second)
  val client: RedisClient = implicitly[RedisClient]

  lazy val httpStatsRoutes = statsRoutes

  val statsRoutes: Route = path("stats") {
    import com.eztier.datasource.common.implicits.ExecutionContext.blockingDispatcher
    // Redis client will use the blockingDispatcher as ExecutionContext
    implicit val ec = blockingDispatcher

    import com.eztier.glorified_chat.types.Storage.RedisPersistenceShoutOut.usersLastTimeSetName

    val resp = Source.single(0)
      .mapAsync(1){
        // The library has a bug where the order of max and min is processed as min and max.
        // So we send -Inf and +Inf when it should be +Inf -Inf.
        dummy =>
          val f = client.zrevrangeByScore(usersLastTimeSetName, `-Inf`, true, `+Inf`, true, Some(0, 20))

          for {
            last20 <- f
          } yield last20
      }.mapAsync(1) {
        a =>
          val l = a.map(b =>
            client.hgetall(s"chat:${b}:last:message"))

          Future.sequence(l)
      }.map {
        a =>
          val b = a.filter(_.size > 0).map(b => s"${b("name")} ${b("timestamp")}\n${b("message")}").mkString("\n\n")
          if (b.size == 0) "No data yet\n" else b
      }.map{
        s => ByteString(s)
      }.recover{
        case _ => ByteString("No connection can be made to Redis.")
      }

    complete(HttpEntity(`text/plain(UTF-8)`, resp))
  }
}

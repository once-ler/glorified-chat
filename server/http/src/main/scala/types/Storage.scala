package com.eztier.glorified_chat.types

import java.time.LocalDateTime

import akka.stream.scaladsl.{Keep, Sink, Source, SourceQueueWithComplete}
import com.eztier.datasource.common.implicits.ExecutionContext._
import com.eztier.glorified_chat.types.User.ShoutOut

import scala.concurrent.Future


object Storage {

  val bufferSize = 100
  val overflowStrategy = akka.stream.OverflowStrategy.dropHead

  trait Persistence[A] {
    val persistenceQueue = Source.queue[A](bufferSize, overflowStrategy)
      .to(Sink foreach println)
      .run() // "keep" the queue Materialized value instead of the Sink's
  }

  trait RedisPersistence[A] extends Persistence[A] {
    import akka.util.Timeout
    import com.redis.RedisClient
    import com.eztier.datasource.redis.session.implicits.Transactors._
    import scala.concurrent.duration._

    implicit val timeout = Timeout(1 second)
    val client: RedisClient = implicitly[RedisClient]

    override val persistenceQueue = Source.queue[A](bufferSize, overflowStrategy)
      .to(Sink foreach println)
      .run()
  }

  object RedisPersistenceShoutOut extends RedisPersistence[ShoutOut] {
    val usersLastTimeSetName = "chat:users:last:time"
    val usersSetName = "chat:users"

    override val persistenceQueue = {
      Source.queue[ShoutOut](bufferSize, overflowStrategy)
        .to(Sink.foreach{
          a =>
            val f = Future.sequence(Seq(
              client.zadd(usersLastTimeSetName, System.currentTimeMillis, a.name),
              client.sadd(usersSetName, a.name),
              client.hmset(s"chat:${a.name}:last:message", Seq(("name", a.name), ("timestamp", a.timestamp), ("message", a.message)))
            ))

            f.recover{case _ => println}
        })
        .run()
    }

  }
}

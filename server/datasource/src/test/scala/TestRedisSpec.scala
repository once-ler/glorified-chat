package com.eztier.glorified_chat.datasource.test

import java.time.{LocalDateTime, ZoneId}

import akka.util.Timeout
import org.scalatest.{FunSpec, Matchers}
import com.redis.RedisClient
import com.redis.protocol.SortedSetCommands.{`+Inf`, `-Inf`}
import org.scalatest.concurrent.ScalaFutures
import com.eztier.datasource.redis.session.implicits.Transactors._

import scala.concurrent.{Await, Future}
import scala.concurrent.duration._

class TestRedisSpec extends FunSpec with ScalaFutures with Matchers {

  implicit class WrapLocalDateTime(dt: LocalDateTime) {
    val timeToEpochMilli = dt.atZone(ZoneId.of("America/New_York")).toInstant.getEpochSecond * 1000.0
  }

  describe("Redis Suite") {
    implicit val timeout = Timeout(5 seconds)
    val client: RedisClient = implicitly[RedisClient]
    val setname = "test:chat:users:last:time"
    val pointInTime = LocalDateTime.of(2015, 5, 13, 13, 25, 34)

    val snapShotTimes = (2 to 5).map(a => (a,  pointInTime.plusHours(a).timeToEpochMilli)).toMap


    it("Should echo back") {
      client.echo("Foo Bar")
        .futureValue should equal ("Foo Bar")
    }

    it("Should add records") {
      import com.eztier.datasource.common.implicits.ExecutionContext._
      implicit val timeout = Timeout(10 seconds)

      val f = Future.sequence(Seq(
        client.zadd(setname, snapShotTimes(5), "user:d"),
        client.zadd(setname, snapShotTimes(4), "user:c"),
        client.zadd(setname, snapShotTimes(3), "user:b"),
        client.zadd(setname, snapShotTimes(2), "user:a")
      ))

      whenReady(f) {
        // When adding the first time, sum will be 4.  Updates will result in sum of 0.
        // So size is used as expected result instead.
        a => a.size should be (4)
      }

    }

    // smembers chat:users
    // zrange chat:users:last:time 0 -1 withscores
    // zrangebyscore chat:users:last:time 1559922666000 +inf withscores (include start, use "(" to exclude)
    it("Should fetch records within > min and <= max") {

      client
        .zrangeByScoreWithScores(setname, snapShotTimes(3) - 1000, false, snapShotTimes(4), true, None)
        .futureValue should equal (List(
          ("user:b", snapShotTimes(3)),
          ("user:c", snapShotTimes(4))
        ))

      client
        .zrangeByScoreWithScores(setname, snapShotTimes(3), false, snapShotTimes(4), true, None)
        .futureValue should equal (List(
        ("user:c", snapShotTimes(4))
      ))

      client
        .zrevrangeByScoreWithScores(setname, `-Inf`, true, `+Inf`, true, Some(0, 20))
        .futureValue should equal (List(
        ("user:d", snapShotTimes(5)),
        ("user:c", snapShotTimes(4)),
        ("user:b", snapShotTimes(3)),
        ("user:a", snapShotTimes(2))
      ))
    }

  }
}
package com.eztier.datasource.redis.session.implicits

import com.redis.RedisClient

import com.eztier.common.Configuration.{conf, env}
import com.eztier.datasource.common.implicits.ExecutionContext._

object Transactors {
  val server = conf.getString(s"$env.redis.server")
  val port = conf.getInt(s"$env.redis.port")

  implicit lazy val xaRedisClient = RedisClient(server, port)
}
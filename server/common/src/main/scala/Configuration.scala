package com.eztier.common

import java.io.File

import com.typesafe.config.ConfigFactory

object Configuration {
  val env = if (System.getenv("SCALA_ENV") == null) "development" else System.getenv("SCALA_ENV")
  val workingDir = System.getProperty("user.dir")

  val conf = if (env == "production") {
    val prodConfigFile = new File(s"${workingDir}/config/application-production.conf")
    val prodConfig = ConfigFactory.parseFile(prodConfigFile)
    ConfigFactory.load(prodConfig)
  } else {
    ConfigFactory.load()
  }

}

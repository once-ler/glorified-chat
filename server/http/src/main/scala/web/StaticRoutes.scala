package com.eztier.glorified_chat.web

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route

trait StaticRoutes {
  lazy val httpStaticRoutes = staticRoutes
  lazy val httpPublicRoutes = publicRoutes
  lazy val httpApiRoutes = apiRoutes

  val workingDirectory = System.getProperty("user.dir")

  def resourcesDir(pathMatcher : String, dir : String) : Route =
    pathPrefix(pathMatcher) {
      pathEndOrSingleSlash {
        getFromFile(dir + "/index.html")
      } ~
        getFromDirectory(dir)
    }

  val staticRoutes = resourcesDir("static", workingDirectory + "/static")
  val publicRoutes = resourcesDir("public", workingDirectory + "/public")
  val apiRoutes = resourcesDir("api", workingDirectory + "/api")

}

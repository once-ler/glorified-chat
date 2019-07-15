import sbtassembly.AssemblyPlugin.defaultShellScript

name := "glorified-chat-server"
organization in ThisBuild := "com.eztier"
scalaVersion in ThisBuild := "2.12.4"

lazy val compilerOptions = Seq(
  "-unchecked",
  "-feature",
  "-language:existentials",
  "-language:higherKinds",
  "-language:implicitConversions",
  "-language:postfixOps",
  "-deprecation",
  "-encoding",
  "utf8",
  "-Ylog-classpath",
  "-Ypartial-unification"
)

lazy val global = project
  .in(file("."))
  .settings(settings)
  .aggregate(
    common,
    datasource
  )
  
lazy val commonSettings = Seq(
  version := "0.2.5",
  organization := "com.eztier",
  scalaVersion := "2.12.4",
  scalacOptions ++= compilerOptions,
  resolvers ++= Seq(
    Resolver.sonatypeRepo("public"),
    Resolver.sonatypeRepo("releases"),
    Resolver.sonatypeRepo("snapshots"),
    Resolver.bintrayRepo("hseeberger", "maven")
  )
)

lazy val settings = commonSettings

lazy val common = project
  .settings(
    name := "common",
    settings,
    libraryDependencies ++= Seq(
      scalaTest,
      logback,
      akkaStream,
      akkaSlf4j,
      akkaStreamTestkit
    )
  )

// Common
val logback = "ch.qos.logback" % "logback-classic" % "1.2.3"
val scalaTest = "org.scalatest" %% "scalatest" % "3.0.5" % Test
val jodaTime = "joda-time" % "joda-time" % "2.9.9"

// akka
val akka = "com.typesafe.akka"
val akkaHttpV = "10.1.5"

val akkaStream = akka %% "akka-stream" % "2.5.18"
val akkaSlf4j = akka %% "akka-slf4j" % "2.5.18"
val akkaStreamTestkit = akka %% "akka-stream-testkit" % "2.5.18" % Test

// akka cluster
val akkaCluster = "com.typesafe.akka" %% "akka-cluster" % "2.5.23"

// HTTP server
val akkaHttp = akka %% "akka-http" % akkaHttpV
val akkaHttpCore = akka %% "akka-http-core" % akkaHttpV
val akkaHttpSprayJson = akka %% "akka-http-spray-json" % akkaHttpV
val akkaHttpTestkit = akka %% "akka-http-testkit" % akkaHttpV % Test

// akka-http circe
val akkaHttpCirce = "de.heikoseeberger" %% "akka-http-circe" % "1.22.0"

// Support of CORS requests, version depends on akka-http
val akkaHttpCors = "ch.megard" %% "akka-http-cors" % "0.3.0"

// circe
val circeGenericExtras = "io.circe" %% "circe-generic-extras" % "0.10.0"
val circeJava8 = "io.circe" %% "circe-java8" % "0.11.1"
val circeParser = "io.circe" %% "circe-parser" % "0.11.1"

// redis
val redisReact = "net.debasishg" %% "redisreact" % "0.9"

lazy val datasource = project.
  settings(
    name := "datasource",
    settings,
    assemblySettings,
    libraryDependencies ++= Seq(
      circeGenericExtras,
      circeJava8,
      circeParser,
      redisReact,
      scalaTest
    )
  ).dependsOn(
    common
  )

lazy val http = project.
  settings(
    name := "glorified-chat-server",
    settings,
    assemblySettings,
    Seq(
      assemblyJarName in assembly := s"${name.value}-${version.value}.jar",
      javaOptions ++= Seq(
        // "-Dlogback.configurationFile=./logback.xml",
        "-Xms1G",
        "-Xmx3G"
      )
    ),
    libraryDependencies ++= Seq(
      akkaHttp,
      akkaHttpCore,
      akkaHttpCirce,
      akkaHttpSprayJson,
      akkaHttpCors,
      akkaHttpTestkit,
      scalaTest
    )
  ).dependsOn(
    common,
    datasource
  )

// Skip tests for assembly  
lazy val assemblySettings = Seq(
  assemblyJarName in assembly := s"${name.value}-${version.value}.jar",
  
  assemblyMergeStrategy in assembly := {
    case PathList("javax", "servlet", xs @ _*)         => MergeStrategy.first
    case PathList(ps @ _*) if ps.last endsWith ".html" => MergeStrategy.first
    case x if x.endsWith("io.netty.versions.properties") => MergeStrategy.first
    case "application.conf"                            => MergeStrategy.concat
    case "logback.xml"                            => MergeStrategy.first
    case x =>
      val oldStrategy = (assemblyMergeStrategy in assembly).value
      oldStrategy(x)
  },
  test in assembly := {}
)

package com.eztier.glorified_chat.http.test

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.testkit.{ScalatestRouteTest, WSProbe}
import com.eztier.glorified_chat.types.User.ShoutOut
import com.eztier.glorified_chat.web.ChatRoutes
import org.scalatest.{FunSpec, Matchers}

import io.circe.syntax._
import io.circe.parser._
import io.circe.generic.auto._

class TestWebServerSpec extends FunSpec with Matchers with Directives with ScalatestRouteTest with ChatRoutes {

  describe("WebSocket Suite") {

    it("can connect to a websocket route and get a welcome message") {

      val user = "henry"
      val wsClient = WSProbe()

      // * Make sure NOT to bring in implicit value of Execution Context.
      WS(s"/ws/$user", wsClient.flow) ~> wsChatRoutes ~>
        check {
          // check response for WS Upgrade headers
          isWebSocketUpgrade shouldEqual true

          val message = wsClient.expectMessage()

          val maybeShoutOut = decode[ShoutOut](message.asTextMessage.getStrictText)

          maybeShoutOut shouldBe 'right

          maybeShoutOut match {
            case Right(s) => s.name shouldEqual(user)
          }
        }
    }

    it("can connect to a websocket route and send a message") {

      val user = "sally"
      val wsClient = WSProbe()
      val testShoutOut = ShoutOut(user,"", "Hello world!")

      WS(s"/ws/$user", wsClient.flow) ~> wsChatRoutes ~>
        check {
          // check response for WS Upgrade headers
          isWebSocketUpgrade shouldEqual true

          // Ignore the welcome message.  This was tested previously.
          val message = wsClient.expectMessage()

          // manually run a WS conversation
          wsClient.sendMessage(testShoutOut.message)

          val message2 = wsClient.expectMessage()
          val maybeShoutOut2 = decode[ShoutOut](message2.asTextMessage.getStrictText).getOrElse(ShoutOut("", "", ""))

          maybeShoutOut2.message shouldEqual(testShoutOut.message)

          maybeShoutOut2.name shouldEqual(testShoutOut.name)
        }
    }

  }





}

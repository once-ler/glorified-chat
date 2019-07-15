package com.eztier.datasource.redis.session.models

import com.redis.serialization.{ Reader, StringReader, StringWriter, Writer }
import io.circe.{ Decoder, ObjectEncoder }
import io.circe.syntax._
import io.circe.parser.decode

trait CirceJsonSupport {
  // implicit val encoder: ObjectEncoder[AccessToken] = deriveEncoder(derivation.renaming.snakeCase)
  // implicit val decoder: Decoder[AccessToken] = deriveDecoder(derivation.renaming.snakeCase)

  implicit def circeJsonStringReader[A](implicit decoder: Decoder[A]): Reader[A] = {
    StringReader { a =>
      val r = decode[A](a)
      r match {
        case Right(a) => a
        case Left(x)  => throw (x)
      }
    }
  }

  implicit def circeJsonStringWriter[A](implicit encoder: ObjectEncoder[A]): Writer[A] = StringWriter(_.asJson.noSpaces)

}

object CirceJsonSupport extends CirceJsonSupport

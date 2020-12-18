CREATE DATABASE  IF NOT EXISTS `database_allinpets` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `database_allinpets`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: database_allinpets
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `denuncias`
--

DROP TABLE IF EXISTS `denuncias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denuncias` (
  `iddenuncias` int NOT NULL AUTO_INCREMENT,
  `idUsuariosf` int NOT NULL,
  `idUsuariost` int NOT NULL,
  `idPublicaciones` int NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descripcion` varchar(250) NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '1',
  `comprobacion` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`iddenuncias`),
  KEY `fk_usuarios_idusuariosf_idx` (`idUsuariosf`),
  KEY `fk_usuarios_idusuariost_idx` (`idUsuariost`),
  KEY `fk_publicaciones_idpublicaciones_idx` (`idPublicaciones`),
  CONSTRAINT `fk_publicaciones_idpublicaciones` FOREIGN KEY (`idPublicaciones`) REFERENCES `publicaciones` (`idPublicaciones`) ON DELETE CASCADE,
  CONSTRAINT `fk_usuarios_idusuariosf` FOREIGN KEY (`idUsuariosf`) REFERENCES `usuarios` (`idUsuarios`),
  CONSTRAINT `fk_usuarios_idusuariost` FOREIGN KEY (`idUsuariost`) REFERENCES `usuarios` (`idUsuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8 COMMENT='				';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-09 16:39:34

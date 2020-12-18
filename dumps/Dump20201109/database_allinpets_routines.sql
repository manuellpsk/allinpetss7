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
-- Temporary view structure for view `vista_publicaciones_home`
--

DROP TABLE IF EXISTS `vista_publicaciones_home`;
/*!50001 DROP VIEW IF EXISTS `vista_publicaciones_home`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_publicaciones_home` AS SELECT 
 1 AS `idPublicaciones`,
 1 AS `descripcion`,
 1 AS `fecha`,
 1 AS `imagen`,
 1 AS `idUsuarios`,
 1 AS `lastmfecha`,
 1 AS `nombre`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vista_publicaciones_home`
--

/*!50001 DROP VIEW IF EXISTS `vista_publicaciones_home`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_publicaciones_home` AS select `publicaciones`.`idPublicaciones` AS `idPublicaciones`,`publicaciones`.`descripcion` AS `descripcion`,`publicaciones`.`fecha` AS `fecha`,`publicaciones`.`imagen` AS `imagen`,`publicaciones`.`idUsuarios` AS `idUsuarios`,`publicaciones`.`lastmfecha` AS `lastmfecha`,`usuarios`.`nombre` AS `nombre` from (`publicaciones` join `usuarios` on((`publicaciones`.`idUsuarios` = `usuarios`.`idUsuarios`))) where ((`publicaciones`.`idUsuarios` <> `f1`()) and (`publicaciones`.`disponible` = 1)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Dumping routines for database 'database_allinpets'
--
/*!50003 DROP FUNCTION IF EXISTS `f1` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `f1`() RETURNS int
    NO SQL
    DETERMINISTIC
return @f1 ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `banear` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `banear`(in idDenuncia int)
BEGIN
	DECLARE idUser INT;
    DECLARE idPubli INT;
    DECLARE cant INT;
    DECLARE fec TIMESTAMP;
	SELECT idUsuariost,idPublicaciones INTO idUser,idPubli FROM denuncias where idDenuncias=idDenuncia;
    UPDATE denuncias SET estado=0, comprobacion=1 WHERE idDenuncias=idDenuncia;
    UPDATE usuarios SET activo=0 WHERE idUsuarios=iduser;
    UPDATE publicaciones SET disponible=0 WHERE idPublicaciones=idPubli;
    SELECT cantidad INTO cant FROM redList WHERE idUsuarios=idUser;
    IF cant IS NULL THEN 
      INSERT INTO redList VALUES(null,idUser,1);
   ELSEIF cant = 2 THEN
		SELECT unbanFecha INTO fec FROM bann WHERE idUsuarios=idUser;
        DELETE FROM redList WHERE idUsuarios=idUser;
        IF fec IS NULL THEN
			INSERT INTO bann VALUES(null, idUser,DATE_ADD(NOW(),INTERVAL 7 DAY));
		ELSE
			UPDATE bann SET unbanFecha=DATE_ADD(fec,INTERVAL 1 DAY);
		END IF;
   ELSE 
      UPDATE redList SET cantidad=cant+1 WHERE idUsuarios=idUser;
   END IF;
   SELECT 'Proceso banear finalizado con exito' as Mensajito;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-09 16:39:35

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
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (10,25690136,'Administrador','Universitario Inacap','man@gmail.com','$2a$10$0lAhAHSNXOuGaTR9//z9queVucRRR5GCjCODJeB77LMumpd6FU/6q','2020-07-04 06:34:09',1,2),(15,25254896,'Flor Flor',NULL,'flor@gmail.com','$2a$10$fiVE6.3xG1.91Ic2/gtCxeoGHflj40GzHDmqvAHi8YKBvOGlivdnq','2020-07-07 03:50:33',1,1),(17,19361445,'Luci','soy muy simpatica','lucia@gmail.com','$2a$10$YnM8RMMlGS9QKJJhDw0WouPy08Te5RG3nheVOvbkABhtW5fP55sbG','2020-07-11 06:08:56',1,1),(18,19401697,'Juan Perez',NULL,'juan@perez.com','$2a$10$Rhwrkn3.N9lbgGyF7mcpqOPRRIqFqUd.cH3S9gkvBvdCnazmvwscG','2020-07-12 07:23:52',1,1),(19,23475413,'Alejandra',NULL,'ale@jandra.com','$2a$10$bDuRIIdPs/X0u0.o7Ull5eDMYAyVENLNsgW25A3v0SRY4GtW/Nh4q','2020-07-12 07:24:22',0,1),(20,20054090,'patricio',NULL,'pato@gmail.com','$2a$10$y0kpdHkjOOfnwzeQT0Y5ZuIYsBz.wn2WF812NIfibPDJ5BZgA2qLG','2020-07-14 03:28:22',1,2),(52,9504603,'juan juan','Soy juan','juan@juanperez.com','$2a$10$hti2tsz.CIqcaeHerw0/vuZNv/vkYi9omBhERkPqJHaWj4FG2Axvi','2020-09-24 17:04:40',1,1),(60,6416343,'pepe',NULL,'pepe@g.com','$2a$10$LGcqA3wFTLoM2QM8d1UURe8uS76ShPbiEJ2OpEGcBmSyZEBrXnBnG','2020-10-17 06:52:59',1,1),(102,14950302,'Juan',NULL,'juan@juan.com','$2a$10$2idy1fq3hc72x.RlnuSAs.iz1ESMR3RuynqzUPizJNtE7TXzNNw2y','2020-12-10 21:49:45',1,1),(103,NULL,'Manuel Lopez','Descripcion','manuel_pk_10@hotmail.com','$2a$10$qPex3h1G1IQ9Lj0jVYcwq.oDnLOzGMRA8aQl.u0MQxRtOvr8Fb/06','2020-12-11 04:15:53',1,1),(105,22173575,'Fred','Hola soy Fred','fred@gmail.com','$2a$10$bw.sjzDc02sHO5KRcivcUO5yRV7vBx7Ua.KlZOj0s1l.NQQ7BqNFC','2020-12-14 16:08:01',1,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-18 16:36:01
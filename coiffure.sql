-- MySQL dump 10.13  Distrib 8.0.31, for macos12.6 (x86_64)
--
-- Host: localhost    Database: coiffure
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_entity`
--

DROP TABLE IF EXISTS `admin_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(225) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `sexe` varchar(20) NOT NULL DEFAULT 'Homme',
  `recovery` varchar(25) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` int NOT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_entity`
--

LOCK TABLES `admin_entity` WRITE;
/*!40000 ALTER TABLE `admin_entity` DISABLE KEYS */;
INSERT INTO `admin_entity` VALUES (1,'Ryota Kise','0748803377','Homme','JEFVna6O','$2b$08$0wVpDjUD1gLgBTx4S72gyO.h77D6.dR4ltUrxY55xjGbV1r0XsmLa',0,'2022-11-20 11:28:01.332741','2022-11-20 22:01:24.248000'),(2,'Coré Irié','0564250219','Homme','ycOA95N','$2b$08$GgvASlfDdO1K2ofjs7Z0ROp4XrITGsYk27Yk8DLmFfgGjHtbbrIdC',1,'2022-11-20 12:32:29.044954','2022-11-20 12:32:29.044954');
/*!40000 ALTER TABLE `admin_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factures_entity`
--

DROP TABLE IF EXISTS `factures_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factures_entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceId` int NOT NULL,
  `professionalId` int NOT NULL,
  `priceFinal` int NOT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_dd58712009eda72b0f3f62fe1f0` (`serviceId`),
  KEY `FK_0d6c835bdd35af365b3e3e85645` (`professionalId`),
  CONSTRAINT `FK_0d6c835bdd35af365b3e3e85645` FOREIGN KEY (`professionalId`) REFERENCES `professionals_entity` (`id`),
  CONSTRAINT `FK_dd58712009eda72b0f3f62fe1f0` FOREIGN KEY (`serviceId`) REFERENCES `service_entity` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factures_entity`
--

LOCK TABLES `factures_entity` WRITE;
/*!40000 ALTER TABLE `factures_entity` DISABLE KEYS */;
INSERT INTO `factures_entity` VALUES (1,1,1,500,'2022-11-20 13:28:50.252184','2022-11-20 13:28:50.252184');
/*!40000 ALTER TABLE `factures_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professionals_entity`
--

DROP TABLE IF EXISTS `professionals_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professionals_entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(225) NOT NULL,
  `contact` varchar(225) NOT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professionals_entity`
--

LOCK TABLES `professionals_entity` WRITE;
/*!40000 ALTER TABLE `professionals_entity` DISABLE KEYS */;
INSERT INTO `professionals_entity` VALUES (1,'Karim Benzema','0908070605','2022-11-20 13:06:42.997663','2022-11-20 13:06:42.997663');
/*!40000 ALTER TABLE `professionals_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_entity`
--

DROP TABLE IF EXISTS `service_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(225) NOT NULL,
  `price` int NOT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_entity`
--

LOCK TABLES `service_entity` WRITE;
/*!40000 ALTER TABLE `service_entity` DISABLE KEYS */;
INSERT INTO `service_entity` VALUES (1,'Pédicure',500,'2022-11-20 12:56:11.632929','2022-11-20 12:56:11.632929');
/*!40000 ALTER TABLE `service_entity` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-20 23:23:06

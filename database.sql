
CREATE SCHEMA IF NOT EXISTS `database_allinpets` DEFAULT CHARACTER SET utf8 ;
USE `database_allinpets` ;

-- -----------------------------------------------------
-- Table `mydb`.`Usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Usuarios` (
  `idUsuarios` INT NOT NULL AUTO_INCREMENT,
  `rut` INT NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(45) NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idUsuarios`),
  UNIQUE INDEX `rut_UNIQUE` (`rut` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Publicaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Publicaciones` (
  `idPublicaciones` INT NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `fecha` TIMESTAMP NOT NULL,
  `imagen` VARCHAR(45) NULL,
  `Usuarios_idUsuarios` INT NOT NULL,
  PRIMARY KEY (`idPublicaciones`),
  INDEX `fk_Publicaciones_Usuarios_idx` (`Usuarios_idUsuarios` ASC) VISIBLE,
  CONSTRAINT `fk_Publicaciones_Usuarios`
    FOREIGN KEY (`Usuarios_idUsuarios`)
    REFERENCES `database_allinpets`.`Usuarios` (`idUsuarios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


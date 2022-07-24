-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bolttech_challenge
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bolttech_challenge
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bolttech_challenge` DEFAULT CHARACTER SET utf8mb4 ;
USE `bolttech_challenge` ;

-- -----------------------------------------------------
-- Table `bolttech_challenge`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolttech_challenge`.`user` (
  `idUser` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `hash` VARCHAR(255) NOT NULL,
  `salt` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME NULL DEFAULT NULL,
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bolttech_challenge`.`project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolttech_challenge`.`project` (
  `idProject` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `user_idUser` INT(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME NULL DEFAULT NULL,
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idProject`),
  INDEX `fk_project_user_idx` (`user_idUser` ASC),
  CONSTRAINT `fk_project_user`
    FOREIGN KEY (`user_idUser`)
    REFERENCES `bolttech_challenge`.`user` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bolttech_challenge`.`task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolttech_challenge`.`task` (
  `idTask` INT(11) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `finish_date` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME NULL DEFAULT NULL,
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  `project_idProject` INT(11) NOT NULL,
  PRIMARY KEY (`idTask`),
  INDEX `fk_task_project1_idx` (`project_idProject` ASC),
  CONSTRAINT `fk_task_project1`
    FOREIGN KEY (`project_idProject`)
    REFERENCES `bolttech_challenge`.`project` (`idProject`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

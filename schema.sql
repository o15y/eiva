/*
 Navicat Premium Data Transfer

 Source Server         : A11Y New
 Source Server Type    : MariaDB
 Source Server Version : 100221
 Source Schema         : platform

 Target Server Type    : MariaDB
 Target Server Version : 100221
 File Encoding         : 65001

 Date: 07/03/2020 12:12:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER';

-- ----------------------------
-- Table structure for ara-access-tokens
-- ----------------------------
DROP TABLE IF EXISTS `ara-access-tokens`;
CREATE TABLE `ara-access-tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `description` text COLLATE utf8mb4_bin DEFAULT NULL,
  `jwtAccessToken` text COLLATE utf8mb4_bin NOT NULL,
  `scopes` text COLLATE utf8mb4_bin DEFAULT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-api-keys
-- ----------------------------
DROP TABLE IF EXISTS `ara-api-keys`;
CREATE TABLE `ara-api-keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `description` text COLLATE utf8mb4_bin DEFAULT NULL,
  `jwtApiKey` text COLLATE utf8mb4_bin NOT NULL,
  `organizationId` int(12) NOT NULL,
  `ipRestrictions` text COLLATE utf8mb4_bin DEFAULT NULL,
  `referrerRestrictions` text COLLATE utf8mb4_bin DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_bin DEFAULT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-approved-locations
-- ----------------------------
DROP TABLE IF EXISTS `ara-approved-locations`;
CREATE TABLE `ara-approved-locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `subnet` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-backup-codes
-- ----------------------------
DROP TABLE IF EXISTS `ara-backup-codes`;
CREATE TABLE `ara-backup-codes` (
  `code` int(6) NOT NULL,
  `userId` int(11) NOT NULL,
  `used` int(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`code`),
  KEY `id` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-domains
-- ----------------------------
DROP TABLE IF EXISTS `ara-domains`;
CREATE TABLE `ara-domains` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organizationId` int(11) NOT NULL,
  `domain` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `verificationCode` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `isVerified` int(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-email-aliases
-- ----------------------------
DROP TABLE IF EXISTS `ara-email-aliases`;
CREATE TABLE `ara-email-aliases` (
  `id` int(11) NOT NULL,
  `organizationId` int(11) NOT NULL,
  `alias` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-emails
-- ----------------------------
DROP TABLE IF EXISTS `ara-emails`;
CREATE TABLE `ara-emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `userId` int(11) NOT NULL,
  `isVerified` int(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-incoming-emails
-- ----------------------------
DROP TABLE IF EXISTS `ara-incoming-emails`;
CREATE TABLE `ara-incoming-emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `objectId` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `organizationId` int(11) NOT NULL,
  `elasticId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`,`objectId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-memberships
-- ----------------------------
DROP TABLE IF EXISTS `ara-memberships`;
CREATE TABLE `ara-memberships` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organizationId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `role` varchar(10) COLLATE utf8mb4_bin NOT NULL DEFAULT 'member',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `org` (`organizationId`),
  KEY `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-organizations
-- ----------------------------
DROP TABLE IF EXISTS `ara-organizations`;
CREATE TABLE `ara-organizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `stripeCustomerId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `ipRestrictions` text COLLATE utf8mb4_bin DEFAULT NULL,
  `forceTwoFactor` int(1) NOT NULL DEFAULT 0,
  `autoJoinDomain` int(1) NOT NULL DEFAULT 0,
  `onlyAllowDomain` int(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `profilePicture` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT 'https://unavatar.now.sh/fallback.png',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-sessions
-- ----------------------------
DROP TABLE IF EXISTS `ara-sessions`;
CREATE TABLE `ara-sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `jwtToken` text COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `ipAddress` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `userAgent` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-users
-- ----------------------------
DROP TABLE IF EXISTS `ara-users`;
CREATE TABLE `ara-users` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `nickname` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `primaryEmail` int(12) DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `twoFactorEnabled` int(1) NOT NULL DEFAULT 0,
  `twoFactorSecret` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `countryCode` varchar(2) COLLATE utf8mb4_bin DEFAULT 'us',
  `timezone` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT 'Europe/Amsterdam',
  `notificationEmails` int(1) NOT NULL DEFAULT 1,
  `preferredLanguage` varchar(5) COLLATE utf8mb4_bin NOT NULL DEFAULT 'en-us',
  `prefersReducedMotion` int(1) NOT NULL DEFAULT 0,
  `prefersColorSchemeDark` int(1) NOT NULL DEFAULT 0,
  `checkLocationOnLogin` int(1) NOT NULL DEFAULT 0,
  `role` int(1) NOT NULL DEFAULT 1,
  `gender` varchar(1) COLLATE utf8mb4_bin NOT NULL DEFAULT 'x',
  `profilePicture` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-webhooks
-- ----------------------------
DROP TABLE IF EXISTS `ara-webhooks`;
CREATE TABLE `ara-webhooks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organizationId` int(11) NOT NULL,
  `event` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `url` text COLLATE utf8mb4_bin NOT NULL,
  `contentType` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `secret` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `isActive` int(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `lastFiredAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for ara-identities
-- ----------------------------
DROP TABLE IF EXISTS `ara-identities`;
CREATE TABLE `ara-identities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `identityId` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `loginName` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

SET FOREIGN_KEY_CHECKS = 1;

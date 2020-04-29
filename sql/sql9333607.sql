-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: sql9.freemysqlhosting.net
-- Generation Time: Apr 29, 2020 at 09:25 AM
-- Server version: 5.5.62-0ubuntu0.14.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sql9333607`
--
CREATE DATABASE IF NOT EXISTS `sql9333607` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `sql9333607`;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('INIT','PENDING','SUCCESS','FAILED') NOT NULL DEFAULT 'INIT',
  `created_by` int(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `amount`, `status`, `created_by`, `created_on`) VALUES
(1, '1210.00', 'SUCCESS', 1, '2020-04-16 18:08:14'),
(2, '1210.00', 'FAILED', 1, '2020-04-16 18:08:20'),
(3, '1210.00', 'FAILED', 1, '2020-04-16 18:08:25'),
(4, '1210.00', 'FAILED', 1, '2020-04-16 18:08:27'),
(5, '1210.00', 'FAILED', 1, '2020-04-16 18:08:33'),
(6, '1210.00', 'FAILED', 1, '2020-04-16 18:08:36'),
(7, '1210.00', 'FAILED', 1, '2020-04-16 18:08:41'),
(8, '1210.00', 'FAILED', 1, '2020-04-16 18:08:43'),
(9, '1210.00', 'FAILED', 1, '2020-04-16 18:08:45'),
(10, '1210.00', 'FAILED', 1, '2020-04-16 18:08:47'),
(11, '100.00', 'FAILED', 1, '2020-04-17 08:25:54'),
(12, '70.00', 'SUCCESS', 1, '2020-04-17 08:27:23'),
(13, '-10000.00', 'SUCCESS', 1, '2020-04-17 10:22:31'),
(14, '-700.00', 'SUCCESS', 1, '2020-04-17 10:22:49'),
(15, '140.00', 'SUCCESS', 1, '2020-04-17 11:10:17'),
(16, '100.00', 'SUCCESS', 1, '2020-04-17 11:10:29'),
(17, '-100.00', 'SUCCESS', 1, '2020-04-17 11:11:02');

-- --------------------------------------------------------

--
-- Table structure for table `order_products`
--

DROP TABLE IF EXISTS `order_products`;
CREATE TABLE `order_products` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_products`
--

INSERT INTO `order_products` (`id`, `order_id`, `product_id`, `qty`, `amount`) VALUES
(1, 1, 1, 10, '1000.00'),
(2, 1, 2, 3, '210.00'),
(3, 2, 1, 10, '1000.00'),
(4, 2, 2, 3, '210.00'),
(5, 3, 1, 10, '1000.00'),
(6, 3, 2, 3, '210.00'),
(7, 4, 1, 10, '1000.00'),
(8, 4, 2, 3, '210.00'),
(9, 5, 1, 10, '1000.00'),
(10, 5, 2, 3, '210.00'),
(11, 6, 1, 10, '1000.00'),
(12, 6, 2, 3, '210.00'),
(13, 7, 1, 10, '1000.00'),
(14, 7, 2, 3, '210.00'),
(15, 8, 1, 10, '1000.00'),
(16, 8, 2, 3, '210.00'),
(17, 9, 1, 10, '1000.00'),
(18, 9, 2, 3, '210.00'),
(19, 10, 1, 10, '1000.00'),
(20, 10, 2, 3, '210.00'),
(21, 11, 1, 1, '100.00'),
(22, 12, 2, 1, '70.00'),
(23, 13, 1, -100, '-10000.00'),
(24, 14, 2, -10, '-700.00'),
(25, 15, 2, 2, '140.00'),
(26, 16, 1, 1, '100.00'),
(27, 17, 1, -1, '-100.00');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `qty` int(11) NOT NULL DEFAULT '0',
  `amount` decimal(10,2) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `qty`, `amount`, `created_on`) VALUES
(1, 'Rice', 100, '100.00', '2020-04-16 17:29:28'),
(2, 'Wheat', 10, '70.00', '2020-04-16 17:29:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Yatish B', 'yatish@gmail.com', '7e3bae2c25e3b16a8e277b69177fdd94'),
(2, 'Anish L', 'anish@gmail.com', 'de5dfc732be278340190dbfca0311562');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_products`
--
ALTER TABLE `order_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `order_products`
--
ALTER TABLE `order_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

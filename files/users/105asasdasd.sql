-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: mysql18.mydevil.net
-- Czas generowania: 17 Wrz 2017, 17:06
-- Wersja serwera: 5.7.16-10-log
-- Wersja PHP: 5.6.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `m1006_cmc_lukam2010`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `content` text NOT NULL,
  `date_add` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `events`
--

CREATE TABLE `events` (
  `id_team` int(11) NOT NULL,
  `title` text NOT NULL,
  `start` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end` datetime NOT NULL,
  `url` varchar(255) NOT NULL DEFAULT '',
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `freq`
--

CREATE TABLE `freq` (
  `id` int(11) NOT NULL,
  `usid` int(11) NOT NULL,
  `tmid` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `freq`
--

INSERT INTO `freq` (`id`, `usid`, `tmid`, `date`) VALUES
(0, 5, 1, '2017-09-06'),
(0, 6, 1, '2017-09-06');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` text COLLATE utf8_polish_ci NOT NULL,
  `url` varchar(255) COLLATE utf8_polish_ci DEFAULT NULL,
  `date_add` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `url`, `date_add`) VALUES
(1, 'Przypisano Cię do nowej drużyny: Pierwsza drużyna', '', '2017-09-06 21:45:00'),
(2, 'Przypisano Cię do nowej drużyny: Pierwsza drużyna', '', '2017-09-06 21:45:04'),
(3, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg na 100m', '#!/myStats', '2017-09-06 21:49:08'),
(4, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg na 100m', '#!/myStats', '2017-09-06 21:49:11'),
(5, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg na 100m', '#!/myStats', '2017-09-06 21:49:15'),
(6, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg na 100m', '#!/myStats', '2017-09-06 21:49:19'),
(7, 'Dodano wydarzenie: \'Mecz sparingowy\'', '#!/calendar', '2017-09-06 21:51:05'),
(8, 'Dodano wydarzenie: \'Spotkanie z rodzicami\'', '#!/calendar', '2017-09-06 21:51:39'),
(9, 'Dodano wydarzenie: \'Testy\'', '#!/calendar', '2017-09-06 21:51:53'),
(10, 'Dodano wydarzenie: \'Obóz\'', '#!/calendar', '2017-09-06 21:52:13'),
(11, 'Ireneusz Kościelniak dodał post', '#!/tab', '2017-09-07 13:36:12'),
(12, 'Twój numer na boisku został zmieniony na: 1', '#!/teamComposition', '2017-09-07 13:36:30'),
(13, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-09-07 13:36:32'),
(14, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-09-07 13:37:39'),
(15, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-09-07 13:37:41'),
(16, 'Przypisano Cię do nowej drużyny: Młodzik', '', '2017-09-16 15:43:12'),
(17, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:24:00'),
(18, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:24:11'),
(19, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:25:01'),
(20, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:38:05'),
(21, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:38:14'),
(22, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:38:25'),
(23, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:39:37'),
(24, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:39:53'),
(25, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:41:23'),
(26, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:41:39'),
(27, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:42:02'),
(28, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:42:19'),
(29, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:42:27'),
(30, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:42:34'),
(31, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:42:48'),
(32, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:45:21'),
(33, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:45:28'),
(34, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:45:37'),
(35, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:46:16'),
(36, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:46:27'),
(37, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:46:38'),
(38, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - wynik', '#!/myStats', '2017-09-16 16:46:46'),
(39, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:49:06'),
(40, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:49:23'),
(41, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:49:35'),
(42, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:50:01'),
(43, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:52:13'),
(44, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:52:21'),
(45, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:52:28'),
(46, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:52:35'),
(47, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:52:44'),
(48, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:53:50'),
(49, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:54:00'),
(50, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:54:16'),
(51, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:54:28'),
(52, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:54:41'),
(53, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:54:53'),
(54, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:55:01'),
(55, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:55:22'),
(56, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:55:29'),
(57, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 16:55:36'),
(58, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:56:18'),
(59, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:56:24'),
(60, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:56:45'),
(61, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:56:55'),
(62, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:57:01'),
(63, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:57:13'),
(64, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:57:22'),
(65, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:57:30'),
(66, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:57:38'),
(67, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:58:10'),
(68, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:58:18'),
(69, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:58:27'),
(70, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:59:10'),
(71, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:59:19'),
(72, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:59:25'),
(73, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:59:34'),
(74, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 16:59:39'),
(75, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 17:00:22'),
(76, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 17:00:45'),
(77, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - ocena', '#!/myStats', '2017-09-16 17:00:56'),
(78, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test - VO2max', '#!/myStats', '2017-09-16 17:01:07'),
(79, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:14:20'),
(80, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:14:41'),
(81, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:15:00'),
(82, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:15:08'),
(83, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:15:15'),
(84, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:15:22'),
(85, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:15:32'),
(86, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:15:39'),
(87, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:15:47'),
(88, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:15:55'),
(89, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:16:01'),
(90, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:16:10'),
(91, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:16:17'),
(92, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:16:24'),
(93, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:16:32'),
(94, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:16:48'),
(95, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:16:57'),
(96, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:17:04'),
(97, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Nawroty z piłką', '#!/myStats', '2017-09-16 17:17:11'),
(98, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:29:04'),
(99, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:29:09'),
(100, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:30:17'),
(101, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:30:23'),
(102, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:31:43'),
(103, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:31:52'),
(104, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:32:04'),
(105, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:32:08'),
(106, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:34:11'),
(107, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:34:18'),
(108, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:34:42'),
(109, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:34:47'),
(110, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:34:57'),
(111, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:35:06'),
(112, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:35:32'),
(113, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:36:07'),
(114, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:36:19'),
(115, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:36:25'),
(116, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:36:51'),
(117, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:36:57'),
(118, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:37:04'),
(119, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:37:12'),
(120, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:37:32'),
(121, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:37:38'),
(122, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:37:45'),
(123, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:37:51'),
(124, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:37:59'),
(125, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:38:04'),
(126, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:38:11'),
(127, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:38:14'),
(128, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:38:26'),
(129, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:38:32'),
(130, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:38:39'),
(131, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:38:49'),
(132, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:39:15'),
(133, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:39:21'),
(134, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:39:32'),
(135, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Prowadzenie piłki', '#!/myStats', '2017-09-16 17:39:36'),
(136, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:49:45'),
(137, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:49:49'),
(138, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 17:50:00'),
(139, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 17:50:03'),
(140, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 17:50:10'),
(141, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 17:50:14'),
(142, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:51:18'),
(143, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 17:51:24'),
(144, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 17:51:30'),
(145, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 17:51:43'),
(146, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 17:52:59'),
(147, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 17:53:07'),
(148, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 17:53:15'),
(149, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:53:31'),
(150, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:54:31'),
(151, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 17:54:37'),
(152, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 17:54:54'),
(153, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 17:55:02'),
(154, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 17:55:43'),
(155, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 17:56:23'),
(156, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 17:56:29'),
(157, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:56:35'),
(158, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:56:59'),
(159, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:57:07'),
(160, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 17:57:35'),
(161, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 17:57:42'),
(162, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 17:57:48'),
(163, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 17:58:29'),
(164, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 17:58:38'),
(165, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 17:58:47'),
(166, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:59:05'),
(167, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 17:59:45'),
(168, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:00:06'),
(169, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:00:14'),
(170, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:02:00'),
(171, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:02:16'),
(172, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:02:22'),
(173, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:02:42'),
(174, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:02:48'),
(175, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:03:07'),
(176, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:03:35'),
(177, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:04:29'),
(178, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:05:01'),
(179, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:05:09'),
(180, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:05:16'),
(181, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:05:24'),
(182, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:05:44'),
(183, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:05:49'),
(184, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:05:55'),
(185, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:06:02'),
(186, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:06:15'),
(187, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:06:57'),
(188, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:07:08'),
(189, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:07:14'),
(190, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:07:25'),
(191, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:08:23'),
(192, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:08:36'),
(193, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:08:42'),
(194, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:09:03'),
(195, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:09:08'),
(196, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:09:55'),
(197, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:10:02'),
(198, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:10:54'),
(199, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:11:01'),
(200, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:11:08'),
(201, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:11:16'),
(202, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:12:33'),
(203, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:12:38'),
(204, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:12:44'),
(205, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:12:49'),
(206, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:13:05'),
(207, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:13:12'),
(208, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:13:18'),
(209, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:13:25'),
(210, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:13:37'),
(211, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:13:44'),
(212, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:13:49'),
(213, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:13:55'),
(214, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:14:05'),
(215, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:14:10'),
(216, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:14:16'),
(217, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:14:24'),
(218, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-5m', '#!/myStats', '2017-09-16 18:14:39'),
(219, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 5-10m', '#!/myStats', '2017-09-16 18:14:43'),
(220, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 10-20m', '#!/myStats', '2017-09-16 18:14:49'),
(221, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- 0-20m', '#!/myStats', '2017-09-16 18:14:54'),
(222, 'Ireneusz Kościelniak dodał post', '#!/tab', '2017-09-16 18:47:34'),
(223, 'Ireneusz Kościelniak dodał post', '#!/tab', '2017-09-16 18:51:21'),
(224, 'Ireneusz Kościelniak dodał post', '#!/tab', '2017-09-16 18:51:50'),
(225, 'Ireneusz Kościelniak dodał post', '#!/tab', '2017-09-16 18:52:07'),
(226, 'Ireneusz Kościelniak dodał post', '#!/tab', '2017-09-16 18:52:14'),
(227, 'Dodano nowy personel: Pierwszy Trener', '#!/staff', '2017-09-16 18:53:44'),
(228, 'Twój numer na boisku został zmieniony na: 3', '#!/teamComposition', '2017-09-16 18:56:27'),
(229, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-09-16 18:56:29'),
(230, 'Twój numer na boisku został zmieniony na: 2', '#!/teamComposition', '2017-09-16 18:56:41'),
(231, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-09-16 18:56:43'),
(232, 'Dodano wydarzenie: \'TR.NR.1 WUWER\'', '#!/calendar', '2017-09-16 22:12:18'),
(233, 'Dodano wydarzenie: \'TR.NR.1 WUWER\'', '#!/calendar', '2017-09-16 22:13:41'),
(234, 'Dodano wydarzenie: \'TR.NR.1 ISKRZYCKA\'', '#!/calendar', '2017-09-16 22:14:44'),
(235, 'Dodano wydarzenie: \'TR.NR.1 TORA\'', '#!/calendar', '2017-09-16 22:16:01'),
(236, 'Dodano wydarzenie: \'NABÓR 2017\'', '#!/calendar', '2017-09-16 22:16:54'),
(237, 'Dodano wydarzenie: \'SPOTKANIE Z BURMISTRZEM\'', '#!/calendar', '2017-09-16 22:18:02'),
(238, 'Dodano wydarzenie: \'TR.INDYWIDUALNY 48/49\'', '#!/calendar', '2017-09-16 22:18:51'),
(239, 'Krzysztof Przydacz dodał post', '#!/tab', '2017-09-17 11:25:04');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `positions`
--

CREATE TABLE `positions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `positions`
--

INSERT INTO `positions` (`id`, `name`) VALUES
(0, 'Lawka'),
(1, 'Bramka'),
(2, 'Obrona'),
(3, 'Pomoc'),
(4, 'Atak');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_team` int(11) NOT NULL,
  `content` text NOT NULL,
  `date_add` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `posts`
--

INSERT INTO `posts` (`id`, `id_user`, `id_team`, `content`, `date_add`) VALUES
(2, 1, 4, 'Witamy w Centrum Zarządzania Klubem Lukam2010.\nW dniu dzisiejszym wprowadziliśmy wyniki testów wytrzymałościowych i szybkościowych grupy Młodzików. Omówienie wyników odbędzie się na najbliższym treningu.\nW oparciu o dobrane wytyczne sporządziliśmy dla Państwa odpowiednie wykresy, które z biegiem czasu i ponownymi testami pokażą progres zawodnika.', '2017-09-16 18:47:34'),
(3, 1, 4, 'Możliwe czynności - Strona główna\n\na) Kalendarz - trenerzy będą umieszczać nadchodzące treningi i wydarzenia\n\nb) Aktywność - tutaj wyświetlane będą najnowsze posty\n\nc) Zadania - zawodnik może utworzyć sobie listę rzeczy do zrobienia', '2017-09-16 18:51:20'),
(4, 1, 4, 'Możliwe czynności - Mój profil\n\na) Statystyki - znajdują się tutaj wyniki testów osiągniętych przez danego zawodnika\n\nb) Moje dane - tutaj znajdują się dane o zawodniku (bardzo prosimy o skrupulatne wypełnienie wszystkich danych)\n\nc) Raporty - w tym miejscu trenerzy będą udostępniać raporty o stanie zdrowia itp. (na tą chwilę zakładka jest pusta)', '2017-09-16 18:51:50'),
(5, 1, 4, 'Możliwe czynności -  Szatnia\n\na) Tablica - tutaj drużyna może ze sobą rozmawiać, trener może informować zawodników o ważnych sprawach, zawodnicy mogą komunikować się między sobą itd. - możecie się tutaj czuć jak w prawdziwej szatni klubowej\n\nb) Skład meczowy - jest to lista zawodników należących do drużyny, wraz z podziałem na przypuszczalny skład meczowy\n\nc) Sztab - w tym miejscu znajdują się dane kontaktowe do całego personelu związanego z daną drużyną', '2017-09-16 18:52:07'),
(6, 1, 4, 'W razie pytań prosimy o kontakt z trenerem prowadzącym.\nNareszcie mamy pełny monitoring i rzetelną kontrolę nad rozwojem naszych zawodników, które pomogą nam w osiągnięciu zamierzonych celów.\nWiem, że potrzebny jest czas na zaaklimatyzowanie się z nowościami, ale liczymy, że podejdą do tego Państwo cierpliwie i rzetelnie.\nŻyczymy Państwu miłego czasu spędzonego w naszym centrum.\n\nWSPÓLNIE DBAMY O ROZWÓJ NASZYCH ZAWODNIKÓW\n\n~serdecznie pozdrawiam, Koordynator Ireneusz Kościelniak', '2017-09-16 18:52:14'),
(7, 25, 4, 'Witam\nU Krzysia profil działa. Bardzo dobra incjatywa.\nPozwoli zaoszczedzić wszytkim czasu  ( głównie Państwu ) oraz będzie znana historia \"na kliknięcie\" każdego zawodnika.\nPozdrawiam\nMarcin Przywara\n', '2017-09-17 11:25:04');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `potential`
--

CREATE TABLE `potential` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `potential`
--

INSERT INTO `potential` (`id`, `name`) VALUES
(6, 'Wytrzymałość'),
(7, 'Szybkość');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `potential_score`
--

CREATE TABLE `potential_score` (
  `id` int(11) NOT NULL,
  `id_test` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_team` int(11) NOT NULL,
  `wynik` float NOT NULL,
  `data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `potential_score`
--

INSERT INTO `potential_score` (`id`, `id_test`, `id_user`, `id_team`, `wynik`, `data`) VALUES
(8, 2, 12, 4, 8.1, '2017-09-16 16:38:04'),
(9, 2, 9, 4, 8.06, '2017-09-16 16:38:13'),
(10, 2, 10, 4, 8.01, '2017-09-16 16:38:25'),
(11, 2, 13, 4, 7.02, '2017-09-16 16:39:37'),
(12, 2, 14, 4, 7.03, '2017-09-16 16:39:53'),
(13, 2, 15, 4, 8.05, '2017-09-16 16:41:23'),
(14, 2, 16, 4, 8.11, '2017-09-16 16:41:39'),
(15, 2, 18, 4, 9.1, '2017-09-16 16:42:02'),
(16, 2, 19, 4, 5.06, '2017-09-16 16:42:19'),
(17, 2, 20, 4, 8.04, '2017-09-16 16:42:27'),
(18, 2, 21, 4, 10.03, '2017-09-16 16:42:34'),
(19, 2, 22, 4, 9.05, '2017-09-16 16:42:47'),
(20, 2, 23, 4, 7.1, '2017-09-16 16:45:21'),
(21, 2, 24, 4, 9.05, '2017-09-16 16:45:28'),
(22, 2, 25, 4, 8.07, '2017-09-16 16:45:37'),
(23, 2, 28, 4, 8.1, '2017-09-16 16:46:16'),
(24, 2, 29, 4, 8.03, '2017-09-16 16:46:27'),
(25, 2, 30, 4, 9.05, '2017-09-16 16:46:38'),
(26, 2, 31, 4, 8.08, '2017-09-16 16:46:46'),
(28, 3, 9, 4, 41.8, '2017-09-16 16:49:23'),
(29, 3, 10, 4, 40.2, '2017-09-16 16:49:35'),
(30, 3, 12, 4, 43, '2017-09-16 16:50:01'),
(31, 3, 13, 4, 37.1, '2017-09-16 16:52:13'),
(32, 3, 14, 4, 37.5, '2017-09-16 16:52:21'),
(33, 3, 15, 4, 41.5, '2017-09-16 16:52:28'),
(34, 3, 16, 4, 43.3, '2017-09-16 16:52:35'),
(35, 3, 18, 4, 46.5, '2017-09-16 16:52:44'),
(36, 3, 19, 4, 31.8, '2017-09-16 16:53:50'),
(37, 3, 20, 4, 41.1, '2017-09-16 16:54:00'),
(38, 3, 21, 4, 47.7, '2017-09-16 16:54:15'),
(39, 3, 22, 4, 44.9, '2017-09-16 16:54:28'),
(40, 3, 23, 4, 39.9, '2017-09-16 16:54:41'),
(41, 3, 24, 4, 44.9, '2017-09-16 16:54:53'),
(42, 3, 25, 4, 42.1, '2017-09-16 16:55:01'),
(43, 3, 29, 4, 40.8, '2017-09-16 16:55:22'),
(44, 3, 30, 4, 44.9, '2017-09-16 16:55:29'),
(45, 3, 31, 4, 42.4, '2017-09-16 16:55:36'),
(48, 4, 12, 4, 5, '2017-09-16 16:56:45'),
(49, 4, 9, 4, 4, '2017-09-16 16:56:55'),
(50, 4, 10, 4, 4, '2017-09-16 16:57:01'),
(51, 4, 13, 4, 3, '2017-09-16 16:57:12'),
(52, 4, 14, 4, 3, '2017-09-16 16:57:22'),
(53, 4, 15, 4, 4, '2017-09-16 16:57:30'),
(54, 4, 16, 4, 5, '2017-09-16 16:57:38'),
(55, 4, 18, 4, 5, '2017-09-16 16:58:10'),
(56, 4, 19, 4, 2, '2017-09-16 16:58:18'),
(57, 4, 20, 4, 4, '2017-09-16 16:58:27'),
(58, 4, 21, 4, 5, '2017-09-16 16:59:10'),
(59, 4, 22, 4, 5, '2017-09-16 16:59:19'),
(60, 4, 23, 4, 4, '2017-09-16 16:59:25'),
(61, 4, 24, 4, 5, '2017-09-16 16:59:34'),
(62, 4, 25, 4, 4, '2017-09-16 16:59:39'),
(63, 4, 28, 4, 5, '2017-09-16 17:00:22'),
(64, 4, 29, 4, 4, '2017-09-16 17:00:45'),
(65, 4, 31, 4, 4, '2017-09-16 17:00:56'),
(66, 3, 28, 4, 43, '2017-09-16 17:01:06'),
(67, 5, 9, 4, 16.07, '2017-09-16 17:14:19'),
(68, 5, 10, 4, 14.08, '2017-09-16 17:14:41'),
(69, 5, 12, 4, 13.63, '2017-09-16 17:15:00'),
(70, 5, 13, 4, 15.03, '2017-09-16 17:15:08'),
(71, 5, 14, 4, 13.19, '2017-09-16 17:15:15'),
(72, 5, 15, 4, 15.89, '2017-09-16 17:15:22'),
(73, 5, 16, 4, 14.9, '2017-09-16 17:15:31'),
(74, 5, 18, 4, 20.09, '2017-09-16 17:15:39'),
(75, 5, 19, 4, 18.46, '2017-09-16 17:15:47'),
(76, 5, 20, 4, 14.8, '2017-09-16 17:15:55'),
(77, 5, 21, 4, 14.01, '2017-09-16 17:16:01'),
(78, 5, 22, 4, 15.63, '2017-09-16 17:16:10'),
(79, 5, 23, 4, 16, '2017-09-16 17:16:16'),
(80, 5, 24, 4, 13.66, '2017-09-16 17:16:24'),
(81, 5, 25, 4, 13.24, '2017-09-16 17:16:32'),
(82, 5, 28, 4, 14.64, '2017-09-16 17:16:48'),
(83, 5, 29, 4, 15.25, '2017-09-16 17:16:57'),
(84, 5, 30, 4, 13.95, '2017-09-16 17:17:04'),
(85, 5, 31, 4, 16.44, '2017-09-16 17:17:11'),
(86, 6, 9, 4, 18.36, '2017-09-16 17:29:03'),
(87, 6, 9, 4, 18.03, '2017-09-16 17:29:09'),
(88, 6, 10, 4, 17.59, '2017-09-16 17:30:17'),
(89, 6, 10, 4, 17.91, '2017-09-16 17:30:23'),
(90, 6, 12, 4, 17.08, '2017-09-16 17:31:43'),
(91, 6, 12, 4, 18.11, '2017-09-16 17:31:52'),
(92, 6, 13, 4, 18.46, '2017-09-16 17:32:04'),
(93, 6, 13, 4, 19.12, '2017-09-16 17:32:08'),
(94, 6, 14, 4, 17.26, '2017-09-16 17:34:11'),
(95, 6, 14, 4, 17.01, '2017-09-16 17:34:18'),
(96, 6, 15, 4, 17.99, '2017-09-16 17:34:41'),
(97, 6, 15, 4, 19.06, '2017-09-16 17:34:47'),
(98, 6, 16, 4, 17.49, '2017-09-16 17:34:57'),
(99, 6, 16, 4, 17.46, '2017-09-16 17:35:06'),
(100, 6, 18, 4, 18.23, '2017-09-16 17:35:32'),
(101, 6, 18, 4, 17.65, '2017-09-16 17:36:07'),
(102, 6, 19, 4, 25.97, '2017-09-16 17:36:19'),
(103, 6, 19, 4, 23.95, '2017-09-16 17:36:25'),
(104, 6, 20, 4, 17.71, '2017-09-16 17:36:51'),
(105, 6, 20, 4, 18.44, '2017-09-16 17:36:57'),
(106, 6, 21, 4, 16.7, '2017-09-16 17:37:04'),
(107, 6, 21, 4, 15.76, '2017-09-16 17:37:12'),
(108, 6, 22, 4, 15.72, '2017-09-16 17:37:32'),
(109, 6, 22, 4, 15.34, '2017-09-16 17:37:38'),
(110, 6, 23, 4, 16.68, '2017-09-16 17:37:45'),
(111, 6, 23, 4, 16.95, '2017-09-16 17:37:51'),
(112, 6, 24, 4, 18.39, '2017-09-16 17:37:59'),
(113, 6, 24, 4, 17.72, '2017-09-16 17:38:03'),
(114, 6, 25, 4, 18.3, '2017-09-16 17:38:11'),
(115, 6, 25, 4, 21.53, '2017-09-16 17:38:14'),
(116, 6, 28, 4, 18.02, '2017-09-16 17:38:26'),
(117, 6, 28, 4, 17.49, '2017-09-16 17:38:32'),
(118, 6, 29, 4, 18.04, '2017-09-16 17:38:39'),
(119, 6, 29, 4, 18.21, '2017-09-16 17:38:49'),
(120, 6, 30, 4, 17.39, '2017-09-16 17:39:15'),
(121, 6, 30, 4, 17.57, '2017-09-16 17:39:21'),
(122, 6, 31, 4, 18.36, '2017-09-16 17:39:31'),
(123, 6, 31, 4, 18.03, '2017-09-16 17:39:36'),
(130, 7, 9, 4, 1.13, '2017-09-16 17:51:18'),
(131, 8, 9, 4, 0.87, '2017-09-16 17:51:24'),
(132, 9, 9, 4, 1.56, '2017-09-16 17:51:30'),
(133, 10, 9, 4, 3.56, '2017-09-16 17:51:43'),
(134, 10, 10, 4, 3.62, '2017-09-16 17:52:58'),
(135, 9, 10, 4, 1.55, '2017-09-16 17:53:07'),
(136, 8, 10, 4, 0.88, '2017-09-16 17:53:15'),
(137, 7, 10, 4, 1.19, '2017-09-16 17:53:31'),
(138, 7, 12, 4, 1.5, '2017-09-16 17:54:31'),
(139, 8, 12, 4, 0.92, '2017-09-16 17:54:37'),
(140, 9, 12, 4, 1.68, '2017-09-16 17:54:54'),
(141, 10, 12, 4, 3.61, '2017-09-16 17:55:02'),
(142, 10, 13, 4, 3.8, '2017-09-16 17:55:42'),
(143, 9, 13, 4, 1.65, '2017-09-16 17:56:23'),
(144, 8, 13, 4, 0.9, '2017-09-16 17:56:29'),
(145, 7, 13, 4, 1.25, '2017-09-16 17:56:35'),
(147, 7, 14, 4, 1.19, '2017-09-16 17:57:07'),
(148, 8, 14, 4, 0.88, '2017-09-16 17:57:35'),
(149, 9, 14, 4, 1.58, '2017-09-16 17:57:42'),
(150, 10, 14, 4, 3.65, '2017-09-16 17:57:48'),
(151, 10, 15, 4, 3.71, '2017-09-16 17:58:29'),
(152, 9, 15, 4, 1.51, '2017-09-16 17:58:38'),
(153, 8, 15, 4, 0.86, '2017-09-16 17:58:47'),
(154, 7, 15, 4, 1.34, '2017-09-16 17:59:05'),
(155, 7, 16, 4, 1.26, '2017-09-16 17:59:45'),
(156, 8, 16, 4, 0.92, '2017-09-16 18:00:06'),
(157, 9, 16, 4, 1.67, '2017-09-16 18:00:14'),
(158, 10, 16, 4, 3.85, '2017-09-16 18:02:00'),
(159, 10, 18, 4, 3.81, '2017-09-16 18:02:16'),
(160, 9, 18, 4, 1.57, '2017-09-16 18:02:22'),
(161, 8, 18, 4, 0.9, '2017-09-16 18:02:42'),
(162, 7, 18, 4, 1.34, '2017-09-16 18:02:48'),
(166, 10, 19, 4, 4.77, '2017-09-16 18:05:01'),
(167, 9, 19, 4, 2.1, '2017-09-16 18:05:09'),
(168, 8, 19, 4, 1.15, '2017-09-16 18:05:16'),
(169, 7, 19, 4, 1.52, '2017-09-16 18:05:23'),
(170, 7, 20, 4, 1.31, '2017-09-16 18:05:44'),
(171, 8, 20, 4, 0.9, '2017-09-16 18:05:49'),
(172, 9, 20, 4, 1.64, '2017-09-16 18:05:54'),
(173, 10, 20, 4, 3.85, '2017-09-16 18:06:02'),
(174, 10, 21, 4, 3.61, '2017-09-16 18:06:15'),
(175, 9, 21, 4, 1.49, '2017-09-16 18:06:57'),
(176, 8, 21, 4, 0.87, '2017-09-16 18:07:08'),
(177, 7, 21, 4, 1.25, '2017-09-16 18:07:13'),
(178, 7, 22, 4, 1.09, '2017-09-16 18:07:24'),
(179, 8, 22, 4, 0.8, '2017-09-16 18:08:23'),
(180, 9, 22, 4, 1.45, '2017-09-16 18:08:36'),
(181, 10, 22, 4, 3.34, '2017-09-16 18:08:42'),
(182, 10, 23, 4, 3.55, '2017-09-16 18:09:03'),
(183, 9, 23, 4, 1.52, '2017-09-16 18:09:08'),
(184, 8, 23, 4, 0.84, '2017-09-16 18:09:55'),
(185, 7, 23, 4, 1.19, '2017-09-16 18:10:02'),
(186, 7, 24, 4, 1.21, '2017-09-16 18:10:53'),
(187, 8, 24, 4, 0.87, '2017-09-16 18:11:01'),
(188, 9, 24, 4, 1.63, '2017-09-16 18:11:08'),
(189, 10, 24, 4, 3.71, '2017-09-16 18:11:16'),
(190, 10, 25, 4, 3.64, '2017-09-16 18:12:33'),
(191, 9, 25, 4, 1.53, '2017-09-16 18:12:38'),
(192, 8, 25, 4, 0.81, '2017-09-16 18:12:44'),
(193, 7, 25, 4, 1.3, '2017-09-16 18:12:49'),
(194, 7, 28, 4, 1.13, '2017-09-16 18:13:05'),
(195, 8, 28, 4, 0.87, '2017-09-16 18:13:12'),
(196, 9, 28, 4, 1.56, '2017-09-16 18:13:18'),
(197, 10, 28, 4, 3.56, '2017-09-16 18:13:25'),
(198, 10, 29, 4, 3.81, '2017-09-16 18:13:36'),
(199, 9, 29, 4, 1.64, '2017-09-16 18:13:44'),
(200, 8, 29, 4, 0.93, '2017-09-16 18:13:49'),
(201, 7, 29, 4, 1.24, '2017-09-16 18:13:55'),
(202, 7, 30, 4, 1.27, '2017-09-16 18:14:05'),
(203, 8, 30, 4, 0.88, '2017-09-16 18:14:10'),
(204, 9, 30, 4, 1.62, '2017-09-16 18:14:16'),
(205, 10, 30, 4, 3.77, '2017-09-16 18:14:24'),
(206, 7, 31, 4, 1.29, '2017-09-16 18:14:39'),
(207, 8, 31, 4, 0.88, '2017-09-16 18:14:43'),
(208, 9, 31, 4, 1.59, '2017-09-16 18:14:49'),
(209, 10, 31, 4, 3.76, '2017-09-16 18:14:54');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `potential_test`
--

CREATE TABLE `potential_test` (
  `id` int(11) NOT NULL,
  `id_potential` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `best` float NOT NULL,
  `worst` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `potential_test`
--

INSERT INTO `potential_test` (`id`, `id_potential`, `name`, `best`, `worst`) VALUES
(2, 6, 'Beep Test - wynik', 10.03, 5.06),
(3, 6, 'Beep Test - VO2max', 47.7, 31.8),
(4, 6, 'Beep Test - ocena', 5, 1),
(5, 7, 'Nawroty z piłką', 13.24, 20.09),
(6, 7, 'Prowadzenie piłki', 15.34, 23.95),
(7, 7, '0-5m', 1.09, 1.53),
(8, 7, '5-10m', 0.8, 1.15),
(9, 7, '10-20m', 1.45, 2.12),
(10, 7, '0-20m', 3.34, 4.78);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `raports`
--

CREATE TABLE `raports` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_team` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `date_add` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'KOORD'),
(2, 'TRENER'),
(3, 'ZAWODNIK'),
(4, 'STAFF');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_team` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `staff`
--

INSERT INTO `staff` (`id`, `name`, `id_user`, `id_team`) VALUES
(1, 'Pierwszy Trener', 8, 4);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `weight` int(3) NOT NULL DEFAULT '999'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `teams`
--

INSERT INTO `teams` (`id`, `name`, `weight`) VALUES
(4, 'Młodzik', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `team_members`
--

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_team` int(11) NOT NULL,
  `nr_on_tshirt` int(11) NOT NULL DEFAULT '0',
  `id_position` int(11) NOT NULL DEFAULT '0',
  `is_master` tinyint(1) NOT NULL DEFAULT '0',
  `pos_x` int(5) NOT NULL DEFAULT '-1',
  `pos_y` int(5) NOT NULL DEFAULT '-1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `team_members`
--

INSERT INTO `team_members` (`id`, `id_user`, `id_team`, `nr_on_tshirt`, `id_position`, `is_master`, `pos_x`, `pos_y`) VALUES
(6, 8, 4, 0, 0, 0, -1, -1),
(7, 9, 4, 0, 0, 0, -1, -1),
(8, 10, 4, 0, 0, 0, -1, -1),
(9, 11, 4, 0, 0, 0, -1, -1),
(10, 12, 4, 0, 0, 0, -1, -1),
(11, 13, 4, 0, 0, 0, -1, -1),
(12, 14, 4, 0, 0, 0, -1, -1),
(13, 15, 4, 0, 0, 0, -1, -1),
(14, 16, 4, 0, 0, 0, -1, -1),
(15, 17, 4, 2, 0, 0, -1, -1),
(16, 18, 4, 0, 0, 0, -1, -1),
(17, 19, 4, 0, 0, 0, -1, -1),
(18, 20, 4, 0, 0, 0, -1, -1),
(19, 21, 4, 0, 0, 0, -1, -1),
(20, 22, 4, 0, 0, 0, -1, -1),
(21, 23, 4, 3, 0, 0, -1, -1),
(22, 24, 4, 0, 0, 0, -1, -1),
(23, 25, 4, 0, 0, 0, -1, -1),
(24, 26, 4, 0, 0, 0, -1, -1),
(25, 27, 4, 0, 0, 0, -1, -1),
(26, 28, 4, 0, 0, 0, -1, -1),
(27, 29, 4, 0, 0, 0, -1, -1),
(28, 30, 4, 0, 0, 0, -1, -1),
(29, 31, 4, 0, 0, 0, -1, -1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `todo`
--

CREATE TABLE `todo` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `color` varchar(255) COLLATE utf8_polish_ci NOT NULL DEFAULT '#f44336',
  `date_add` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_polish_ci DEFAULT NULL,
  `id_role` int(11) NOT NULL DEFAULT '1',
  `create_account_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `token`, `id_role`, `create_account_date`, `last_login_date`) VALUES
(1, 'ireneusz.koscielniak@wp.pl', '21232f297a57a5a743894a0e4a801fc3', 'e3981fbec093bb21f013757b728d1602', 1, '2017-09-01 03:05:08', '2017-09-01 03:05:08'),
(8, 'papa_10@op.pl', '387fcee1e47b3b631cb73ade7d0421f2', NULL, 2, '2017-09-16 15:42:41', '2017-09-16 15:42:41'),
(9, 'piotr.kubaczka@poczta.onet.pl', 'bd0c479292e80270508c3b9b8c2a7cf0', NULL, 3, '2017-09-16 15:48:17', '2017-09-16 15:48:17'),
(10, 'agalizak@poczta.onet.pl', '23382f21e4bb234c90232a762e71445d', NULL, 3, '2017-09-16 15:48:52', '2017-09-16 15:48:52'),
(11, 'nastik@nastik.pl', 'abb883310fc9ccb7bf47ab8963621979', NULL, 3, '2017-09-16 15:49:13', '2017-09-16 15:49:13'),
(12, 'ewa567@onet.pl', '8ce3a402135d9120bec50cb1013084f2', NULL, 3, '2017-09-16 15:49:37', '2017-09-16 15:49:37'),
(13, 'mpasterny24@gmail.com', 'b3bd054eefc98a481a6ce2618df581f0', NULL, 3, '2017-09-16 15:49:57', '2017-09-16 15:49:57'),
(14, 'matulaskocz@interia.pl', 'fe60ea035c5e9c96b3b22af57adfa118', NULL, 3, '2017-09-16 15:50:16', '2017-09-16 15:50:16'),
(15, 'bojda@inarisc.pl', '5de24d5b7f7301d624def730dfb53e86', NULL, 3, '2017-09-16 15:50:46', '2017-09-16 15:50:46'),
(16, 'zibi1814@gmail.com', 'cd389075c99da7d44043cf78b6711bae', NULL, 3, '2017-09-16 15:51:05', '2017-09-16 15:51:05'),
(17, 'francisfrac@interia.pl', 'ee0a921334382de76dc45e5123b48cae', NULL, 3, '2017-09-16 15:51:47', '2017-09-16 15:51:47'),
(18, 'ewabuj@interia.pl', '1d43bcd3a5819487fed31b598aa97781', NULL, 3, '2017-09-16 15:52:05', '2017-09-16 15:52:05'),
(19, 'gabrielazoldak@gmail.com', '67b81cf63741c99a21a1a9f8f1c14d82', NULL, 3, '2017-09-16 15:52:29', '2017-09-16 15:52:29'),
(20, 'marza9@onet.pl', '3910574ad67db974d2b456b1bfb40e9b', NULL, 3, '2017-09-16 15:52:52', '2017-09-16 15:52:52'),
(21, 'marzenastaniek@vp.pl', '6291db3f487680174f73c1c154dd86a5', NULL, 3, '2017-09-16 15:53:12', '2017-09-16 15:53:12'),
(22, 'justyna121185@wp.pl', 'b1090056bfbf416d39709815bd0b4e7d', NULL, 3, '2017-09-16 15:53:37', '2017-09-16 15:53:37'),
(23, 'sojka.leszek@gmail.com', '8a7383995e06ae38d737f27bb8aea4f2', NULL, 3, '2017-09-16 15:53:53', '2017-09-16 15:53:53'),
(24, 'miroslaw.wojnar@gmail.com', '4f5d14996a20b645cb62a50cdbabe4db', NULL, 3, '2017-09-16 15:54:11', '2017-09-16 15:54:11'),
(25, 'm.przywara@gascontrol-polska.pl', '98d8f638b3a5bab6aa6fcfaee361d92f', 'ab456b919dd9928167c6804a375934e9', 3, '2017-09-16 15:54:43', '2017-09-16 15:54:43'),
(26, 'sikora5054@wp.pl', 'd65fe09416015c481f94f5d9d6775ca6', NULL, 3, '2017-09-16 15:54:59', '2017-09-16 15:54:59'),
(27, 'pijat1954@interia.eu', 'c884f66c52d3f17234e2c825b5b67f5c', NULL, 3, '2017-09-16 15:55:19', '2017-09-16 15:55:19'),
(28, 'beataarek1998@interia.pl', '8c68285e1a04246819ffdd33a406a012', NULL, 3, '2017-09-16 15:55:41', '2017-09-16 15:55:41'),
(29, 'adam.ogierman@gmail.com', '109c1726bdd42d5f12673f260c060d25', NULL, 3, '2017-09-16 15:55:59', '2017-09-16 15:55:59'),
(30, 'agatadrelicharz@gmail.com', '95c73ce578dde9304ee976427f5fa235', NULL, 3, '2017-09-16 15:57:07', '2017-09-16 15:57:07'),
(31, 'lucybodak@gmail.com', '924d2a074b74b8a6ea2d503a2dcfc9e6', NULL, 3, '2017-09-16 16:09:46', '2017-09-16 16:09:46');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user_data`
--

CREATE TABLE `user_data` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `user_img_path` varchar(255) DEFAULT 'files/img/users/default.jpg',
  `address` varchar(255) NOT NULL DEFAULT '',
  `main_leg` varchar(255) NOT NULL DEFAULT '',
  `main_position` varchar(255) NOT NULL DEFAULT '',
  `tel` varchar(30) NOT NULL DEFAULT '',
  `parent_tel` varchar(30) NOT NULL DEFAULT '',
  `height` int(4) NOT NULL,
  `weight` int(4) NOT NULL,
  `body_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `user_data`
--

INSERT INTO `user_data` (`id`, `user_id`, `firstname`, `lastname`, `birthdate`, `user_img_path`, `address`, `main_leg`, `main_position`, `tel`, `parent_tel`, `height`, `weight`, `body_type`) VALUES
(1, 1, 'Ireneusz', 'Kościelniak', '1974-01-16', 'files/img/users/IreneuszKościelniak.png', 'Skoczów', '', '', '730-680-090', '', 0, 0, ''),
(8, 8, 'Krystian', 'Papatanasiu', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(9, 9, 'Paweł', 'Kubaczka', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(10, 10, 'Wojciech', 'Lizak', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(11, 11, 'Tomasz', 'Stokłosa', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(12, 12, 'Sebastian', 'Housother', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(13, 13, 'Jakub', 'Pasterny', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(14, 14, 'Tomasz', 'Matula', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(15, 15, 'Dawid', 'Bojda', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(16, 16, 'Konrad', 'Świder', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(17, 17, 'Tomasz', 'Frąc', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(18, 18, 'Szymon', 'Bujok', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(19, 19, 'Kacper', 'Żołdak', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(20, 20, 'Tymoteusz', 'Olszar', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(21, 21, 'Mateusz', 'Grabowski', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(22, 22, 'Mateusz', 'Nieckarz', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(23, 23, 'Marcin', 'Sojka', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(24, 24, 'Piotr', 'Wojnar', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(25, 25, 'Krzysztof', 'Przydacz', '2007-03-20', 'files/img/users/default.jpg', 'Kiczyce ul. Orłowa 10', 'lewa', 'pomoc', '728417901', '604912156', 170, 50, 'Mezomorfik'),
(26, 26, 'Paweł', 'Sikora', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(27, 27, 'Marcin', 'Kędzior', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(28, 28, 'Kacper', 'Kołatek', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(29, 29, 'Dawid', 'Ogierman', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(30, 30, 'Karol', 'Drelicharz', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(31, 31, 'Szymon', 'Bodak', NULL, 'files/img/users/default.jpg', '', '', '', '', '', 0, 0, '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user_notifications`
--

CREATE TABLE `user_notifications` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_team` int(11) NOT NULL,
  `id_notification` int(11) NOT NULL,
  `is_new` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `user_notifications`
--

INSERT INTO `user_notifications` (`id`, `id_user`, `id_team`, `id_notification`, `is_new`) VALUES
(36, 8, 4, 16, 1),
(37, 9, 4, 17, 1),
(38, 10, 4, 18, 1),
(39, 12, 4, 19, 1),
(40, 12, 4, 20, 1),
(41, 9, 4, 21, 1),
(42, 10, 4, 22, 1),
(43, 13, 4, 23, 1),
(44, 14, 4, 24, 1),
(45, 15, 4, 25, 1),
(46, 16, 4, 26, 1),
(47, 18, 4, 27, 1),
(48, 19, 4, 28, 1),
(49, 20, 4, 29, 1),
(50, 21, 4, 30, 1),
(51, 22, 4, 31, 1),
(52, 23, 4, 32, 1),
(53, 24, 4, 33, 1),
(54, 25, 4, 34, 1),
(55, 28, 4, 35, 1),
(56, 29, 4, 36, 1),
(57, 30, 4, 37, 1),
(58, 31, 4, 38, 1),
(59, 9, 4, 39, 1),
(60, 9, 4, 40, 1),
(61, 10, 4, 41, 1),
(62, 12, 4, 42, 1),
(63, 13, 4, 43, 1),
(64, 14, 4, 44, 1),
(65, 15, 4, 45, 1),
(66, 16, 4, 46, 1),
(67, 18, 4, 47, 1),
(68, 19, 4, 48, 1),
(69, 20, 4, 49, 1),
(70, 21, 4, 50, 1),
(71, 22, 4, 51, 1),
(72, 23, 4, 52, 1),
(73, 24, 4, 53, 1),
(74, 25, 4, 54, 1),
(75, 29, 4, 55, 1),
(76, 30, 4, 56, 1),
(77, 31, 4, 57, 1),
(78, 9, 4, 58, 1),
(79, 10, 4, 59, 1),
(80, 12, 4, 60, 1),
(81, 9, 4, 61, 1),
(82, 10, 4, 62, 1),
(83, 13, 4, 63, 1),
(84, 14, 4, 64, 1),
(85, 15, 4, 65, 1),
(86, 16, 4, 66, 1),
(87, 18, 4, 67, 1),
(88, 19, 4, 68, 1),
(89, 20, 4, 69, 1),
(90, 21, 4, 70, 1),
(91, 22, 4, 71, 1),
(92, 23, 4, 72, 1),
(93, 24, 4, 73, 1),
(94, 25, 4, 74, 1),
(95, 28, 4, 75, 1),
(96, 29, 4, 76, 1),
(97, 31, 4, 77, 1),
(98, 28, 4, 78, 1),
(99, 9, 4, 79, 1),
(100, 10, 4, 80, 1),
(101, 12, 4, 81, 1),
(102, 13, 4, 82, 1),
(103, 14, 4, 83, 1),
(104, 15, 4, 84, 1),
(105, 16, 4, 85, 1),
(106, 18, 4, 86, 1),
(107, 19, 4, 87, 1),
(108, 20, 4, 88, 1),
(109, 21, 4, 89, 1),
(110, 22, 4, 90, 1),
(111, 23, 4, 91, 1),
(112, 24, 4, 92, 1),
(113, 25, 4, 93, 1),
(114, 28, 4, 94, 1),
(115, 29, 4, 95, 1),
(116, 30, 4, 96, 1),
(117, 31, 4, 97, 1),
(118, 9, 4, 98, 1),
(119, 9, 4, 99, 1),
(120, 10, 4, 100, 1),
(121, 10, 4, 101, 1),
(122, 12, 4, 102, 1),
(123, 12, 4, 103, 1),
(124, 13, 4, 104, 1),
(125, 13, 4, 105, 1),
(126, 14, 4, 106, 1),
(127, 14, 4, 107, 1),
(128, 15, 4, 108, 1),
(129, 15, 4, 109, 1),
(130, 16, 4, 110, 1),
(131, 16, 4, 111, 1),
(132, 18, 4, 112, 1),
(133, 18, 4, 113, 1),
(134, 19, 4, 114, 1),
(135, 19, 4, 115, 1),
(136, 20, 4, 116, 1),
(137, 20, 4, 117, 1),
(138, 21, 4, 118, 1),
(139, 21, 4, 119, 1),
(140, 22, 4, 120, 1),
(141, 22, 4, 121, 1),
(142, 23, 4, 122, 1),
(143, 23, 4, 123, 1),
(144, 24, 4, 124, 1),
(145, 24, 4, 125, 1),
(146, 25, 4, 126, 1),
(147, 25, 4, 127, 1),
(148, 28, 4, 128, 1),
(149, 28, 4, 129, 1),
(150, 29, 4, 130, 1),
(151, 29, 4, 131, 1),
(152, 30, 4, 132, 1),
(153, 30, 4, 133, 1),
(154, 31, 4, 134, 1),
(155, 31, 4, 135, 1),
(156, 9, 4, 136, 1),
(157, 9, 4, 137, 1),
(158, 9, 4, 138, 1),
(159, 9, 4, 139, 1),
(160, 9, 4, 140, 1),
(161, 9, 4, 141, 1),
(162, 9, 4, 142, 1),
(163, 9, 4, 143, 1),
(164, 9, 4, 144, 1),
(165, 9, 4, 145, 1),
(166, 10, 4, 146, 1),
(167, 10, 4, 147, 1),
(168, 10, 4, 148, 1),
(169, 10, 4, 149, 1),
(170, 12, 4, 150, 1),
(171, 12, 4, 151, 1),
(172, 12, 4, 152, 1),
(173, 12, 4, 153, 1),
(174, 13, 4, 154, 1),
(175, 13, 4, 155, 1),
(176, 13, 4, 156, 1),
(177, 13, 4, 157, 1),
(178, 14, 4, 158, 1),
(179, 14, 4, 159, 1),
(180, 14, 4, 160, 1),
(181, 14, 4, 161, 1),
(182, 14, 4, 162, 1),
(183, 15, 4, 163, 1),
(184, 15, 4, 164, 1),
(185, 15, 4, 165, 1),
(186, 15, 4, 166, 1),
(187, 16, 4, 167, 1),
(188, 16, 4, 168, 1),
(189, 16, 4, 169, 1),
(190, 16, 4, 170, 1),
(191, 18, 4, 171, 1),
(192, 18, 4, 172, 1),
(193, 18, 4, 173, 1),
(194, 18, 4, 174, 1),
(195, 19, 4, 175, 1),
(196, 19, 4, 176, 1),
(197, 19, 4, 177, 1),
(198, 19, 4, 178, 1),
(199, 19, 4, 179, 1),
(200, 19, 4, 180, 1),
(201, 19, 4, 181, 1),
(202, 20, 4, 182, 1),
(203, 20, 4, 183, 1),
(204, 20, 4, 184, 1),
(205, 20, 4, 185, 1),
(206, 21, 4, 186, 1),
(207, 21, 4, 187, 1),
(208, 21, 4, 188, 1),
(209, 21, 4, 189, 1),
(210, 22, 4, 190, 1),
(211, 22, 4, 191, 1),
(212, 22, 4, 192, 1),
(213, 22, 4, 193, 1),
(214, 23, 4, 194, 1),
(215, 23, 4, 195, 1),
(216, 23, 4, 196, 1),
(217, 23, 4, 197, 1),
(218, 24, 4, 198, 1),
(219, 24, 4, 199, 1),
(220, 24, 4, 200, 1),
(221, 24, 4, 201, 1),
(222, 25, 4, 202, 1),
(223, 25, 4, 203, 1),
(224, 25, 4, 204, 1),
(225, 25, 4, 205, 1),
(226, 28, 4, 206, 1),
(227, 28, 4, 207, 1),
(228, 28, 4, 208, 1),
(229, 28, 4, 209, 1),
(230, 29, 4, 210, 1),
(231, 29, 4, 211, 1),
(232, 29, 4, 212, 1),
(233, 29, 4, 213, 1),
(234, 30, 4, 214, 1),
(235, 30, 4, 215, 1),
(236, 30, 4, 216, 1),
(237, 30, 4, 217, 1),
(238, 31, 4, 218, 1),
(239, 31, 4, 219, 1),
(240, 31, 4, 220, 1),
(241, 31, 4, 221, 1),
(242, 8, 4, 222, 1),
(243, 9, 4, 222, 1),
(244, 10, 4, 222, 1),
(245, 11, 4, 222, 1),
(246, 12, 4, 222, 1),
(247, 13, 4, 222, 1),
(248, 14, 4, 222, 1),
(249, 15, 4, 222, 1),
(250, 16, 4, 222, 1),
(251, 17, 4, 222, 1),
(252, 18, 4, 222, 1),
(253, 19, 4, 222, 1),
(254, 20, 4, 222, 1),
(255, 21, 4, 222, 1),
(256, 22, 4, 222, 1),
(257, 23, 4, 222, 1),
(258, 24, 4, 222, 1),
(259, 25, 4, 222, 1),
(260, 26, 4, 222, 1),
(261, 27, 4, 222, 1),
(262, 28, 4, 222, 1),
(263, 29, 4, 222, 1),
(264, 30, 4, 222, 1),
(265, 31, 4, 222, 1),
(266, 8, 4, 223, 1),
(267, 9, 4, 223, 1),
(268, 10, 4, 223, 1),
(269, 11, 4, 223, 1),
(270, 12, 4, 223, 1),
(271, 13, 4, 223, 1),
(272, 14, 4, 223, 1),
(273, 15, 4, 223, 1),
(274, 16, 4, 223, 1),
(275, 17, 4, 223, 1),
(276, 18, 4, 223, 1),
(277, 19, 4, 223, 1),
(278, 20, 4, 223, 1),
(279, 21, 4, 223, 1),
(280, 22, 4, 223, 1),
(281, 23, 4, 223, 1),
(282, 24, 4, 223, 1),
(283, 25, 4, 223, 1),
(284, 26, 4, 223, 1),
(285, 27, 4, 223, 1),
(286, 28, 4, 223, 1),
(287, 29, 4, 223, 1),
(288, 30, 4, 223, 1),
(289, 31, 4, 223, 1),
(290, 8, 4, 224, 1),
(291, 9, 4, 224, 1),
(292, 10, 4, 224, 1),
(293, 11, 4, 224, 1),
(294, 12, 4, 224, 1),
(295, 13, 4, 224, 1),
(296, 14, 4, 224, 1),
(297, 15, 4, 224, 1),
(298, 16, 4, 224, 1),
(299, 17, 4, 224, 1),
(300, 18, 4, 224, 1),
(301, 19, 4, 224, 1),
(302, 20, 4, 224, 1),
(303, 21, 4, 224, 1),
(304, 22, 4, 224, 1),
(305, 23, 4, 224, 1),
(306, 24, 4, 224, 1),
(307, 25, 4, 224, 1),
(308, 26, 4, 224, 1),
(309, 27, 4, 224, 1),
(310, 28, 4, 224, 1),
(311, 29, 4, 224, 1),
(312, 30, 4, 224, 1),
(313, 31, 4, 224, 1),
(314, 8, 4, 225, 1),
(315, 9, 4, 225, 1),
(316, 10, 4, 225, 1),
(317, 11, 4, 225, 1),
(318, 12, 4, 225, 1),
(319, 13, 4, 225, 1),
(320, 14, 4, 225, 1),
(321, 15, 4, 225, 1),
(322, 16, 4, 225, 1),
(323, 17, 4, 225, 1),
(324, 18, 4, 225, 1),
(325, 19, 4, 225, 1),
(326, 20, 4, 225, 1),
(327, 21, 4, 225, 1),
(328, 22, 4, 225, 1),
(329, 23, 4, 225, 1),
(330, 24, 4, 225, 1),
(331, 25, 4, 225, 1),
(332, 26, 4, 225, 1),
(333, 27, 4, 225, 1),
(334, 28, 4, 225, 1),
(335, 29, 4, 225, 1),
(336, 30, 4, 225, 1),
(337, 31, 4, 225, 1),
(338, 8, 4, 226, 1),
(339, 9, 4, 226, 1),
(340, 10, 4, 226, 1),
(341, 11, 4, 226, 1),
(342, 12, 4, 226, 1),
(343, 13, 4, 226, 1),
(344, 14, 4, 226, 1),
(345, 15, 4, 226, 1),
(346, 16, 4, 226, 1),
(347, 17, 4, 226, 1),
(348, 18, 4, 226, 1),
(349, 19, 4, 226, 1),
(350, 20, 4, 226, 1),
(351, 21, 4, 226, 1),
(352, 22, 4, 226, 1),
(353, 23, 4, 226, 1),
(354, 24, 4, 226, 1),
(355, 25, 4, 226, 1),
(356, 26, 4, 226, 1),
(357, 27, 4, 226, 1),
(358, 28, 4, 226, 1),
(359, 29, 4, 226, 1),
(360, 30, 4, 226, 1),
(361, 31, 4, 226, 1),
(362, 8, 4, 227, 1),
(363, 9, 4, 227, 1),
(364, 10, 4, 227, 1),
(365, 11, 4, 227, 1),
(366, 12, 4, 227, 1),
(367, 13, 4, 227, 1),
(368, 14, 4, 227, 1),
(369, 15, 4, 227, 1),
(370, 16, 4, 227, 1),
(371, 17, 4, 227, 1),
(372, 18, 4, 227, 1),
(373, 19, 4, 227, 1),
(374, 20, 4, 227, 1),
(375, 21, 4, 227, 1),
(376, 22, 4, 227, 1),
(377, 23, 4, 227, 1),
(378, 24, 4, 227, 1),
(379, 25, 4, 227, 1),
(380, 26, 4, 227, 1),
(381, 27, 4, 227, 1),
(382, 28, 4, 227, 1),
(383, 29, 4, 227, 1),
(384, 30, 4, 227, 1),
(385, 31, 4, 227, 1),
(386, 23, 4, 228, 1),
(387, 21, 4, 229, 1),
(388, 17, 4, 230, 1),
(389, 15, 4, 231, 1),
(390, 8, 4, 232, 1),
(391, 9, 4, 232, 1),
(392, 10, 4, 232, 1),
(393, 11, 4, 232, 1),
(394, 12, 4, 232, 1),
(395, 13, 4, 232, 1),
(396, 14, 4, 232, 1),
(397, 15, 4, 232, 1),
(398, 16, 4, 232, 1),
(399, 17, 4, 232, 1),
(400, 18, 4, 232, 1),
(401, 19, 4, 232, 1),
(402, 20, 4, 232, 1),
(403, 21, 4, 232, 1),
(404, 22, 4, 232, 1),
(405, 23, 4, 232, 1),
(406, 24, 4, 232, 1),
(407, 25, 4, 232, 1),
(408, 26, 4, 232, 1),
(409, 27, 4, 232, 1),
(410, 28, 4, 232, 1),
(411, 29, 4, 232, 1),
(412, 30, 4, 232, 1),
(413, 31, 4, 232, 1),
(414, 8, 4, 233, 1),
(415, 9, 4, 233, 1),
(416, 10, 4, 233, 1),
(417, 11, 4, 233, 1),
(418, 12, 4, 233, 1),
(419, 13, 4, 233, 1),
(420, 14, 4, 233, 1),
(421, 15, 4, 233, 1),
(422, 16, 4, 233, 1),
(423, 17, 4, 233, 1),
(424, 18, 4, 233, 1),
(425, 19, 4, 233, 1),
(426, 20, 4, 233, 1),
(427, 21, 4, 233, 1),
(428, 22, 4, 233, 1),
(429, 23, 4, 233, 1),
(430, 24, 4, 233, 1),
(431, 25, 4, 233, 1),
(432, 26, 4, 233, 1),
(433, 27, 4, 233, 1),
(434, 28, 4, 233, 1),
(435, 29, 4, 233, 1),
(436, 30, 4, 233, 1),
(437, 31, 4, 233, 1),
(438, 8, 4, 234, 1),
(439, 9, 4, 234, 1),
(440, 10, 4, 234, 1),
(441, 11, 4, 234, 1),
(442, 12, 4, 234, 1),
(443, 13, 4, 234, 1),
(444, 14, 4, 234, 1),
(445, 15, 4, 234, 1),
(446, 16, 4, 234, 1),
(447, 17, 4, 234, 1),
(448, 18, 4, 234, 1),
(449, 19, 4, 234, 1),
(450, 20, 4, 234, 1),
(451, 21, 4, 234, 1),
(452, 22, 4, 234, 1),
(453, 23, 4, 234, 1),
(454, 24, 4, 234, 1),
(455, 25, 4, 234, 1),
(456, 26, 4, 234, 1),
(457, 27, 4, 234, 1),
(458, 28, 4, 234, 1),
(459, 29, 4, 234, 1),
(460, 30, 4, 234, 1),
(461, 31, 4, 234, 1),
(462, 8, 4, 235, 1),
(463, 9, 4, 235, 1),
(464, 10, 4, 235, 1),
(465, 11, 4, 235, 1),
(466, 12, 4, 235, 1),
(467, 13, 4, 235, 1),
(468, 14, 4, 235, 1),
(469, 15, 4, 235, 1),
(470, 16, 4, 235, 1),
(471, 17, 4, 235, 1),
(472, 18, 4, 235, 1),
(473, 19, 4, 235, 1),
(474, 20, 4, 235, 1),
(475, 21, 4, 235, 1),
(476, 22, 4, 235, 1),
(477, 23, 4, 235, 1),
(478, 24, 4, 235, 1),
(479, 25, 4, 235, 1),
(480, 26, 4, 235, 1),
(481, 27, 4, 235, 1),
(482, 28, 4, 235, 1),
(483, 29, 4, 235, 1),
(484, 30, 4, 235, 1),
(485, 31, 4, 235, 1),
(486, 8, 4, 236, 1),
(487, 9, 4, 236, 1),
(488, 10, 4, 236, 1),
(489, 11, 4, 236, 1),
(490, 12, 4, 236, 1),
(491, 13, 4, 236, 1),
(492, 14, 4, 236, 1),
(493, 15, 4, 236, 1),
(494, 16, 4, 236, 1),
(495, 17, 4, 236, 1),
(496, 18, 4, 236, 1),
(497, 19, 4, 236, 1),
(498, 20, 4, 236, 1),
(499, 21, 4, 236, 1),
(500, 22, 4, 236, 1),
(501, 23, 4, 236, 1),
(502, 24, 4, 236, 1),
(503, 25, 4, 236, 1),
(504, 26, 4, 236, 1),
(505, 27, 4, 236, 1),
(506, 28, 4, 236, 1),
(507, 29, 4, 236, 1),
(508, 30, 4, 236, 1),
(509, 31, 4, 236, 1),
(510, 8, 4, 237, 1),
(511, 9, 4, 237, 1),
(512, 10, 4, 237, 1),
(513, 11, 4, 237, 1),
(514, 12, 4, 237, 1),
(515, 13, 4, 237, 1),
(516, 14, 4, 237, 1),
(517, 15, 4, 237, 1),
(518, 16, 4, 237, 1),
(519, 17, 4, 237, 1),
(520, 18, 4, 237, 1),
(521, 19, 4, 237, 1),
(522, 20, 4, 237, 1),
(523, 21, 4, 237, 1),
(524, 22, 4, 237, 1),
(525, 23, 4, 237, 1),
(526, 24, 4, 237, 1),
(527, 25, 4, 237, 1),
(528, 26, 4, 237, 1),
(529, 27, 4, 237, 1),
(530, 28, 4, 237, 1),
(531, 29, 4, 237, 1),
(532, 30, 4, 237, 1),
(533, 31, 4, 237, 1),
(534, 8, 4, 238, 1),
(535, 9, 4, 238, 1),
(536, 10, 4, 238, 1),
(537, 11, 4, 238, 1),
(538, 12, 4, 238, 1),
(539, 13, 4, 238, 1),
(540, 14, 4, 238, 1),
(541, 15, 4, 238, 1),
(542, 16, 4, 238, 1),
(543, 17, 4, 238, 1),
(544, 18, 4, 238, 1),
(545, 19, 4, 238, 1),
(546, 20, 4, 238, 1),
(547, 21, 4, 238, 1),
(548, 22, 4, 238, 1),
(549, 23, 4, 238, 1),
(550, 24, 4, 238, 1),
(551, 25, 4, 238, 1),
(552, 26, 4, 238, 1),
(553, 27, 4, 238, 1),
(554, 28, 4, 238, 1),
(555, 29, 4, 238, 1),
(556, 30, 4, 238, 1),
(557, 31, 4, 238, 1),
(558, 8, 4, 239, 1),
(559, 9, 4, 239, 1),
(560, 10, 4, 239, 1),
(561, 11, 4, 239, 1),
(562, 12, 4, 239, 1),
(563, 13, 4, 239, 1),
(564, 14, 4, 239, 1),
(565, 15, 4, 239, 1),
(566, 16, 4, 239, 1),
(567, 17, 4, 239, 1),
(568, 18, 4, 239, 1),
(569, 19, 4, 239, 1),
(570, 20, 4, 239, 1),
(571, 21, 4, 239, 1),
(572, 22, 4, 239, 1),
(573, 23, 4, 239, 1),
(574, 24, 4, 239, 1),
(575, 25, 4, 239, 1),
(576, 26, 4, 239, 1),
(577, 27, 4, 239, 1),
(578, 28, 4, 239, 1),
(579, 29, 4, 239, 1),
(580, 30, 4, 239, 1),
(581, 31, 4, 239, 1);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_team` (`id_team`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_team` (`id_team`);

--
-- Indexes for table `potential`
--
ALTER TABLE `potential`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `potential_score`
--
ALTER TABLE `potential_score`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_test` (`id_test`),
  ADD KEY `id_team` (`id_team`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `potential_test`
--
ALTER TABLE `potential_test`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_potential` (`id_potential`);

--
-- Indexes for table `raports`
--
ALTER TABLE `raports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_team` (`id_team`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_team` (`id_team`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_team` (`id_team`),
  ADD KEY `id_position` (`id_position`);

--
-- Indexes for table `todo`
--
ALTER TABLE `todo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `id_role` (`id_role`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_notification` (`id_notification`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_team` (`id_team`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT dla tabeli `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT dla tabeli `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=240;
--
-- AUTO_INCREMENT dla tabeli `positions`
--
ALTER TABLE `positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT dla tabeli `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT dla tabeli `potential`
--
ALTER TABLE `potential`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT dla tabeli `potential_score`
--
ALTER TABLE `potential_score`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=210;
--
-- AUTO_INCREMENT dla tabeli `potential_test`
--
ALTER TABLE `potential_test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT dla tabeli `raports`
--
ALTER TABLE `raports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT dla tabeli `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT dla tabeli `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT dla tabeli `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT dla tabeli `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT dla tabeli `todo`
--
ALTER TABLE `todo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT dla tabeli `user_data`
--
ALTER TABLE `user_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT dla tabeli `user_notifications`
--
ALTER TABLE `user_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=582;
--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON UPDATE NO ACTION;

--
-- Ograniczenia dla tabeli `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`id_team`) REFERENCES `teams` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ograniczenia dla tabeli `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`id_team`) REFERENCES `teams` (`id`) ON UPDATE NO ACTION;

--
-- Ograniczenia dla tabeli `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `staff_ibfk_2` FOREIGN KEY (`id_team`) REFERENCES `teams` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ograniczenia dla tabeli `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`id_team`) REFERENCES `teams` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `team_members_ibfk_3` FOREIGN KEY (`id_position`) REFERENCES `positions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ograniczenia dla tabeli `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ograniczenia dla tabeli `user_data`
--
ALTER TABLE `user_data`
  ADD CONSTRAINT `user_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

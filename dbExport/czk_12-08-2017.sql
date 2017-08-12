-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: mysql15.mydevil.net
-- Czas generowania: 12 Sie 2017, 15:52
-- Wersja serwera: 5.7.16-10-log
-- Wersja PHP: 5.6.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `m1080_czk`
--
CREATE DATABASE IF NOT EXISTS `m1080_czk` DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;
USE `m1080_czk`;

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

--
-- Zrzut danych tabeli `comments`
--

INSERT INTO `comments` (`id`, `id_post`, `id_user`, `content`, `date_add`) VALUES
(3, 19, 38, 'Można je pobrać ze strony - www.lukam2010.pl', '2017-08-08 13:30:05'),
(4, 20, 38, 'Można je pobrać ze strony - www.lukam2010.pl ', '2017-08-08 13:30:57');

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

--
-- Zrzut danych tabeli `events`
--

INSERT INTO `events` (`id_team`, `title`, `start`, `end`, `url`, `id`) VALUES
(7, 'zebranie rodziców grupy orlik', '2017-08-18 18:00:00', '2017-08-18 19:00:00', '', 6),
(7, 'spotkanie z burmistrzem skoczów', '2017-08-11 13:00:00', '2017-08-11 14:00:00', '', 7),
(7, 'badania lekarskie dr.Sztwiertnia', '2017-08-10 18:00:00', '2017-08-10 19:00:00', '', 8),
(7, 'mecz sparingowy Zabrze mecz 10:30 Zabrze ul.Wyciska 5 a', '2017-08-12 09:00:00', '2017-08-12 14:00:00', '', 9),
(7, 'zadzwonić do Rozmus / Toyota', '2017-08-10 08:00:00', '2017-08-10 20:00:00', '', 10),
(7, 'WYJAZD NA KURS UEFA PRO ', '2017-08-20 15:00:00', '2017-08-23 23:45:00', '', 12),
(7, 'URLOP', '2017-08-27 08:00:00', '2017-09-02 23:30:00', '', 13);

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
(1, 'Przypisano Cię do nowej drużyny: druzyna testowa 1', '', '2017-08-01 02:21:48'),
(2, 'trener1 trener1nazwisko dodał post', '#!/tab', '2017-08-01 02:26:50'),
(3, 'Dodano nowy personel: Trener bramkarzy', '#!/staff', '2017-08-01 02:27:39'),
(4, 'Twój numer na boisku został zmieniony na: 2', '#!/teamComposition', '2017-08-01 02:42:38'),
(5, 'Twoja pozycja na boisku została zmieniona na: Bramka', '#!/teamComposition', '2017-08-01 02:42:44'),
(6, 'Twoja pozycja na boisku została zmieniona na: Lawka', '#!/teamComposition', '2017-08-01 02:43:57'),
(7, 'Twoja pozycja na boisku została zmieniona na: Bramka', '#!/teamComposition', '2017-08-01 02:45:28'),
(8, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 100m', '#!/myStats', '2017-08-01 02:47:59'),
(9, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 100m', '#!/myStats', '2017-08-01 02:48:09'),
(10, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 100m', '#!/myStats', '2017-08-01 02:48:30'),
(11, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 100m', '#!/myStats', '2017-08-01 02:48:36'),
(12, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 100m', '#!/myStats', '2017-08-01 02:50:23'),
(13, 'Dodano wydarzenie: \'Wydanie wersji alfa\'', '#!/calendar', '2017-08-01 03:04:48'),
(14, 'Twoja pozycja na boisku została zmieniona na: Obrona', '#!/teamComposition', '2017-08-01 11:02:17'),
(15, 'Twoja pozycja na boisku została zmieniona na: Lawka', '#!/teamComposition', '2017-08-01 11:02:19'),
(16, 'Dodano wydarzenie: \'Spotkanie z panią dyrektor ( SMS )\'', '#!/calendar', '2017-08-07 00:03:22'),
(17, 'Koord admin dodał post', '#!/tab', '2017-08-07 00:09:33'),
(18, 'Twoja pozycja na boisku została zmieniona na: Obrona', '#!/teamComposition', '2017-08-07 00:14:21'),
(19, 'Twoja pozycja na boisku została zmieniona na: Lawka', '#!/teamComposition', '2017-08-07 00:15:22'),
(20, 'Dodano nowy personel: Trener Wuwer Tomasz', '#!/staff', '2017-08-07 00:18:53'),
(21, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- bieg 100 m.', '#!/myStats', '2017-08-07 00:28:28'),
(22, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 100m', '#!/myStats', '2017-08-07 14:32:35'),
(23, 'Przypisano Cię do nowej drużyny: ORLIK', '', '2017-08-08 12:22:17'),
(24, 'Przypisano Cię do nowej drużyny: SKRZAT MŁODSZY', '', '2017-08-08 12:34:25'),
(25, 'Przypisano Cię do nowej drużyny: SKRZAT', '', '2017-08-08 12:34:44'),
(26, 'Przypisano Cię do nowej drużyny: ŻAK', '', '2017-08-08 12:35:33'),
(27, 'Przypisano Cię do nowej drużyny: MŁODZIK', '', '2017-08-08 12:35:58'),
(28, 'Przypisano Cię do nowej drużyny: TRAMPKARZ MŁODSZY', '', '2017-08-08 12:36:07'),
(29, 'Przypisano Cię do nowej drużyny: TRAMPKARZ', '', '2017-08-08 12:36:12'),
(30, 'Dodano nowy personel: I TRENER', '#!/staff', '2017-08-08 12:37:52'),
(31, 'Dodano nowy personel: I TRENER', '#!/staff', '2017-08-08 12:38:46'),
(32, 'Dodano nowy personel: I TRENER', '#!/staff', '2017-08-08 12:40:44'),
(33, 'Dodano nowy personel: I TRENER', '#!/staff', '2017-08-08 12:40:53'),
(34, 'Dodano nowy personel: I TRENER', '#!/staff', '2017-08-08 12:40:59'),
(35, 'Dodano nowy personel: I TRENER', '#!/staff', '2017-08-08 12:41:05'),
(36, 'Dodano nowy personel: I TRENER', '#!/staff', '2017-08-08 12:41:16'),
(37, 'Ireneusz Kościelniak dodał post', '#!/tab', '2017-08-08 13:29:45'),
(38, 'Ireneusz Kościelniak dodał post', '#!/tab', '2017-08-08 13:30:33'),
(39, 'Uzyskałeś raport: Przykładowy raport medyczny', '#!/myRaports', '2017-08-08 13:34:10'),
(40, 'Dodano wydarzenie: \'Spotkanie z trenerami\'', '#!/calendar', '2017-08-08 13:41:42'),
(41, 'Dodano wydarzenie: \'Spotkanie z trenerami\'', '#!/calendar', '2017-08-08 13:42:04'),
(42, 'Dodano wydarzenie: \'Obóz letni\'', '#!/calendar', '2017-08-08 13:42:29'),
(43, 'Przypisano Cię do nowej drużyny: ORLIK', '', '2017-08-08 13:55:15'),
(44, 'Przypisano Cię do nowej drużyny: SKRZAT MŁODSZY', '', '2017-08-08 13:55:19'),
(45, 'Przypisano Cię do nowej drużyny: SKRZAT', '', '2017-08-08 13:55:22'),
(46, 'Przypisano Cię do nowej drużyny: TRAMPKARZ', '', '2017-08-08 13:55:26'),
(47, 'Twoja pozycja na boisku została zmieniona na: Obrona', '#!/teamComposition', '2017-08-08 17:28:34'),
(48, 'Twoja pozycja na boisku została zmieniona na: Pomoc', '#!/teamComposition', '2017-08-08 17:28:36'),
(49, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test', '#!/myStats', '2017-08-08 17:29:21'),
(50, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 100m', '#!/myStats', '2017-08-08 19:11:28'),
(51, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 50m', '#!/myStats', '2017-08-08 19:11:52'),
(52, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 50m', '#!/myStats', '2017-08-08 19:12:00'),
(53, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 50m', '#!/myStats', '2017-08-08 19:12:06'),
(54, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 100m', '#!/myStats', '2017-08-08 19:12:16'),
(55, 'Otrzymałeś nowy wynik z kategorii : Szybkość -- Bieg 100m', '#!/myStats', '2017-08-08 19:12:22'),
(56, 'Otrzymałeś nowy wynik z kategorii : Technika -- Bieg między pachołkami', '#!/myStats', '2017-08-08 19:12:50'),
(57, 'Otrzymałeś nowy wynik z kategorii : Technika -- Bieg między pachołkami', '#!/myStats', '2017-08-08 19:12:54'),
(58, 'Otrzymałeś nowy wynik z kategorii : Technika -- Bieg między pachołkami', '#!/myStats', '2017-08-08 19:12:58'),
(59, 'Otrzymałeś nowy wynik z kategorii : Technika -- Podbijanie piłki', '#!/myStats', '2017-08-08 19:13:08'),
(60, 'Otrzymałeś nowy wynik z kategorii : Technika -- Podbijanie piłki', '#!/myStats', '2017-08-08 19:13:13'),
(61, 'Otrzymałeś nowy wynik z kategorii : Technika -- Podbijanie piłki', '#!/myStats', '2017-08-08 19:13:19'),
(62, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test', '#!/myStats', '2017-08-08 19:13:35'),
(63, 'Otrzymałeś nowy wynik z kategorii : Wytrzymałość -- Beep Test', '#!/myStats', '2017-08-08 19:13:44'),
(64, 'Twój numer na boisku został zmieniony na: 3', '#!/teamComposition', '2017-08-08 21:09:40'),
(65, 'Twój numer na boisku został zmieniony na: 2', '#!/teamComposition', '2017-08-08 21:09:42'),
(66, 'Twój numer na boisku został zmieniony na: 1', '#!/teamComposition', '2017-08-08 21:09:45'),
(67, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 22:33:23'),
(68, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 22:35:15'),
(69, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 22:38:23'),
(70, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 22:39:16'),
(71, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 22:42:32'),
(72, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 22:42:41'),
(73, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 22:44:05'),
(74, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 22:46:01'),
(75, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:47:27'),
(76, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:48:24'),
(77, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:48:27'),
(78, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:49:02'),
(79, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:49:50'),
(80, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:51:04'),
(81, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:51:05'),
(82, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:51:28'),
(83, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:51:37'),
(84, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-08 23:53:00'),
(85, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 00:09:42'),
(86, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 00:11:04'),
(87, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 00:12:39'),
(88, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 00:12:41'),
(89, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 00:12:43'),
(90, 'Twój numer na boisku został zmieniony na: 12', '#!/teamComposition', '2017-08-09 00:16:02'),
(91, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 00:16:04'),
(92, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 00:27:29'),
(93, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 01:51:25'),
(94, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 11:34:03'),
(95, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 11:34:10'),
(96, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-09 23:23:02'),
(97, 'Dodano wydarzenie: \'zebranie rodziców grupy orlik\'', '#!/calendar', '2017-08-09 23:33:32'),
(98, 'Dodano wydarzenie: \'spotkanie z burmistrzem skoczów\'', '#!/calendar', '2017-08-09 23:34:28'),
(99, 'Dodano wydarzenie: \'badania lekarskie dr.Sztwiertnia\'', '#!/calendar', '2017-08-09 23:35:25'),
(100, 'Dodano wydarzenie: \'mecz sparingowy Zabrze mecz 10:30 Zabrze ul.Wyciska 5 a\'', '#!/calendar', '2017-08-09 23:38:29'),
(101, 'Dodano wydarzenie: \'zadzwonić do Rozmus / Toyota\'', '#!/calendar', '2017-08-09 23:39:39'),
(102, 'Dodano wydarzenie: \'wyjazd na kurs UEFA PRO \'', '#!/calendar', '2017-08-09 23:41:32'),
(103, 'Dodano wydarzenie: \'WYJAZD NA KURS UEFA PRO \'', '#!/calendar', '2017-08-09 23:43:18'),
(104, 'Dodano wydarzenie: \'URLOP\'', '#!/calendar', '2017-08-09 23:44:17'),
(105, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-12 15:32:54'),
(106, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-12 15:33:03'),
(107, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-12 15:48:29'),
(108, 'Twoja pozycja na boisku została zmieniona', '#!/teamComposition', '2017-08-12 15:48:37');

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
(19, 38, 13, 'Na najbliższy trening proszę zabrać karty zdrowia zawodnika!', '2017-08-08 13:29:45'),
(20, 38, 7, 'Na najbliższy trening proszę zabrać karty zdrowia zawodnika!', '2017-08-08 13:30:33');

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
(1, 'Szybkość'),
(3, 'Technika'),
(4, 'Wytrzymałość'),
(6, 'Siła');

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
(8, 4, 49, 7, 15, '2017-08-08 17:29:21'),
(9, 1, 48, 7, 10, '2017-08-08 19:11:28'),
(10, 5, 48, 7, 4, '2017-08-08 19:11:52'),
(11, 5, 49, 7, 3, '2017-08-08 19:12:00'),
(12, 5, 50, 7, 5, '2017-08-08 19:12:06'),
(13, 1, 50, 7, 11, '2017-08-08 19:12:16'),
(14, 1, 49, 7, 11.5, '2017-08-08 19:12:22'),
(15, 3, 48, 7, 15, '2017-08-08 19:12:50'),
(16, 3, 49, 7, 14, '2017-08-08 19:12:54'),
(17, 3, 50, 7, 15, '2017-08-08 19:12:58'),
(18, 6, 50, 7, 25, '2017-08-08 19:13:08'),
(19, 6, 49, 7, 27, '2017-08-08 19:13:13'),
(20, 6, 48, 7, 38, '2017-08-08 19:13:19'),
(21, 4, 48, 7, 11, '2017-08-08 19:13:35'),
(22, 4, 50, 7, 21, '2017-08-08 19:13:44'),
(23, 7, 48, 7, 12, '2017-08-08 19:14:01'),
(24, 7, 49, 7, 15, '2017-08-08 19:14:05'),
(25, 7, 50, 7, 19, '2017-08-08 19:14:11');

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
(1, 1, 'Bieg 100m', 8.5, 16),
(3, 3, 'Bieg między pachołkami', 10, 20),
(4, 4, 'Beep Test', 21, 1),
(5, 1, 'Bieg 50m', 3, 6),
(6, 3, 'Podbijanie piłki', 50, 1),
(7, 6, 'Pompki', 20, 1);

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

--
-- Zrzut danych tabeli `raports`
--

INSERT INTO `raports` (`id`, `id_user`, `id_team`, `name`, `file_path`, `date_add`) VALUES
(1, 48, 7, 'Przykładowy raport medyczny', 'files/users/487Przykładowy_raport_medyczny.jpg', '2017-08-08 13:34:10');

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
(3, 'I TRENER', 46, 10),
(4, 'I TRENER', 46, 11),
(5, 'I TRENER', 47, 13),
(6, 'I TRENER', 43, 7),
(7, 'I TRENER', 43, 8),
(8, 'I TRENER', 44, 9),
(9, 'I TRENER', 45, 12);

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
(5, 43, 7, 0, 0, 0, -1, -1),
(6, 43, 8, 0, 0, 0, -1, -1),
(7, 44, 9, 0, 0, 0, -1, -1),
(8, 45, 12, 0, 0, 0, -1, -1),
(9, 47, 13, 0, 0, 0, -1, -1),
(10, 46, 11, 0, 0, 0, -1, -1),
(11, 46, 10, 0, 0, 0, -1, -1),
(12, 48, 7, 1, 2, 0, 49, 10),
(13, 49, 7, 2, 0, 0, 22, 45),
(14, 50, 7, 12, 3, 0, 81, 45);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `teams`
--

INSERT INTO `teams` (`id`, `name`) VALUES
(7, 'ORLIK'),
(8, 'SKRZAT MŁODSZY'),
(9, 'SKRZAT'),
(10, 'TRAMPKARZ'),
(11, 'TRAMPKARZ MŁODSZY'),
(12, 'ŻAK'),
(13, 'MŁODZIK');

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

--
-- Zrzut danych tabeli `todo`
--

INSERT INTO `todo` (`id`, `id_user`, `title`, `color`, `date_add`) VALUES
(3, 39, 'test', '#f44336', '2017-08-01 02:21:13'),
(5, 38, 'Zebrać karty zdrowia zawodników', '#f44336', '2017-08-07 00:00:31'),
(6, 38, 'Zebrać karty gry amatora', '#f44336', '2017-08-07 00:01:02'),
(7, 38, 'Zebrać karty kwalifikacyjne', '#f44336', '2017-08-07 00:01:34'),
(14, 38, 'Zebranie z drużyną Orlik', '#f44336', '2017-08-09 23:31:55');

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
  `user_img_path` varchar(255) DEFAULT 'img/users/default.jpg',
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
(1, 38, 'Ireneusz', 'Kościelniak', '1974-01-16', 'img/users/Kościelniak.png', '43-430 Skoczów, ul.Leśna 27F', '', '', '730680090', '', 0, 0, ''),
(3, NULL, 'testowy', 'zawodnik1', '0000-00-00', 'img/users/default.jpg', '', '', '', '675-567-890', '', 0, 0, 'Ektomorfik'),
(4, NULL, 'tstowy', 'zawodnik2', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(5, 42, 'jan', 'kowalski', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(6, 43, 'Tomasz', 'Wuwer', NULL, 'img/users/default.jpg', '', '', '', '321321321', '', 0, 0, ''),
(7, 44, 'Weronika', 'Iskrzycka', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(8, 45, 'Sebastian', 'Tora', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(9, 46, 'Andrzej', 'Ogórek', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(10, 47, 'Krystian', 'Papatanasiu', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(11, 48, 'Ksawery', 'Lazar', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(12, 49, 'Bartosz', 'Bodak', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(13, 50, 'Igor', 'Cholewa', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, '');

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
(32, 43, 5, 23, 1),
(33, 43, 7, 24, 1),
(34, 44, 7, 25, 1),
(35, 45, 7, 26, 1),
(36, 47, 7, 27, 1),
(37, 46, 7, 28, 1),
(38, 46, 7, 29, 1),
(39, 11, 10, 30, 1),
(40, 10, 11, 31, 1),
(41, 9, 13, 32, 1),
(42, 5, 7, 33, 1),
(43, 6, 8, 34, 1),
(44, 7, 9, 35, 1),
(45, 8, 12, 36, 1),
(46, 9, 13, 37, 1),
(47, 5, 7, 38, 1),
(48, 48, 7, 39, 1),
(49, 5, 7, 40, 1),
(50, 12, 7, 40, 1),
(51, 13, 7, 40, 1),
(52, 14, 7, 40, 1),
(53, 5, 7, 41, 1),
(54, 12, 7, 41, 1),
(55, 13, 7, 41, 1),
(56, 14, 7, 41, 1),
(57, 5, 7, 42, 1),
(58, 12, 7, 42, 1),
(59, 13, 7, 42, 1),
(60, 14, 7, 42, 1),
(61, 52, 7, 43, 1),
(62, 52, 7, 44, 1),
(63, 52, 7, 45, 1),
(64, 52, 7, 46, 1),
(65, 48, 7, 47, 1),
(66, 50, 7, 48, 1),
(67, 49, 7, 49, 1),
(68, 48, 7, 50, 1),
(69, 48, 7, 51, 1),
(70, 49, 7, 52, 1),
(71, 50, 7, 53, 1),
(72, 50, 7, 54, 1),
(73, 49, 7, 55, 1),
(74, 48, 7, 56, 1),
(75, 49, 7, 57, 1),
(76, 50, 7, 58, 1),
(77, 50, 7, 59, 1),
(78, 49, 7, 60, 1),
(79, 48, 7, 61, 1),
(80, 48, 7, 62, 1),
(81, 50, 7, 63, 1),
(82, 50, 7, 64, 1),
(83, 49, 7, 65, 1),
(84, 48, 7, 66, 1),
(85, 49, 7, 67, 1),
(86, 49, 7, 68, 1),
(87, 12, 7, 69, 1),
(88, 12, 7, 70, 1),
(89, 12, 7, 71, 1),
(90, 13, 7, 72, 1),
(91, 13, 7, 73, 1),
(92, 13, 7, 74, 1),
(93, 14, 7, 75, 1),
(94, 13, 7, 76, 1),
(95, 12, 7, 77, 1),
(96, 13, 7, 78, 1),
(97, 14, 7, 79, 1),
(98, 13, 7, 80, 1),
(99, 12, 7, 81, 1),
(100, 13, 7, 82, 1),
(101, 13, 7, 83, 1),
(102, 13, 7, 84, 1),
(103, 14, 7, 85, 1),
(104, 12, 7, 86, 1),
(105, 12, 7, 87, 1),
(106, 13, 7, 88, 1),
(107, 14, 7, 89, 1),
(108, 50, 7, 90, 1),
(109, 14, 7, 91, 1),
(110, 12, 7, 92, 1),
(111, 12, 7, 93, 1),
(112, 13, 7, 94, 1),
(113, 13, 7, 95, 1),
(114, 13, 7, 96, 1),
(115, 5, 7, 97, 1),
(116, 12, 7, 97, 1),
(117, 13, 7, 97, 1),
(118, 14, 7, 97, 1),
(119, 5, 7, 98, 1),
(120, 12, 7, 98, 1),
(121, 13, 7, 98, 1),
(122, 14, 7, 98, 1),
(123, 5, 7, 99, 1),
(124, 12, 7, 99, 1),
(125, 13, 7, 99, 1),
(126, 14, 7, 99, 1),
(127, 5, 7, 100, 1),
(128, 12, 7, 100, 1),
(129, 13, 7, 100, 1),
(130, 14, 7, 100, 1),
(131, 5, 7, 101, 1),
(132, 12, 7, 101, 1),
(133, 13, 7, 101, 1),
(134, 14, 7, 101, 1),
(135, 5, 7, 102, 1),
(136, 12, 7, 102, 1),
(137, 13, 7, 102, 1),
(138, 14, 7, 102, 1),
(139, 5, 7, 103, 1),
(140, 12, 7, 103, 1),
(141, 13, 7, 103, 1),
(142, 14, 7, 103, 1),
(143, 5, 7, 104, 1),
(144, 12, 7, 104, 1),
(145, 13, 7, 104, 1),
(146, 14, 7, 104, 1),
(147, 13, 7, 105, 1),
(148, 13, 7, 106, 1),
(149, 13, 7, 107, 1),
(150, 13, 7, 108, 1);

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
(38, 'ireneusz.koscielniak@wp.pl', '21232f297a57a5a743894a0e4a801fc3', '5ce209c8056a4c5a104ddac261800806', 1, '2017-08-01 01:32:21', '2017-08-01 01:32:21'),
(42, 'kowal@wp.pl', '406ad751afeccfb309343d71f68d8a78', NULL, 3, '2017-08-07 00:13:49', '2017-08-07 00:13:49'),
(43, 'trenerwuwer@mail.com', '84f0c9fb0ab69acea35dc631fac9234d', NULL, 2, '2017-08-08 12:22:01', '2017-08-08 12:22:01'),
(44, 'treneriskrzycka@mail.com', 'b056dcc848767d6a90b3850ba56ca1cc', NULL, 2, '2017-08-08 12:24:47', '2017-08-08 12:24:47'),
(45, 'trenertora@mail.com', '1cd686affb605c0fb19f20ccdd3c5ef2', NULL, 2, '2017-08-08 12:25:01', '2017-08-08 12:25:01'),
(46, 'trenerogorek@mail.com', '608f8420ff613ece5d1e32e1646f5a47', NULL, 2, '2017-08-08 12:25:17', '2017-08-08 12:25:17'),
(47, 'trenerpapatanasiu@mail.com', 'd675e2ca153198408a886f146c932a9b', NULL, 2, '2017-08-08 12:25:47', '2017-08-08 12:25:47'),
(48, 'ksawerylazar@mail.com', '46fd11508c35f0ea1d1e1e168e4a29bc', NULL, 3, '2017-08-08 13:32:23', '2017-08-08 13:32:23'),
(49, 'bartoszbodak@mail.com', '0e06635877a96c5d76ff466cbf75ba48', NULL, 3, '2017-08-08 13:32:59', '2017-08-08 13:32:59'),
(50, 'igorcholewa@mail.com', '03c78b0fe0ce04fb03a98ddb991aead2', NULL, 3, '2017-08-08 13:33:15', '2017-08-08 13:33:15');

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
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_team` (`id_team`),
  ADD KEY `id_position` (`id_position`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `todo`
--
ALTER TABLE `todo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `id_role` (`id_role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT dla tabeli `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT dla tabeli `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;
--
-- AUTO_INCREMENT dla tabeli `positions`
--
ALTER TABLE `positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT dla tabeli `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT dla tabeli `potential`
--
ALTER TABLE `potential`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT dla tabeli `potential_score`
--
ALTER TABLE `potential_score`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT dla tabeli `potential_test`
--
ALTER TABLE `potential_test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT dla tabeli `raports`
--
ALTER TABLE `raports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT dla tabeli `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT dla tabeli `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT dla tabeli `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT dla tabeli `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT dla tabeli `todo`
--
ALTER TABLE `todo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT dla tabeli `user_data`
--
ALTER TABLE `user_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT dla tabeli `user_notifications`
--
ALTER TABLE `user_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;
--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
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
-- Ograniczenia dla tabeli `user_data`
--
ALTER TABLE `user_data`
  ADD CONSTRAINT `user_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ograniczenia dla tabeli `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

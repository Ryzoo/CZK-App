-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: mysql15.mydevil.net
-- Czas generowania: 01 Sie 2017, 03:21
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
(1, 17, 39, 'testowy komentarz 1', '2017-08-01 02:27:00');

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
(5, 'Wydanie wersji alfa', '2017-08-01 03:04:00', '2017-08-10 03:00:00', '', 1);

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
(13, 'Dodano wydarzenie: \'Wydanie wersji alfa\'', '#!/calendar', '2017-08-01 03:04:48');

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
(17, 39, 5, 'testowy post 1', '2017-08-01 02:26:48');

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
(2, 'Taktyka'),
(3, 'Technika'),
(4, 'Wytrzymałość');

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
(1, 1, 40, 5, 10, '2017-08-01 02:47:56'),
(2, 1, 40, 5, 15, '2017-08-01 02:48:06'),
(3, 1, 41, 5, 9, '2017-08-01 02:48:28'),
(4, 1, 41, 5, 16, '2017-08-01 02:48:34'),
(5, 1, 40, 5, 8, '2017-08-01 02:50:20');

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
(1, 1, 'Bieg 100m', 8.5, 16);

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
(1, 'Trener bramkarzy', 39, 5);

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
(5, 'druzyna testowa 1'),
(6, 'drużyna testowa 2');

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
  `is_master` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `team_members`
--

INSERT INTO `team_members` (`id`, `id_user`, `id_team`, `nr_on_tshirt`, `id_position`, `is_master`) VALUES
(1, 39, 5, 0, 0, 0),
(2, 40, 5, 0, 1, 0),
(3, 41, 5, 2, 0, 0);

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
(1, 38, 'test test', '#f44336', '2017-08-01 01:52:57'),
(2, 38, 'test test 2', '#f44336', '2017-08-01 01:58:24'),
(3, 39, 'test', '#f44336', '2017-08-01 02:21:13');

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
(38, 'koord@mail.com', '21232f297a57a5a743894a0e4a801fc3', '6baeb7d09a205fc5d924698e1ec1ac85', 1, '2017-08-01 01:32:21', '2017-08-01 01:32:21'),
(39, 'trener1@mail.com', '21232f297a57a5a743894a0e4a801fc3', '0b588ec4c4b68e6e1ccfe196f9289215', 2, '2017-08-01 02:18:40', '2017-08-01 02:18:39'),
(40, 'zawodnik1@mail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 3, '2017-08-01 02:30:44', '2017-08-01 02:30:43'),
(41, 'zawodnik2@mail.com', '21232f297a57a5a743894a0e4a801fc3', NULL, 3, '2017-08-01 02:34:43', '2017-08-01 02:34:42');

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
(1, 38, 'Koord', 'admin', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(2, 39, 'trener1', 'trener1nazwisko', '1995-12-07', 'img/users/default.jpg', 'Fajny adres', '', '', '456-789-1223', '', 0, 0, ''),
(3, 40, 'testowy', 'zawodnik1', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, ''),
(4, 41, 'tstowy', 'zawodnik2', NULL, 'img/users/default.jpg', '', '', '', '', '', 0, 0, '');

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
(1, 39, 5, 1, 1),
(2, 1, 5, 2, 1),
(3, 1, 5, 3, 1),
(4, 41, 5, 4, 1),
(5, 40, 5, 5, 1),
(6, 40, 5, 6, 1),
(7, 40, 5, 7, 1),
(8, 40, 5, 8, 1),
(9, 40, 5, 9, 1),
(10, 41, 5, 10, 1),
(11, 41, 5, 11, 1),
(12, 40, 5, 12, 1),
(13, 1, 5, 13, 1),
(14, 2, 5, 13, 1),
(15, 3, 5, 13, 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT dla tabeli `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT dla tabeli `positions`
--
ALTER TABLE `positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT dla tabeli `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT dla tabeli `potential`
--
ALTER TABLE `potential`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT dla tabeli `potential_score`
--
ALTER TABLE `potential_score`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT dla tabeli `potential_test`
--
ALTER TABLE `potential_test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT dla tabeli `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT dla tabeli `todo`
--
ALTER TABLE `todo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT dla tabeli `user_data`
--
ALTER TABLE `user_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT dla tabeli `user_notifications`
--
ALTER TABLE `user_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
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

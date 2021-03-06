app.controller('videoController', function($scope, auth, $rootScope, notify, request, $location) {
    $scope.showContent = false;
    $scope.showVideoPlayer = false;
    $scope.fragmentName = '';
    $scope.fragmentList = [];
    $scope.endFragmentSelect = false;
    $scope.showSendProgressBar = false;
    $scope.stillIsSending = true;
    $scope.analizeList = [];
    $scope.iconList = [];
    $scope.selectedList = [];
    var cutterStart = null;
    var cutterEnd = null;
    var start;
    var end;
    var fullTime;
    var player;
    var progressBar;

    $scope.initVideo = function() {
        request.backend('getVideoIconFull', {}, function(data) {
            $scope.$apply(function() {
                $scope.showContent = true;
                $scope.iconList = data;
            });

            setTimeout(() => {
                $('.tooltipped').tooltip({
                    delay: 50
                });

            }, 500);
        });
    }

    $scope.initOptionsVid = function() {
        request.backend('getVideoIcon', {}, function(data) {
            $scope.$apply(function() {
                $scope.showContent = true;
                $scope.iconList = data;
            });
        });
    }

    $scope.deleteIcon = function(id) {
        request.backend('deleteVideoIcon', { id: id }, function(data) {
            $scope.initOptionsVid();
        }, "Usuwanie przebiegło pomyślnie");
    }


    $(document).off('change', "#iconAdder");
    $(document).on('change', "#iconAdder", function() {
        request.backend('addVideoIcon', new FormData($("#iconAdderForm")[0]), function(data) {
            $scope.initOptionsVid();
        }, "Dodano nową ikonę", true);
    });

    $(document).off('change', ".analizeChecked");
    $(document).on('change', ".analizeChecked", function() {
        const thisElement = $(this);
        $scope.$apply(function() {
            const id = thisElement.attr("id").split("-")[1];
            const notAll = id == 'all' ? false : true;
            if (notAll) {
                if (thisElement.is(':checked')) {
                    addToSelectedList(id);
                } else {
                    deleteFromSelectedList(id);
                }
            } else {
                if (thisElement.is(':checked')) {
                    $scope.selectedList = [];
                    $(".analizeChecked").each(function() {
                        const id = $(this).attr("id").split("-")[1];
                        $(this).prop('checked', true);
                        if (id != 'all') {
                            $scope.selectedList.push(id);
                        }
                    })
                } else {
                    $scope.selectedList = [];
                    $(".analizeChecked").each(function() {
                        const id = $(this).attr("id").split("-")[1];
                        $(this).prop('checked', false);
                    })
                }
            }
        });
    });

    $scope.deleteList = function() {
        $rootScope.showModalWindow("Nieodwracalne usunięcie analiz w liczbie: " + $scope.selectedList.length, function() {
            for (let i = 0; i < $scope.selectedList.length; i++) {
                request.backend('deleteAnalize', { id: $scope.selectedList[i] }, function(data) {});
                for (let j = 0; j < $scope.analizeList.length; j++) {
                    if ($scope.analizeList[j].id == $scope.selectedList[i]) {
                        $scope.$apply(function() {
                            $scope.analizeList.splice(j, 1);
                        });
                        break;
                    }
                }
            }
        });
    }

    function deleteFromSelectedList(id) {
        for (let i = 0; i < $scope.selectedList.length; i++) {
            if ($scope.selectedList[i] == id) {
                $scope.selectedList.splice(i, 1);
                return;
            }
        }
    }

    function addToSelectedList(id) {
        for (let i = 0; i < $scope.selectedList.length; i++) {
            if ($scope.selectedList[i] == id) {
                return;
            }
        }
        $scope.selectedList.push(id);
    }

    $(document).off('change', ".iconInput");
    $(document).on('change', ".iconInput", function() {
        var id = $(this).attr('id').split("-")[1];
        var value = $(this).val();
        $scope.saveIcon(id, value);
    });

    $scope.saveIcon = function(id, value) {
        request.backend('saveVideoIcon', { id, value }, function(data) {});
    }

    $(document).off('click', ".oneIconfToAnalizer");
    $(document).on('click', ".oneIconfToAnalizer", function() {
        var name = $(this).data('analize-name');
        $(".oneIconfToAnalizer").each(function() {
            $(this).removeClass("oneIconfToAnalizerActive");
        });
        $(this).addClass("oneIconfToAnalizerActive");
        $('#fragmentName').val(name);
        $scope.$apply(function() {
            $scope.addFragment();

        });
    });

    $(document).off('change', "#videoToAnalize");
    $(document).on('change', "#videoToAnalize", function() {
        if(!$(this).val() || $(this).val().split('.')[1] != "mp4"){
            notify.localNotify("Uwaga","Wprowadź plik z rozszerzeniem MP4");
            $(this).val("");
            return;
        }
        let source = $('#playerVid');
        source.on('loadedmetadata', function() {
            $scope.$apply(function() {
                $scope.showVideoPlayer = true;
            });
            setTimeout(() => {
                start = 0;
                end = parseFloat(this.duration).toFixed(3);
                fullTime = end - start;
                progressBar = $(this).next().next();
                var playStopButton = $(this).next().find("i").first();
                var resetButton = $(this).next().find("i").eq(1);
                player = this;
                var mainInterval;
                player.currentTime = start;
                addArrowPoint($(this), false);
                addArrowPoint($(this), true, true);

                $('#startIconPoint').draggable({
                    axis: "x",
                    opacity: 0.5,
                    stop: function(e, ui) {
                        var element = $('#startIconPoint');
                        var parent = $('#startIconPoint').parent().parent();
                        if (parseFloat(element.css("left")) < 0) {
                            element.css("left", 0);
                        } else if (parseFloat(element.css("left")) > (parent.width())) {
                            element.css("left", (parent.width()));
                        }
                        var maxWidth = parent.width();
                        var position = parseFloat(element.css("left"));
                        cutterStart = (start + ((position / maxWidth) * fullTime)).toFixed(3);
                        player.currentTime = cutterStart
                        updateProgressAndTime(player, progressBar.find('.currentTime').first(), start, fullTime);
                    }
                });
                $('#endIconPoint').draggable({
                    axis: "x",
                    opacity: 0.5,
                    stop: function(e, ui) {
                        var element = $('#endIconPoint');
                        var parent = $('#endIconPoint').parent().parent();
                        if (parseFloat(element.css("left")) < 0) {
                            element.css("left", 0);
                        } else if (parseFloat(element.css("left")) > (parent.width())) {
                            element.css("left", (parent.width()));
                        }
                        var maxWidth = parent.width();
                        var position = parseFloat(element.css("left"));
                        cutterEnd = (start + ((position / maxWidth) * fullTime)).toFixed(3);
                        player.currentTime = cutterEnd;
                        updateProgressAndTime(player, progressBar.find('.currentTime').first(), start, fullTime);
                    }
                });

                progressBar.on('click', function(e) {
                    var offset = $(this).offset();
                    var position = e.pageX - offset.left;
                    var maxWidth = $(this).width();
                    var time = (start + ((position / maxWidth) * fullTime)).toFixed(3);
                    player.currentTime = time;
                    updateProgressAndTime(player, progressBar.find('.currentTime').first(), start, fullTime);
                });

                resetButton.on('click', function(e) {
                    player.currentTime = start;
                    cutterStart = start;
                    cutterEnd = end;
                    updateProgressAndTime(player, progressBar.find('.currentTime').first(), start, fullTime);
                    stopPlayer(player, mainInterval);
                });

                playStopButton.on('click', function() {
                    var isStop = $(this).hasClass("fa-play-circle");
                    if (isStop) {
                        mainInterval = playPlayer(player, end, progressBar, start, fullTime);
                    } else {
                        stopPlayer(player, mainInterval);
                    }
                });
                updateProgressAndTime(player, progressBar.find('.currentTime').first(), start, fullTime);
            }, 300);
        });
        source[0].src = URL.createObjectURL(this.files[0]);
    });

    $scope.saveAnalize = function() {
        if ($('#analizeName').val().length <= 3) {
            notify.localNotify("Walidacja", "Podaj dłuższą nazwę analizy");
            return;
        }
        if ($('#analizeName').val().length > 100) {
            notify.localNotify("Walidacja", "Podaj krótszą nazwę analizy");
            return;
        }
        if ($('#analizeDescription').val().length > 500) {
            notify.localNotify("Walidacja", "Podaj krótszy opis");
            return;
        }
        if ($scope.fragmentList.length <= 0) {
            notify.localNotify("Walidacja", "Nie wyznaczyłeś żadnych fragmentów z danego klipu video. Wyznacz przynajmniej jeden.");
            return;
        }
        $scope.showSendProgressBar = true;

        var countChunk = 0;
        var fileSize = $('#videoToAnalize').prop('files')[0].size;
        var chunkSize = fileSize < 3000000 ? fileSize / 2 : 3000000;
        var maxChunk = Math.ceil((fileSize / chunkSize));
        $('#videoToAnalize').fileupload({
                maxChunkSize: chunkSize,
                files: $('#videoToAnalize').prop('files')[0],
                url: 'backend/saveVideoClip'
            })
            .on('fileuploadchunkdone', function(e, data) {
                countChunk++;
                $('.progresBarSender').find("span").first().html((parseInt((countChunk / maxChunk) * 100)) + "%");
                $('.progresBarSenderPrc').first().css("width", (parseInt((countChunk / maxChunk) * 100)) + "%");
            })

        $('#videoToAnalize').fileupload("send", {
                maxChunkSize: chunkSize,
                files: $('#videoToAnalize').prop('files')[0],
                url: 'backend/saveVideoClip',
                singleFileUploads: true,
                multipart: false,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4)$/i
            })
            .error(function(result, textStatus, jqXHR) {
                notify.localNotify("Błąd podczas przesyłania", "Przepraszamy nie możemy teraz obsłużyć tego żadania");
                console.log($('#videoToAnalize').prop('files'));
            })
            .complete(function(result, textStatus, jqXHR) {
                notify.localNotify("Zapis na serwerze", "Twój film został właśnie zapisany na serwerze. Poczekaj jeszcze chwilkę");
                $scope.stillIsSending = false;
                request.backend('saveFragments', { usid: $rootScope.user.id, frName: $('#analizeName').val(), frDescription: $('#analizeDescription').val(), frList: $scope.fragmentList, videoName: $('#videoToAnalize').prop('files')[0].name }, function(data) {
                    $scope.$apply(function() {
                        $location.url("/analizeList");
                    });
                }, "Zapis zakończony");
            });
    }

    $scope.deleteAnalize = function(id) {
        $rootScope.showModalWindow("Nieodwracalne usunięcie analizay video", function() {
            request.backend('deleteAnalize', { id: id }, function(data) {
                $scope.$apply(function() {
                    for (let i = 0; i < $scope.analizeList.length; i++) {
                        if ($scope.analizeList[i].id == id) {
                            $scope.analizeList.splice(i, 1);
                            break;
                        }
                    }
                });
            }, "Pomyślnie usunięto");
        });
    }

    $scope.showAnalize = function(id) {
        $rootScope.analizeId = id;
        $rootScope.showWidget('showAnalize', 'VideoAnalizer');
    }


    $scope.loadAnalize = function() {
        request.backend('getAnalizeList', {}, function(data) {
            $scope.$apply(function() {
                $scope.showContent = true;
                $scope.analizeList = data;
            });
        });
    }

    $scope.addFragment = function() {
        if ($('#fragmentName').val().length <= 3) {
            notify.localNotify("Walidacja", "Podaj dłuższą nazwę fragmentu");
            return;
        }
        if ($('#fragmentName').val().length > 100) {
            notify.localNotify("Walidacja", "Podaj krótszą nazwę fragmentu");
            return;
        }
        fragmentName = $('#fragmentName').val();
        var finded = false;
        for (let i = 0; i < $scope.fragmentList.length; i++) {
            if ($scope.fragmentList[i].name == fragmentName) {
                $scope.fragmentList[i].list.push({
                    start: (parseFloat(cutterStart) / 100).toFixed(3),
                    end: (parseFloat(cutterEnd) / 100).toFixed(3)
                });
                finded = true;
                break;
            }
        }
        if (!finded) {
            $scope.fragmentList.push({
                name: fragmentName,
                list: [{
                    start: (parseFloat(cutterStart) / 100).toFixed(3),
                    end: (parseFloat(cutterEnd) / 100).toFixed(3)
                }]
            });
        }
    }

    $scope.editFragment = function(name, index) {
        var time = null;
        var ins = 0;
        for (let i = 0; i < $scope.fragmentList.length; i++) {
            if ($scope.fragmentList[i].name == name) {
                ins = i;
                time = $scope.fragmentList[i].list[index] ? $scope.fragmentList[i].list[index] : null;
                break;
            }
        }
        if (time) {
            $('#playerVid')[0].currentTime = (time.start * 100).toFixed(3);
            cutterStart = (time.start * 100).toFixed(3);
            cutterEnd = (time.end * 100).toFixed(3);
            updatePointPosition();
            $('#fragmentName').val(name);
            $scope.fragmentList[ins].list.splice(index, 1);
            if ($scope.fragmentList[ins].list.length == 0) {
                $scope.fragmentList.splice(ins, 1);
            }
            playPlayer($('#playerVid')[0], end, progressBar, start, fullTime);
            $(".oneIconfToAnalizer").each(function() {
                $(this).removeClass("oneIconfToAnalizerActive");
                if ($(this).data('analize-name') == name) {
                    $(this).addClass("oneIconfToAnalizerActive");
                }
            });
        }
    }

    $(window).resize(function() {
        updatePointPosition();
    });

    function updatePointPosition() {
        var parent = $("#endIconPoint").parent().parent();
        $("#endIconPoint").css("left", (cutterEnd / end) * parent.width());
        $("#startIconPoint").css("left", (cutterStart / end) * parent.width());
    }

    function addArrowPoint(thisEl, isRed, isEnd = false) {
        var player = thisEl;
        var currTimeElement = player.next().next().find('.currentTime').first();
        var positionForArrow = {
            top: -10,
            left: currTimeElement.width()
        }
        if (isEnd) positionForArrow.left = player.next().next().width();
        var colorClass = isRed ? "arrowRed" : "arrowGreen";
        var id = isRed ? "endIconPoint" : "startIconPoint";
        $("#" + id).remove();
        var element = "<div id='" + id + "' class='arrow-up " + colorClass + "'><i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i></div>";

        if (isRed) {
            cutterEnd = player[0].currentTime;
            if (isEnd) cutterEnd = end;
        } else {
            cutterStart = player[0].currentTime;
        }

        element = currTimeElement.append(element);
        $("#" + id).css("top", positionForArrow.top);
        $("#" + id).css("left", positionForArrow.left);
    }

    function stopPlayer(player, interval) {
        $(player).next().find("i").first().removeClass("fa-pause-circle");
        $(player).next().find("i").first().addClass("fa-play-circle");
        player.pause();
        clearInterval(interval);
    }

    function playPlayer(player, end, progressBar, start, fullTime) {
        $(player).next().find("i").first().removeClass("fa-play-circle");
        $(player).next().find("i").first().addClass("fa-pause-circle");
        player.play();

        if (((player.currentTime) < cutterStart)) {
            player.currentTime = cutterStart;
        }

        if (((player.currentTime) >= end) || (cutterEnd != null && (player.currentTime) >= cutterEnd)) {
            player.currentTime = start;
            if (cutterStart != null) player.currentTime = cutterStart;
        }
        var thisInterval;
        thisInterval = setInterval(function() {
            if (((player.currentTime) >= end) || (cutterEnd != null && (player.currentTime) >= cutterEnd)) {
                stopPlayer(player, thisInterval);
                return;
            }
            updateProgressAndTime(player, progressBar.find('.currentTime').first(), start, fullTime);
        }, 30);
        return thisInterval;
    }

    function updateProgressAndTime(player, progressBar, start, fullTime) {
        var actualTime = (Math.ceil(player.currentTime) - start);
        actualTime = actualTime > fullTime ? fullTime : actualTime;
        var percent = (((player.currentTime - start) / fullTime) * 100);
        actualTime = (actualTime / 100).toFixed(2);
        fullTime = (fullTime / 100).toFixed(2);
        $(player).next().next().next().html(actualTime + "<span>/</span>" + fullTime);
        percent = percent > 100 ? 100 : percent;
        progressBar.css('width', percent + "%");
    }

});
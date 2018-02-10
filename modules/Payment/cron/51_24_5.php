
                <?php
                    require "C:\xampp\htdocs\CZK-App\modules\Payment/../../core/vendor/autoload.php";
                    use Core\Notify\Notify;
                    use Modules\Payment\Payment;
                    $payment = new Payment();
                    $payment->addPaymentToUser([
                        "token" => "7c6cc7ec57d28113d4cf09a94efbd928",
                        "userIds" => [51],
                        "tmid" => 5,
                        "amount" => "13",
                        "name" => "asdasdasd",
                        "date_to_pay" => date("Y-m-d", strtotime(date("Y-m-d") . " + 12 days"))
                    ]);
                    $notify = new Notify();
                    $notify->addNotify([
                        "title"=> "Nowa płatność cykliczna: asdasdasd na kwotę: 13 zł",
                        "tmid"=> 5,
                        "token"=> "7c6cc7ec57d28113d4cf09a94efbd928",
                        "to"=> [51],
                        "toAll"=> false,
                        "url"=> "#!/clientPayment"
                    ]);
                
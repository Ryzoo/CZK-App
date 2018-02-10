
                <?php
                    require "C:\xampp\htdocs\CZK-App\modules\Payment/../../core/vendor/autoload.php";
                    use Core\Notify\Notify;
                    use Modules\Payment\Payment;
                    $payment = new Payment();
                    $payment->addPaymentToUser([
                        "token" => "7c6cc7ec57d28113d4cf09a94efbd928",
                        "userIds" => [44],
                        "tmid" => 5,
                        "amount" => "13",
                        "name" => "asdcs",
                        "date_to_pay" => date("Y-m-d", strtotime(date("Y-m-d") . " + 123 days"))
                    ]);
                    $notify = new Notify();
                    $notify->addNotify([
                        "title"=> "Nowa płatność cykliczna: asdcs na kwotę: 13 zł",
                        "tmid"=> 5,
                        "token"=> "7c6cc7ec57d28113d4cf09a94efbd928",
                        "to"=> [44],
                        "toAll"=> false,
                        "url"=> "#!/clientPayment"
                    ]);
                

                <?php
                    require "C:\xampp\htdocs\CZK-App\modules\Payment/../../core/vendor/autoload.php";
                    use Core\Notify\Notify;
                    use Modules\Payment\Payment;
                    $payment = new Payment();
                    $payment->addPaymentToUser([
                        "token" => "7c6cc7ec57d28113d4cf09a94efbd928",
                        "userIds" => [47],
                        "tmid" => 5,
                        "amount" => "123",
                        "name" => "asdasdd",
                        "date_to_pay" => date("Y-m-d", strtotime(date("Y-m-d") . " + 32 days"))
                    ]);
                    $notify = new Notify();
                    $notify->addNotify([
                        "title"=> "Nowa płatność cykliczna: asdasdd na kwotę: 123 zł",
                        "tmid"=> 5,
                        "token"=> "7c6cc7ec57d28113d4cf09a94efbd928",
                        "to"=> [47],
                        "toAll"=> false,
                        "url"=> "#!/clientPayment"
                    ]);
                
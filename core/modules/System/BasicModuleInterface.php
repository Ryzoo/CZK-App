<?php
namespace Core\System;

interface BasicModuleInterface
{
    public function install();
    public function uninstall();
}
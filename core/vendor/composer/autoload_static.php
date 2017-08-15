<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInite57f52ab30cfd8e4170d5ddf72289b24
{
    public static $files = array (
        '913619c86babbb902e7ffc6850548285' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/functions.php',
    );

    public static $prefixLengthsPsr4 = array (
        'T' => 
        array (
            'Test\\' => 5,
        ),
        'S' => 
        array (
            'System\\' => 7,
            'Simplon\\Mysql\\' => 14,
            'Seld\\JsonLint\\' => 14,
        ),
        'M' => 
        array (
            'Modules\\' => 8,
        ),
        'K' => 
        array (
            'KHerGe\\JSON\\' => 12,
            'KHerGe\\File\\' => 12,
        ),
        'J' => 
        array (
            'JsonSchema\\' => 11,
        ),
        'C' => 
        array (
            'Core\\' => 5,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Test\\' => 
        array (
            0 => __DIR__ . '/..' . '/simplon/mysql/test',
        ),
        'System\\' => 
        array (
            0 => __DIR__ . '/../..' . '/system',
        ),
        'Simplon\\Mysql\\' => 
        array (
            0 => __DIR__ . '/..' . '/simplon/mysql/src',
        ),
        'Seld\\JsonLint\\' => 
        array (
            0 => __DIR__ . '/..' . '/seld/jsonlint/src/Seld/JsonLint',
        ),
        'Modules\\' => 
        array (
            0 => __DIR__ . '/../..' . '/../modules',
        ),
        'KHerGe\\JSON\\' => 
        array (
            0 => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON',
        ),
        'KHerGe\\File\\' => 
        array (
            0 => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File',
        ),
        'JsonSchema\\' => 
        array (
            0 => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema',
        ),
        'Core\\' => 
        array (
            0 => __DIR__ . '/../..' . '/modules',
        ),
    );

    public static $classMap = array (
        'Core\\Auth' => __DIR__ . '/../..' . '/modules/Auth/Auth.php',
        'Core\\Database' => __DIR__ . '/../..' . '/modules/Database/Database.php',
        'Core\\Settings' => __DIR__ . '/../..' . '/modules/Settings/Settings.php',
        'JsonSchema\\Constraints\\CollectionConstraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/CollectionConstraint.php',
        'JsonSchema\\Constraints\\Constraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/Constraint.php',
        'JsonSchema\\Constraints\\ConstraintInterface' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/ConstraintInterface.php',
        'JsonSchema\\Constraints\\EnumConstraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/EnumConstraint.php',
        'JsonSchema\\Constraints\\Factory' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/Factory.php',
        'JsonSchema\\Constraints\\FormatConstraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/FormatConstraint.php',
        'JsonSchema\\Constraints\\NumberConstraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/NumberConstraint.php',
        'JsonSchema\\Constraints\\ObjectConstraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/ObjectConstraint.php',
        'JsonSchema\\Constraints\\SchemaConstraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/SchemaConstraint.php',
        'JsonSchema\\Constraints\\StringConstraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/StringConstraint.php',
        'JsonSchema\\Constraints\\TypeCheck\\LooseTypeCheck' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/TypeCheck/LooseTypeCheck.php',
        'JsonSchema\\Constraints\\TypeCheck\\StrictTypeCheck' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/TypeCheck/StrictTypeCheck.php',
        'JsonSchema\\Constraints\\TypeCheck\\TypeCheckInterface' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/TypeCheck/TypeCheckInterface.php',
        'JsonSchema\\Constraints\\TypeConstraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/TypeConstraint.php',
        'JsonSchema\\Constraints\\UndefinedConstraint' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Constraints/UndefinedConstraint.php',
        'JsonSchema\\Entity\\JsonPointer' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Entity/JsonPointer.php',
        'JsonSchema\\Exception\\ExceptionInterface' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Exception/ExceptionInterface.php',
        'JsonSchema\\Exception\\InvalidArgumentException' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Exception/InvalidArgumentException.php',
        'JsonSchema\\Exception\\InvalidSchemaMediaTypeException' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Exception/InvalidSchemaMediaTypeException.php',
        'JsonSchema\\Exception\\InvalidSourceUriException' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Exception/InvalidSourceUriException.php',
        'JsonSchema\\Exception\\JsonDecodingException' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Exception/JsonDecodingException.php',
        'JsonSchema\\Exception\\ResourceNotFoundException' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Exception/ResourceNotFoundException.php',
        'JsonSchema\\Exception\\RuntimeException' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Exception/RuntimeException.php',
        'JsonSchema\\Exception\\UnresolvableJsonPointerException' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Exception/UnresolvableJsonPointerException.php',
        'JsonSchema\\Exception\\UriResolverException' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Exception/UriResolverException.php',
        'JsonSchema\\Iterator\\ObjectIterator' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Iterator/ObjectIterator.php',
        'JsonSchema\\Rfc3339' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Rfc3339.php',
        'JsonSchema\\SchemaStorage' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/SchemaStorage.php',
        'JsonSchema\\SchemaStorageInterface' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/SchemaStorageInterface.php',
        'JsonSchema\\UriResolverInterface' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/UriResolverInterface.php',
        'JsonSchema\\UriRetrieverInterface' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/UriRetrieverInterface.php',
        'JsonSchema\\Uri\\Retrievers\\AbstractRetriever' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Uri/Retrievers/AbstractRetriever.php',
        'JsonSchema\\Uri\\Retrievers\\Curl' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Uri/Retrievers/Curl.php',
        'JsonSchema\\Uri\\Retrievers\\FileGetContents' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Uri/Retrievers/FileGetContents.php',
        'JsonSchema\\Uri\\Retrievers\\PredefinedArray' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Uri/Retrievers/PredefinedArray.php',
        'JsonSchema\\Uri\\Retrievers\\UriRetrieverInterface' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Uri/Retrievers/UriRetrieverInterface.php',
        'JsonSchema\\Uri\\UriResolver' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Uri/UriResolver.php',
        'JsonSchema\\Uri\\UriRetriever' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Uri/UriRetriever.php',
        'JsonSchema\\Validator' => __DIR__ . '/..' . '/justinrainbow/json-schema/src/JsonSchema/Validator.php',
        'KHerGe\\File\\CSV' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/CSV.php',
        'KHerGe\\File\\CSVInterface' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/CSVInterface.php',
        'KHerGe\\File\\Exception\\CursorException' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Exception/CursorException.php',
        'KHerGe\\File\\Exception\\Exception' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Exception/Exception.php',
        'KHerGe\\File\\Exception\\LockException' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Exception/LockException.php',
        'KHerGe\\File\\Exception\\PathException' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Exception/PathException.php',
        'KHerGe\\File\\Exception\\ReadException' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Exception/ReadException.php',
        'KHerGe\\File\\Exception\\ResourceException' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Exception/ResourceException.php',
        'KHerGe\\File\\Exception\\TempException' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Exception/TempException.php',
        'KHerGe\\File\\Exception\\WriteException' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Exception/WriteException.php',
        'KHerGe\\File\\File' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/File.php',
        'KHerGe\\File\\FileInterface' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/FileInterface.php',
        'KHerGe\\File\\Memory' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Memory.php',
        'KHerGe\\File\\Stream' => __DIR__ . '/..' . '/kherge/file-manager/src/KHerGe/File/Stream.php',
        'KHerGe\\JSON\\Exception\\DecodeException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/DecodeException.php',
        'KHerGe\\JSON\\Exception\\Decode\\ControlCharacterException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Decode/ControlCharacterException.php',
        'KHerGe\\JSON\\Exception\\Decode\\DepthException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Decode/DepthException.php',
        'KHerGe\\JSON\\Exception\\Decode\\StateMismatchException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Decode/StateMismatchException.php',
        'KHerGe\\JSON\\Exception\\Decode\\SyntaxException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Decode/SyntaxException.php',
        'KHerGe\\JSON\\Exception\\Decode\\UTF8Exception' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Decode/UTF8Exception.php',
        'KHerGe\\JSON\\Exception\\EncodeException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/EncodeException.php',
        'KHerGe\\JSON\\Exception\\Encode\\DepthException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Encode/DepthException.php',
        'KHerGe\\JSON\\Exception\\Encode\\InfiniteOrNotANumberException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Encode/InfiniteOrNotANumberException.php',
        'KHerGe\\JSON\\Exception\\Encode\\InvalidPropertyNameException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Encode/InvalidPropertyNameException.php',
        'KHerGe\\JSON\\Exception\\Encode\\RecursionException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Encode/RecursionException.php',
        'KHerGe\\JSON\\Exception\\Encode\\UnsupportedTypeException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Encode/UnsupportedTypeException.php',
        'KHerGe\\JSON\\Exception\\Exception' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/Exception.php',
        'KHerGe\\JSON\\Exception\\LintingException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/LintingException.php',
        'KHerGe\\JSON\\Exception\\UnknownException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/UnknownException.php',
        'KHerGe\\JSON\\Exception\\ValidationException' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/Exception/ValidationException.php',
        'KHerGe\\JSON\\JSON' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/JSON.php',
        'KHerGe\\JSON\\JSONInterface' => __DIR__ . '/..' . '/kherge/json/src/KHerGe/JSON/JSONInterface.php',
        'Modules\\Dashboard' => __DIR__ . '/../..' . '/../modules/Dashboard/Dashboard.php',
        'Modules\\News' => __DIR__ . '/../..' . '/../modules/News/News.php',
        'Modules\\Notify' => __DIR__ . '/../..' . '/../modules/Notify/Notify.php',
        'Modules\\Players' => __DIR__ . '/../..' . '/../modules/Players/Players.php',
        'Modules\\Post' => __DIR__ . '/../..' . '/../modules/Post/Post.php',
        'Modules\\Raports' => __DIR__ . '/../..' . '/../modules/Raports/Raports.php',
        'Modules\\Staff' => __DIR__ . '/../..' . '/../modules/Staff/Staff.php',
        'Modules\\Stats' => __DIR__ . '/../..' . '/../modules/Stats/Stats.php',
        'Modules\\Teams' => __DIR__ . '/../..' . '/../modules/Teams/Teams.php',
        'Modules\\Todo' => __DIR__ . '/../..' . '/../modules/Todo/Todo.php',
        'Seld\\JsonLint\\DuplicateKeyException' => __DIR__ . '/..' . '/seld/jsonlint/src/Seld/JsonLint/DuplicateKeyException.php',
        'Seld\\JsonLint\\JsonParser' => __DIR__ . '/..' . '/seld/jsonlint/src/Seld/JsonLint/JsonParser.php',
        'Seld\\JsonLint\\Lexer' => __DIR__ . '/..' . '/seld/jsonlint/src/Seld/JsonLint/Lexer.php',
        'Seld\\JsonLint\\ParsingException' => __DIR__ . '/..' . '/seld/jsonlint/src/Seld/JsonLint/ParsingException.php',
        'Seld\\JsonLint\\Undefined' => __DIR__ . '/..' . '/seld/jsonlint/src/Seld/JsonLint/Undefined.php',
        'Simplon\\Mysql\\Crud\\CrudManager' => __DIR__ . '/..' . '/simplon/mysql/src/Crud/CrudManager.php',
        'Simplon\\Mysql\\Crud\\CrudModel' => __DIR__ . '/..' . '/simplon/mysql/src/Crud/CrudModel.php',
        'Simplon\\Mysql\\Crud\\CrudModelInterface' => __DIR__ . '/..' . '/simplon/mysql/src/Crud/CrudModelInterface.php',
        'Simplon\\Mysql\\Crud\\CrudStore' => __DIR__ . '/..' . '/simplon/mysql/src/Crud/CrudStore.php',
        'Simplon\\Mysql\\Crud\\CrudStoreInterface' => __DIR__ . '/..' . '/simplon/mysql/src/Crud/CrudStoreInterface.php',
        'Simplon\\Mysql\\Mysql' => __DIR__ . '/..' . '/simplon/mysql/src/Mysql.php',
        'Simplon\\Mysql\\MysqlException' => __DIR__ . '/..' . '/simplon/mysql/src/MysqlException.php',
        'Simplon\\Mysql\\MysqlQueryIterator' => __DIR__ . '/..' . '/simplon/mysql/src/MysqlQueryIterator.php',
        'Simplon\\Mysql\\PDOConnector' => __DIR__ . '/..' . '/simplon/mysql/src/PDOConnector.php',
        'Simplon\\Mysql\\QueryBuilder\\CreateQueryBuilder' => __DIR__ . '/..' . '/simplon/mysql/src/QueryBuilder/CreateQueryBuilder.php',
        'Simplon\\Mysql\\QueryBuilder\\DeleteQueryBuilder' => __DIR__ . '/..' . '/simplon/mysql/src/QueryBuilder/DeleteQueryBuilder.php',
        'Simplon\\Mysql\\QueryBuilder\\ReadQueryBuilder' => __DIR__ . '/..' . '/simplon/mysql/src/QueryBuilder/ReadQueryBuilder.php',
        'Simplon\\Mysql\\QueryBuilder\\UpdateQueryBuilder' => __DIR__ . '/..' . '/simplon/mysql/src/QueryBuilder/UpdateQueryBuilder.php',
        'System\\BasicModule' => __DIR__ . '/../..' . '/system/BasicModule.php',
        'System\\BasicModuleInterface' => __DIR__ . '/../..' . '/system/BasicModuleInterface.php',
        'System\\Route' => __DIR__ . '/../..' . '/system/Route.php',
        'Test\\Crud\\NameModel' => __DIR__ . '/..' . '/simplon/mysql/test/Crud/NameModel.php',
        'Test\\Crud\\NamesStore' => __DIR__ . '/..' . '/simplon/mysql/test/Crud/NamesStore.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInite57f52ab30cfd8e4170d5ddf72289b24::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInite57f52ab30cfd8e4170d5ddf72289b24::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInite57f52ab30cfd8e4170d5ddf72289b24::$classMap;

        }, null, ClassLoader::class);
    }
}

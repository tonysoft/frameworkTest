var yaml = require('js-yaml'),
    fs = require('fs'),
    serialize = require('node-serialize'),
    beautify = require('js-beautify').js_beautify,
    swig = require('swig'),
    async = require('async'),
    path = require('path'),
    colors = require('colors'),
    fsx = require('fs-extra');

module.exports = function (ymlFileName) {
    var serverDir = process.cwd() + '/server/';
    var modelsDir = serverDir + 'models';
    var pathList = [];
    if(undefined != ymlFileName ) {
        pathList.push(serverDir + 'schema/' + ymlFileName);
    }else {
        var list = fs.readdirSync(serverDir + 'schema')
        list.forEach(function (file) {
            pathList.push(serverDir + 'schema/' + file);
        });
    }
    console.log(('Scaffolding Started :  ' ).green );
    async.parallel([
        function (callback) {
            genControllers(pathList, serverDir, function (err) {
                callback();
            });
        },

        function (callback) {
            genModels(pathList, serverDir, function (err) {
                callback();
            });
        },

        function (callback) {
            genControllerTestCases(pathList, serverDir, function (err) {
                callback();
            });
        }

    ], function callback() {
        console.log("scaffolding completed".green);
    });
};

var genModels = function (ymlFileList, serverDir, done) {

    async.eachSeries(ymlFileList,

        function (file, next1) {

            fs.readFile(file, 'utf8', function (err, data) {

                var yamlDoc = yaml.safeLoad(data);
                var modelList = [];
                var models= yamlDoc.models;
                var k=Object.keys(models);
                for (var key in models) {
                    modelList.push(models[key]);
                }
                async.eachSeries(modelList,

                    function (obj, next2) {

                        var model = obj ;
                        var modelName = model.id;
                        if (typeof model.adapter != "undefined") {
                            if (model.adapter == 'oracle' || model.adapter == 'Oracle') {
                                var modelTemplate = swig.compileFile(path.join(serverDir, 'templates/models/modelPersist.html'));
                            } else {
                                var modelTemplate = swig.compileFile(path.join(serverDir, 'templates/models/modelWaterline.html'));
                            }
                            console.log(( 'Generating Models:  ' + modelName + '\n---------------------------------------------'));

                            var modelContent = modelTemplate({
                                modelName: modelName,
                                model: modelName,
                                adapter: model.adapter,
                                connection: model.connection,
                                attributes: model.properties
                            });

                            // convert this to async
                            var modelDirectory = serverDir + 'models';
                            if (!fs.existsSync(modelDirectory)) {
                                fs.mkdir(modelDirectory);
                            }

                            fs.writeFile(modelDirectory + '/' + modelName + '.js', beautify(modelContent, { indent_size: 2 }), function (err) {
                                next2();
                            });
                        } else {
                            next2();
                        }
                    },

                    function (err) {
                        next1();
                    }
                );

            });

        },

        function (err) {
            done(err);
        }
    );
};


var genControllerTestCases = function (ymlFileList, serverDir, done) {

    async.eachSeries(ymlFileList,

        function (file, next1) {

            var fileName = file.split("/").pop().replace(/\.[^\.]+$/, '');
            var controllerName = fileName + 'Controller';
            var unitTestCaseName = fileName + "UnitTest";
            var integTestCaseName = fileName + "IntegrationTest";

            fs.readFile(file, 'utf8', function (err, data) {

                var yamlDoc = yaml.safeLoad(data);

                var testCaseTemplate, unitTestParentDirectory,unitTestControllerDirectory,integrationTestControllerDirectory,integrationTestParentDirectory,controllerUnitTestCaseTemplate,controllerIntegrationTestCaseTemplate;

                console.log(( 'Generating Test Cases:  ' + controllerName + '\n---------------------------------------------'));

                controllerUnitTestCaseTemplate = swig.compileFile(path.join(serverDir, 'templates','tests','unit','controllerUnitTest.html'));
                controllerIntegrationTestCaseTemplate = swig.compileFile(path.join(serverDir, 'templates','tests','integration','controllerIntegrationTest.html'));

                var controllerUnitTestCaseContents = controllerUnitTestCaseTemplate({
                    testCaseName: unitTestCaseName,
                    controllerName: controllerName,
                    operations: yamlDoc.apis[0].operations,
                    path:yamlDoc.apis[0].path,
                    modelName: Object.keys(yamlDoc.models)[0]
                });

                var controllerIntegrationTestCaseContents = controllerIntegrationTestCaseTemplate({
                    testCaseName: integTestCaseName,
                    controllerName: controllerName,
                    operations: yamlDoc.apis[0].operations,
                    path:yamlDoc.apis[0].path,
                    modelName: Object.keys(yamlDoc.models)[0]
                });

                unitTestParentDirectory = serverDir + 'tests/unit';
                integrationTestParentDirectory = serverDir + 'tests/integration';
                unitTestControllerDirectory = unitTestParentDirectory + '/controllers';
                integrationTestControllerDirectory = integrationTestParentDirectory + '/controllers';

                // convert this to async
                if (!fs.existsSync(unitTestControllerDirectory)) {
                    fsx.mkdirsSync(unitTestControllerDirectory);
                }
                if (!fs.existsSync(integrationTestControllerDirectory)) {
                    fsx.mkdirsSync(integrationTestControllerDirectory);
                }
                //write the unit and integration test content

                fs.writeFile(unitTestControllerDirectory + '/' + unitTestCaseName + '.js', beautify(controllerUnitTestCaseContents, { indent_size: 2 }), function (err) {
                });
                fs.writeFile(integrationTestControllerDirectory + '/' + integTestCaseName + '.js', beautify(controllerIntegrationTestCaseContents, { indent_size: 2 }), function (err) {
                });
                next1();

            });

        },

        function (err) {
            done(err);
        }
    );

};
var genControllers = function (ymlFileList, serverDir, done) {

    async.eachSeries(ymlFileList,

        function (file, next1) {

            var fileName = file.split("/").pop().replace(/\.[^\.]+$/, '');
            var controllerName = fileName + 'Controller';
            var routerName = fileName + 'Router';

            fs.readFile(file, 'utf8', function (err, data) {

                var yamlDoc = yaml.safeLoad(data);

                var eachAPI, eachAPIDetails, controllerFileName,
                    httpMethod, controllerTemplate, routeTemplate, controllerDirectory, routeDirectory,
                    apisMethods = serialize.serialize(yamlDoc.apis).toString();

                console.log('Generating Controller :  ' + controllerName );
                console.log(( 'Generating Routes :  ' + routerName + '\n ---------------------------------------------'));
                controllerTemplate = swig.compileFile(path.join(serverDir, 'templates','controller.html'));
                routeTemplate = swig.compileFile(path.join(serverDir, 'templates','router.html'));

                async.parallel([

                    function (callback) {

                            //operations: yamlDoc.apis[0].operations,
                        var controllerContents = controllerTemplate({
                            controllerName: controllerName,
                            apiMethods: yamlDoc.apis,
                            modelNames: Object.keys(yamlDoc.models)
                        });

                        // convert this to async
                        var controllerDirectory = serverDir + 'controllers';
                        if (!fs.existsSync(controllerDirectory)) {
                            fs.mkdir(controllerDirectory);
                        }

                        fs.writeFile(controllerDirectory + '/' + controllerName + '.js', beautify(controllerContents, { indent_size: 2 }), function (err) {
                            callback();
                        });

                    },

                    function (callback) {
                        for (var i = 0; i < yamlDoc.apis.length; i++) {
                            while (yamlDoc.apis[i].path.indexOf('/{') >= 0) {
                                yamlDoc.apis[i].path = yamlDoc.apis[i].path.replace('/{', '/:');
                            }
                            while (yamlDoc.apis[i].path.indexOf('}/') >= 0) {
                                yamlDoc.apis[i].path = yamlDoc.apis[i].path.replace('}/', '/');
                            }
                            while (yamlDoc.apis[i].path.indexOf('}?') >= 0) {
                                yamlDoc.apis[i].path = yamlDoc.apis[i].path.replace('}?', '?');
                            }
                            if ((yamlDoc.apis[i].path.indexOf('}') >= 0) && (yamlDoc.apis[i].path.indexOf('{') < 0)) {
                                yamlDoc.apis[i].path = yamlDoc.apis[i].path.replace('}', '');
                            }
                        }
                        var routeContents = routeTemplate({
                            routerName: routerName,
                            controllerName: controllerName,
                            apiMethods: yamlDoc.apis
                        });

                        // convert this to async
                        routeDirectory = serverDir + 'routes';
                        if (!fs.existsSync(routeDirectory)) {
                            fs.mkdir(routeDirectory);
                        }

                        fs.writeFile(routeDirectory + '/' + routerName + '.js', beautify(routeContents, { indent_size: 2 }), function (err) {
                            callback();
                        });
                    }

                ], function (err) {
                    next1();
                });

            });

        },

        function (err) {
            done(err);
        }
    );
}

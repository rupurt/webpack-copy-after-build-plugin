import webpack from 'webpack';
import path from 'path'
import WebpackCopyAfterBuildPlugin from '../index.js';
import fs from 'fs'
import fse from 'fs-extra'

let options = {
    entry:{
        application: [
            path.resolve(__dirname, 'assets/application.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    mode: 'production',
    plugins: [
        new WebpackCopyAfterBuildPlugin({
            application:
                ['../copied_bundles_one/application.js',
                    '../copied_bundles_two/application.js']
        })
    ]
};

let path_bundles_one = path.resolve(__dirname, '../copied_bundles_one');
let path_bundles_two = path.resolve(__dirname, '../copied_bundles_two');
let path_bundles_assets = path.resolve(__dirname, '../copied-assets');
let path_bundles_one_withdirname = path.resolve(__dirname, '../withdirname');

let cleanUp = () =>  {
    fse.removeSync(path_bundles_one);
    fse.removeSync(path_bundles_two);
    fse.removeSync(path_bundles_assets);
    fse.removeSync(path_bundles_one_withdirname);
};

beforeEach( (done) => {
    cleanUp();
    done();
});

afterEach( (done) => {
    cleanUp();
    done();
});


it('Should copy a bundle to the provided folder', () => {
    options.plugins = [
        new WebpackCopyAfterBuildPlugin('done', {
            application: '../copied_bundles_one/application.js'
        }, {
            absoluteMappingPaths: false
        })
    ];
    webpack(options, function(err, stats) {
        if (err) {
            console.log('err', err);
        } else if (stats.hasErrors()) {
            console.log('stats:', stats.toString());
        }
        expect(stats.toJson().chunks.length).toEqual(1);
        expect(fs.existsSync(path.resolve(__dirname, '../copied_bundles_one/application.js'))).toBeTruthy();
        expect(fs.existsSync(path.resolve(__dirname, '../copied_bundles_two/application.js'))).toBeFalsy();
    });
});

it('Should copy a bundle to the provided folder into the given directory', () => {
    options.plugins = [
        new WebpackCopyAfterBuildPlugin('done', {
            application: 'copied_bundles_one/application.js'
        }, {
            dirname: path.resolve(__dirname, '../withdirname'),
            absoluteMappingPaths: false
        })
    ];
    webpack(options, function(err, stats) {
        if (err) {
            console.log('err', err);
        } else if (stats.hasErrors()) {
            console.log('stats:', stats.toString());
        }
        expect(stats.toJson().chunks.length).toEqual(1);
        expect(fs.existsSync(path.resolve(__dirname, '../withdirname/copied_bundles_one/application.js'))).toBeTruthy();
    });
});

it('Should copy a bundle to the provided folders', (done) => {
    options.plugins = [
        new WebpackCopyAfterBuildPlugin('done', {
            application:
                ['../copied_bundles_one/application.js',
                    '../copied_bundles_two/application.js']
        }, {
            absoluteMappingPaths: false
        })
    ];
    webpack(options, function(err, stats) {
        if (err) {
            console.log('err', err);
        } else if (stats.hasErrors()) {
            console.log('stats:', stats.toString());
        }
        expect(stats.toJson().chunks.length).toEqual(1);
        expect(fs.existsSync(path.resolve(__dirname, '../copied_bundles_one/application.js'))).toBeTruthy();
        expect(fs.existsSync(path.resolve(__dirname, '../copied_bundles_two/application.js'))).toBeTruthy();
        done();
    });
});

it('Should copy a bundle to the provided folders with absoluteMappingPaths', (done) => {
    options.plugins = [
        new WebpackCopyAfterBuildPlugin('done', {
            application:
                [path.resolve(__dirname, '../copied_bundles_one/application.js'),
                    path.resolve(__dirname, '../copied_bundles_two/application.js')]
        }, {
            absoluteMappingPaths: true
        })
    ];
    webpack(options, function(err, stats) {
        if (err) {
            console.log('err', err);
        } else if (stats.hasErrors()) {
            console.log('stats:', stats.toString());
        }
        expect(stats.toJson().chunks.length).toEqual(1);
        expect(fs.existsSync(path.resolve(__dirname, '../copied_bundles_one/application.js'))).toBeTruthy();
        expect(fs.existsSync(path.resolve(__dirname, '../copied_bundles_two/application.js'))).toBeTruthy();
        done();
    });
});

it('Should copy folders', (done) => {
    options.plugins = [
        new WebpackCopyAfterBuildPlugin('done', {
        }, {
            dirname: __dirname,
            absoluteMappingPaths: false
        }, [
            ['./assets', '../copied-assets']
        ])
    ];

    webpack(options, function(err, stats) {
        if (err) {
            console.log('err', err);
        } else if (stats.hasErrors()) {
            console.log('stats:', stats.toString());
        }
        expect(fs.existsSync(path.resolve(__dirname, '../copied-assets'))).toBeTruthy();
        done();
    });
});

it('Should copy folders with absolute paths', (done) => {
    options.plugins = [
        new WebpackCopyAfterBuildPlugin('done', {
        }, {
        }, [
            [path.resolve(__dirname,'./assets'), path.resolve(__dirname,'../copied-assets')]
        ])
    ];

    webpack(options, function(err, stats) {
        if (err) {
            console.log('err', err);
        } else if (stats.hasErrors()) {
            console.log('stats:', stats.toString());
        }
        expect(fs.existsSync(path.resolve(__dirname, '../copied-assets'))).toBeTruthy();
        done();
    });
});
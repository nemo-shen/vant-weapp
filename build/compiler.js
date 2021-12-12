const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const less = require('gulp-less');
const insert = require('gulp-insert');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const ts = require('gulp-typescript');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const src = path.resolve(__dirname, '../packages');
const icons = path.resolve(__dirname, '../node_modules/@vant/icons');

const libConfig = path.resolve(__dirname, '../tsconfig.lib.json');
const esConfig = path.resolve(__dirname, '../tsconfig.json');
const exampleConfig = path.resolve(__dirname, '../tsconfig.example.json');

const libDir = path.resolve(__dirname, '../lib');
const esDir = path.resolve(__dirname, '../dist');
const exampleDistDir = path.resolve(__dirname, '../example/dist');
const examplePagesDir = path.resolve(__dirname, '../example/pages');

const exampleAppJsonPath = path.resolve(__dirname, '../example/app.json');
const baseCssPath = path.resolve(__dirname, '../packages/common/index.wxss');

const lessCompiler = (dist) =>
  function compileLess() {
    const srcPath = [`${src}/**/*.less`];
    if ([esDir, libDir].indexOf(dist) !== -1) {
      srcPath.push(`!${src}/**/demo/**/*.less`);
    }
    return gulp
      .src(srcPath)
      .pipe(less())
      .pipe(postcss())
      .pipe(
        insert.transform((contents, file) => {
          if (!file.path.includes('packages' + path.sep + 'common')) {
            const relativePath = path
              .relative(
                path.normalize(`${file.path}${path.sep}..`),
                baseCssPath
              )
              .replace(/\\/g, '/');
            contents = `@import '${relativePath}';${contents}`;
          }
          return contents;
        })
      )
      .pipe(rename({ extname: '.wxss' }))
      .pipe(gulp.dest(dist));
  };

const tsCompiler = (dist, config) =>
  function compileTs() {
    const tsProject = ts.createProject(config);
    return tsProject
      .src()
      .pipe(tsProject())
      .js.pipe(
        insert.transform((contents, file) => {
          if (dist === exampleDistDir && file.path.includes('/demo/')) {
            contents = contents.replace(
              '@vant/icons/src/config',
              '../../@vant/icons/src/config'
            );
          }
          return contents;
        })
      )
      .pipe(gulp.dest(dist));
  };

const copier = (dist, ext) =>
  function copy() {
    const srcPath = [`${src}/**/*.${ext}`];
    if ([esDir, libDir].indexOf(dist) !== -1) {
      srcPath.push(`!${src}/**/demo/**/*.${ext}`);
    }
    return gulp
      .src(srcPath)
      .pipe(
        insert.transform((contents, file) => {
          if (ext === 'json' && file.path.includes('/demo/')) {
            contents = contents.replace('/example', '');
          }
          return contents;
        })
      )
      .pipe(gulp.dest(dist));
  };

const staticCopier = (dist) =>
  gulp.parallel(
    copier(dist, 'wxml'),
    copier(dist, 'wxs'),
    copier(dist, 'json')
  );

const cleaner = (path) =>
  function clean() {
    return exec(`npx rimraf ${path}`);
  };

const tasks = [
  ['buildEs', esDir, esConfig],
  ['buildLib', libDir, libConfig],
].reduce((prev, [name, ...args]) => {
  prev[name] = gulp.series(
    cleaner(...args),
    gulp.parallel(
      tsCompiler(...args),
      lessCompiler(...args),
      staticCopier(...args)
    )
  );
  return prev;
}, {});

tasks.buildExample = gulp.series(
  cleaner(exampleDistDir),
  gulp.parallel(
    tsCompiler(exampleDistDir, exampleConfig),
    lessCompiler(exampleDistDir),
    staticCopier(exampleDistDir),
    () =>
      gulp
        .src(`${icons}/**/*`)
        .pipe(gulp.dest(`${exampleDistDir}/@vant/icons`)),
    () => {
      const appJson = JSON.parse(fs.readFileSync(exampleAppJsonPath));
      appJson.pages.forEach((path) => {
        const component = path.replace(/(pages\/|\/index)/g, '');
        fs.writeFileSync(
          `${examplePagesDir}/${component}/index.js`,
          "import Page from '../../common/page';\n\nPage();"
        );
        fs.writeFileSync(
          `${examplePagesDir}/${component}/index.wxml`,
          `<van-${component}-demo />`
        );
      });
    },
    () => {
      gulp.watch(`${src}/**/*.less`, lessCompiler(exampleDistDir));
      gulp.watch(`${src}/**/*.wxml`, copier(exampleDistDir, 'wxml'));
      gulp.watch(`${src}/**/*.wxs`, copier(exampleDistDir, 'wxs'));
      gulp.watch(`${src}/**/*.json`, copier(exampleDistDir, 'json'));
    }
  )
);

module.exports = tasks;

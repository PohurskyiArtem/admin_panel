const M = require("minimatch");

const gulp = require("gulp"),
    dist = "C:\\xampp\\htdocs\\react_admin\\admin",
    webpack = require('webpack-stream'),
    sass = require("gulp-sass"),
    prod = "./build/",
    autoprefixer = require('autoprefixer'),
    cleanCSS = require("gulp-clean-css"),
    postCSS = require("gulp-postcss");

gulp.task("copy-html", () => {
    return gulp.src("./app/src/index.html")
        .pipe(gulp.dest(dist))
});

gulp.task("build-js", () => {
    return gulp.src("./app/src/main.js")
        .pipe(webpack({
            mode: "development",
            output: {
                filename: "script.js"
            },
            watch: false,
            devtool: "source-map",
            module: {
                rules: [
                  {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [['@babel/preset-env', {
                            debug: true,
                            corejs: 3,
                            useBuiltIns: "usage"
                        }], "@babel/react"]
                      }
                    }
                  }
                ]
              }
        }))
        .pipe(gulp.dest(dist))
});

gulp.task("build-sass", () => {
    return gulp.src("./app/scss/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dist))
});

gulp.task("copy-api", () => {
    gulp.src("./app/api/**/.*")
        .pipe(gulp.dest(dist + "/api"));

    return gulp.src("./app/api/**/*.*")
        .pipe(gulp.dest(dist + "/api"))
})

gulp.task("copy-assets", () => {
    return gulp.src("./app/assets/**/*.*")
        .pipe(gulp.dest(dist + "/assets"))
})

gulp.task("watch", () => {
    gulp.watch("./app/src/index.html", gulp.parallel("copy-html"));
    gulp.watch("./app/assets/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./app/api/**/*.*", gulp.parallel("copy-api"));
    gulp.watch("./app/scss/**/*.scss", gulp.parallel("build-sass"));
    gulp.watch("./app/src/**/*.*", gulp.parallel("build-js"));
});

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "copy-api", "build-sass", "build-js"));

gulp.task('production', () => {
    gulp.src("./app/src/index.html")
        .pipe(gulp.dest(prod));
    gulp.src("./app/api/**/.*")
        .pipe(gulp.dest(prod + "/api"));
    gulp.src("./app/api/**/*.*")
        .pipe(gulp.dest(prod + "/api"));
    gulp.src("./app/assets/**/*.*")
        .pipe(gulp.dest(prod + "/assets"));

    gulp.src("./app/src/main.js")
        .pipe(webpack({
            mode: "production",
            output: {
                filename: "script.js"
            },
            module: {
                rules: [
                  {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [['@babel/preset-env', {
                            debug: false,
                            corejs: 3,
                            useBuiltIns: "usage"
                        }], "@babel/react"]
                      }
                    }
                  }
                ]
              }
        }))
        .pipe(gulp.dest(prod));
    return gulp.src("./app/scss/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postCSS([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(dist));    
});

gulp.task('default', gulp.parallel("watch", "build"));
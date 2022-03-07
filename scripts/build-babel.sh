#!/usr/bin/env sh
set -eu

BUILD_CMD='babel src -Dd build -x .js,.jsx,.ts,.tsx --source-maps inline --root-mode upward'
BUILD_CJS_CMD='babel src -Dd build-cjs -x .js,.jsx,.ts,.tsx --source-maps inline --config-file=$(yarn workspace asap-hub node -p "process.cwd()")/babel-cjs.config.js'

case $1 in
  build)
    echo Building ESM
    eval $BUILD_CMD &
    echo Building CJS
    eval $BUILD_CJS_CMD &
    wait
  ;;
  watch)
    echo Building ESM
    eval $BUILD_CMD &
    echo Building CJS
    eval $BUILD_CJS_CMD &
    wait

    echo Watching ESM
    eval $BUILD_CMD -w --verbose --skip-initial-build &
    echo Watching CJS
    eval $BUILD_CJS_CMD -w --verbose --skip-initial-build &
    wait
  ;;
  *)
    exec false
  ;;
esac

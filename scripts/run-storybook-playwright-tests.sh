#!/bin/sh
set -eu

./node_modules/.bin/storybook build --quiet
./node_modules/.bin/playwright test -c playwright.storybook.config.ts

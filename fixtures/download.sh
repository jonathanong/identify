#!/usr/bin/env bash

if [ ! -f "fixtures/girl.png" ]; then
  curl https://homepages.cae.wisc.edu/~ece533/images/girl.png -o fixtures/girl.png
fi

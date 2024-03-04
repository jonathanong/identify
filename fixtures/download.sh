#!/usr/bin/env bash

if [ ! -f "fixtures/girl.png" ]; then
  curl https://upload.wikimedia.org/wikipedia/commons/6/6a/PNG_Test.png -o fixtures/girl.png
fi

if [ ! -f "fixtures/text2.png" ]; then
  curl https://www.w3.org/Graphics/PNG/text2.png -o fixtures/text2.png
fi

---
title: Installing Home Assistant Server on Raspberry Pi 2
image:
tags:
- iot
- Raspberry Pi
---
1. Install [Balena Etcher](https://github.com/balena-io/etcher/releases/).
2. Download the correct image for your device from [here](https://www.home-assistant.io/hassio/installation/). 
3. Run Balena Etcher. Select the gz file as the image and it selected my SD Card writer automatically.
!(flashing.png)
4. Configure the wifi, so that the application can download. From Windows, I need to create a Fat32 USB partition with the name CONFIG and a file in , as per [these instructions](https://www.home-assistant.io/hassio/installation/).
> Alright, so this didn't work for me. Try plugging into home network with cable so it can download wifi drivers and docker image? Worst case, it's wired? (but no monitor...)
5. Startup the Raspberry Pi with the SD Card. It will boot HassOS on Linux and try to download an image.


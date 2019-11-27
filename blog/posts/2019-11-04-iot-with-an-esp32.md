---
title: IoT with an ESP32
publish: 2019-11-04 09:50:39
type: post
image: https://res.cloudinary.com/isonaj/image/upload/v1574856436/anthonyison.com/iot-with-an-esp32/cover_tcq7hg.jpg
tags:
- iot
---
I've got some roses that haven't been doing so well lately, and I've been thinking it would have been nice to know that they were not doing well before any real harm was done.<!-- more --> That got me thinking about IoT and so I bought some toys to see what I could pull together.

For this project, I picked up a Duinotech Soil Moisture Sensor and an ESP32 dev kit for under 50 bucks. The ESP32 is a powerful little processor, including WiFi. Oh, and I already had a DHT11 Temperature and Humidity Sensor laying around so I've added that to the project too. The project code is available [here](https://github.com/isonaj/WeatherStation-esp32) if you want to take a look.

## Getting Started
To get started, I made sure I could actually send code to the microcontroller. I installed the Arduino IDE from [here](https://www.arduino.cc/en/Main/Software) and installed a compiler for the ESP32 board. Open up the IDE, and go to Tools | Boards | Board Manager. Search for 'esp' and install 'esp32 by Espressif System' and then select the 'ESP32 Dev Module' as the default board.

I used something really simple to check that we were ready to roll, like this:
```c
void setup() {
  Serial.begin(115200);
  Serial.println("Hello world!");
}

void loop() {

}
```
Compile and Upload to the dev board, open Tools | Serial Monitor and then hit Reset on the board. Serial Monitor shows this:
```bash
rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)
configsip: 0, SPIWP:0xee
clk_drv:0x00,q_drv:0x00,d_drv:0x00,cs0_drv:0x00,hd_drv:0x00,wp_drv:0x00
mode:DIO, clock div:1
load:0x3fff0018,len:4
load:0x3fff001c,len:1100
load:0x40078000,len:9232
load:0x40080400,len:6400
entry 0x400806a8
Hello world!
```
So, we're good to go.

## DHT11 Temperature and Humidity Sensor
I have a 3 connector DHT11 unit, which has Power, Ground and Signal. I have connected power and ground to my 5V and Gnd pins and I connected Signal to GPIIO5. I will use another test application to test my setup.
To get started, open Tools | Library Manager and search for `dht11 esp32`, then install the 'DHT Sensor Library for ESPx by beegee_tokyo'.
```c
#include "DHTesp.h"

#define DHTpin 5

DHTesp dht;

void setup()
{
  Serial.begin(115200);
  Serial.println("Status\tHumidity (%)\tTemp (C)\tHeatIndex (C)");
  dht.setup(DHTpin, DHTesp::DHT11);
}

void loop()
{
  delay(5000);
  
  float humidity = dht.getHumidity();
  float temperature = dht.getTemperature();

  Serial.print(dht.getStatusString());
  Serial.print("\t");
  Serial.print(humidity, 1);
  Serial.print("\t\t");
  Serial.print(temperature, 1);
  Serial.print("\t\t");
  Serial.println(dht.computeHeatIndex(temperature, humidity, false), 1);
}
```

When I load up Serial Monitor and reset the board, I get:
```bash
Status    Humidity (%)  Temp (C)    HeatIndex (C)
OK        62.0          22.0        21.9
OK        62.0          22.0        21.9
```

Great! Now we have some data, but what to do with it?

## Blynk
I've had a look at a few home automation options, but [Blynk](https://blynk.io/) looks like the easiest to get up and running. I suspect I will take a closer look at an IoT Hub in the future. To get started with Blynk, install the app on your phone and create a new account and project.

Next, we need to send data through from the ESP32 board. Open Tools | Library Manager and search for `blynk esp32` and install the Blynk drivers. 

I set up the code to connect to my home wifi and send the DHT11 data on virtual pins to Blynk.
```c
#include "DHTesp.h"
#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

#define DHTpin 5

char auth[] = "MYAUTHKEY";
char ssid[] = "MYHOMESSID";
char pass[] = "MYHOMEPASSWORD";

DHTesp dht;
BlynkTimer timer;

void setup()
{
  dht.setup(DHTpin, DHTesp::DHT11);
  Blynk.begin(auth, ssid, pass);

  // Send data every 10 secs
  timer.setInterval(10000L, getData);
}

void loop()
{
  Blynk.run();
  timer.run();
}

void getData() {
  float humidity = dht.getHumidity();
  float temperature = dht.getTemperature();
  float heatIndex = dht.computeHeatIndex(temperature, humidity, false);
  
  Blynk.virtualWrite(V1, humidity);
  Blynk.virtualWrite(V2, temperature);
  Blynk.virtualWrite(V3, heatIndex);
}
```

Create a dashboard in the Blynk app with 3 Value Displays and link up the Virtual Pins for Temp, Humidity and Heat Index.

> Blynk lets you connect to digital pins with no code change. Config only! That's pretty damn cool!

As an experiment, I also added an LED (with resistor! don't just connect a LED between your GPIO pin and GND!) to GPIO16 and 17 on my board and added a button for each, linked to digital gp16 and gp17. These started to work immediately, with no code change. I'm impressed! It leaves me thinking I can connect an analog pin directly to Blynk and have it just work.

## Battery Sensor
When you've got a battery-powered unit, it helps to know the battery level so you can replace the battery before it goes flat. You can calculate this by splitting the battery voltage across 2 resistors and reading the voltage between them through an ADC port.

[This post](https://randomnerdtutorials.com/power-esp32-esp8266-solar-panels-battery-level-monitoring/) has a great overview of running an ESP32 or ESP8266 from a battery, including power regulation, recharging from solar and reading the battery power level. 

## Soil Moisture Sensor
A soil moisture sensor is basically a variable resistor. It consists of two probes and when there is more water, the soil conducts more electricity and so has a lower resistance. As such, you can read the analog voltage between the two resistors to calculate the resistance of the probe resistance, which will provide a range according to the moisture in the soil.

To find out more, check out [this](http://www.esp32learning.com/code/esp32-and-soil-moisture-sensor-example.php) and [this](https://www.banggood.com/LILYGO-Higrow-ESP32-WiFi-bluetooth-Battery-DHT11-Soil-Temperature-And-Humidity-Sensor-Module-p-1196250.html).

## Sleep Mode
WiFi sucks up a whole lot of power and we want to get as much battery life as we can. The easiest way to achieve this is to disable WiFi and put the chip into a deep sleep mode. Then we can wake up occasionally to read the values, connect the WiFi and send them to Blynk and then go back to sleep. When we do this, we will lose the ability to react to commands easily. That's ok if we're just reading from sensors but is it really worth it?

From a power perspective, if we use, say, a [LiPo 18650 Cell](https://core-electronics.com.au/polymer-lithium-ion-battery-18650-cell-2600mah.html) with 2600mAh and ESP32 uses 100-240mA while active, we should get roughly 11-26 hours. If we use the deep sleep mode, our power consumption drops to around 10 &micro;A. Yeah, that's not much. Our 2600mAh battery should now give us ... 260,000 hours. That's only 29 years.

In 1 hour, we use 10&micro;Ah (close enough) during sleep mode plus 20 seconds @ 240mAh (1,333 &micro;Ah). This hybrid model should last 1936 hours or around 80 days between charges. As you can see, that's a lot of variation, mostly related to the wireless activity.

## Conclusion
So this has been a bit different to my other posts. It's been quite a while since I've used microcontrollers and I have to say, they are getting more interesting with WiFi and bluetooth onboard while costing next to nix.

IoT is a big thing these days, so maybe it's time to dust of my electronics engineering degree and taking a closer look. Microcontroller development is a whole lot more accessible these days and services like Blynk make IoT ridiculously simple, so long as you have access to power. Running from batteries has always been a bit temperamental (avoid it if you can!).

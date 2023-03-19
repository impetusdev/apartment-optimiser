# README Boilerplate

My first firebase application, that performs webscrapping operations for rental apartments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

Navigate into the ./functions folder and run the following commands

```sh
npm i # install packages
```

## Usage

In order to run these files locally you will need to install the [firebase cli](https://firebase.google.com/docs/cli). Then run:

```sh
npm run serve # starts the firebase emulator exposing the local function endpoints.
```

If you want hotreloading to work open up another tab and run:

```sh
npm run build:watch
```

You should be able to hit the endpoint `/addApartment` with your apartment details.

Alternatively if you setup an account with [ScraperApi](https://www.scraperapi.com/?utm_source=google&utm_medium=cpc&utm_id=1485898465_54263081981&utm_term=scraper%20api&utm_mt=e&utm_device=d&utm_campaign=T1|s|Branded&gclid=Cj0KCQjwwtWgBhDhARIsAEMcxeBSpRtdK8ESU6ftGU_uW0X4Chb7kETE-hv8Jea0OVHxQrW4FPbKNhYaAhpXEALw_wcB), and save your api token into an .env you can hit the `/scrapeApartments` endpoint, which given an apartment domain will scrape all of the apartments on the page with their prices.

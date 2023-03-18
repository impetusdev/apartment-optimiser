import axios from "axios";
import {load} from "cheerio";
import {Apartment} from ".";
import * as admin from "firebase-admin";
import {APARTMENT_COLLECTION} from "./utils";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
};

export async function scrapeWebsite(url: string): Promise<Apartment[]> {
  console.log(`Performing webscrapping 🌾 on ${url}`);

  try {
    const scraperApiUrl = `http://api.scraperapi.com/?api_key=${process.env.SCRAPER_API}&url=${url}&keep_headers=true&render=true`;
    const response = await axios.get(scraperApiUrl, {headers});

    // Load the response data into Cheerio
    const $ = load(response.data);

    // Scrape the title for each specific apartment
    const apartments: Apartment[] = [];
    $("ul[data-testid='results'] li").each((index, element) => {
      const street = $(element).find("[data-testid='address-line1']").text();
      const suburb = $(element).find("[data-testid='address-line2']").text();
      const price = $(element)
        .find("[data-testid='listing-card-price']")
        .text();
      console.log("street:", street);
      console.log("suburb:", suburb);
      console.log("price:", price);
      apartments.push({
        address: street + suburb,
        price: parsePrice(price),
      });
    });

    return apartments;
  } catch (error) {
    console.error(`Error fetching URL: ${url}`, error);
    throw error;
  }
}

export const getApartmentAddresses = async () => {
  console.log("Getting existing apartment addresses 🏡");
  const snapshot = await admin
    .firestore()
    .collection(APARTMENT_COLLECTION)
    .get();

  const aparmentAddresses = new Set<string>();
  snapshot.docs.forEach((apartment) => {
    aparmentAddresses.add(apartment.data().address);
  });

  return aparmentAddresses;
};

export const writeMultipleApartments = async (
  apartments: Apartment[]
): Promise<void> => {
  const db = admin.firestore();
  const batch = db.batch();

  apartments.forEach((apartment: Apartment) => {
    const apartmentRef = db.collection(APARTMENT_COLLECTION).doc();
    batch.set(apartmentRef, apartment);
  });

  await batch.commit();
  console.log("Batch committed successfully! 🐲");
};

const parsePrice = (price: string): number => {
  return parseInt(price.split(" ")[0].slice(1));
};

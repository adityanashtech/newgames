"use client"; // This makes the component interactive

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import axios from "axios";
import CryptoJS from "crypto-js";


interface GameCardProps {
  title: string;
  image: string;
  game_uid: string;
}

export default function GameCard({ title, image, game_uid }: GameCardProps) {
  const aesKey = "126c2e86c418427c4aa717f971063e0e";
  const serverUrl = "https://api.workorder.icu/proxy";



const encryptAES256 = (data: string, key: string) => {
  const key256 = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.AES.encrypt(data, key256, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

// Generate a random 10-digit number
const generateRandom10Digits = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Open JS Game Function
const openJsGame = async (game_uid: string, element: HTMLButtonElement) => {
  console.log(`Game UID: ${game_uid}`);
  console.log(`Button element:`, element);

  const memberAccount = "h7bfd41234567890thala";
  const transferId = `${memberAccount}_${generateRandom10Digits()}`;
  const timestamp = Date.now();

  try {
    // Step 1: Initialize the payload with a balance of 0
    const initPayload = {
      agency_uid: "fd37fafd6af3eb5af8dee92101100347",
      member_account: memberAccount,
      timestamp,
      credit_amount: "0", // Set balance to 0
      currency_code: "BRL",
      language: "en",
      platform: "2",
      home_url: "https://thalaclub.com",
      transfer_id: transferId,
    };

    const initEncryptedPayload = encryptAES256(
      JSON.stringify(initPayload),
      aesKey
    );

    const initRequestPayload = {
      agency_uid: "fd37fafd6af3eb5af8dee92101100347",
      timestamp,
      payload: initEncryptedPayload,
    };

    // Send the initial request to the server
    const initResponse = await axios.post(serverUrl, initRequestPayload);

    if (initResponse.data.code !== 0) {
      console.error("Initialization Error:", initResponse.data.msg);
      alert("Failed to initialize game: " + initResponse.data.msg);
      return;
    }

    console.log("Initialization successful:", initResponse.data);

    // Get the amount to deduct from the user balance
    const afterAmount = initResponse.data.payload.after_amount; // Amount to deduct

    // Step 2: Deduct the user's balance
    const deductPayload = {
      agency_uid: "fd37fafd6af3eb5af8dee92101100347",
      member_account: memberAccount,
      timestamp: Date.now(),
      credit_amount: `-${afterAmount}`, // Deduct the current balance
      currency_code: "BRL",
      language: "en",
      platform: "2",
      home_url: "https://thalaclub.com",
      transfer_id: `${memberAccount}_${generateRandom10Digits()}`,
    };

    const deductEncryptedPayload = encryptAES256(
      JSON.stringify(deductPayload),
      aesKey
    );

    const deductRequestPayload = {
      agency_uid: "fd37fafd6af3eb5af8dee92101100347",
      timestamp: Date.now(),
      payload: deductEncryptedPayload,
    };

    const deductResponse = await axios.post(serverUrl, deductRequestPayload);

    if (deductResponse.data.code !== 0) {
      console.error("Deduct Error:", deductResponse.data.msg);
      alert("Failed to deduct balance: " + deductResponse.data.msg);
      return;
    }

    console.log("Deduct successful:", deductResponse.data);

    // Step 3: Launch the game
    const gamePayload = {
      agency_uid: "fd37fafd6af3eb5af8dee92101100347",
      member_account: memberAccount,
      game_uid: game_uid,
      timestamp: Date.now(),
      credit_amount: afterAmount.toString(),
      currency_code: "BRL",
      language: "en",
      platform: "2",
      home_url: "https://thalaclub.com",
      transfer_id: `${memberAccount}_${generateRandom10Digits()}`,
    };

    const gameEncryptedPayload = encryptAES256(
      JSON.stringify(gamePayload),
      aesKey
    );

    const gameRequestPayload = {
      agency_uid: "fd37fafd6af3eb5af8dee92101100347",
      timestamp: Date.now(),
      payload: gameEncryptedPayload,
    };

    const gameResponse = await axios.post(serverUrl, gameRequestPayload);

    if (gameResponse.data.code !== 0) {
      console.error("Game Launch Error:", gameResponse.data.msg);
      alert("Failed to launch game: " + gameResponse.data.msg);
      return;
    }

    // Fetch the game launch URL
    const gameLaunchUrl = gameResponse.data.payload?.game_launch_url;

    if (!gameLaunchUrl) {
      console.error("Game Launch URL not found.");
      alert("Game launch URL not found.");
      return;
    }

    console.log("Game Launch URL:", gameLaunchUrl);

    // Open the game launch URL in a new tab
    window.open(gameLaunchUrl, "_blank");
  } catch (error) {
    console.error("Error in game launch process:", error);
    alert("An error occurred while launching the game.");
  }
};



  return (

    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js"></script>
      <Image
        src={image}
        alt={title}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <Button
          className="w-full"
          onClick={(e) => openJsGame(game_uid, e.currentTarget)}
        >
          Play
        </Button>
      </div>
    </div>
  );
}

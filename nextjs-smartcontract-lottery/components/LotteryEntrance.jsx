import React, { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import abi from "../constants/abi.json";
import contractAddresses from "../constants/contractAddresses.json";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numOfPlayers, setNumOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumOfPlayers",
    params: {},
  });

  const { runContractFunction: getlatestWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getlatestWinner",
    params: {},
  });

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const updateUI = async function () {
    const entranceFeeFromContract = (await getEntranceFee()).toString();
    const numOfPlayersFromContract = (await getNumOfPlayers()).toString();
    const getLatestWinnerFromContract = await getlatestWinner();
    setEntranceFee(entranceFeeFromContract);
    setNumOfPlayers(numOfPlayersFromContract);
    setRecentWinner(getLatestWinnerFromContract);

    console.log(entranceFeeFromContract);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      {raffleAddress ? (
        <div className="mx-5">
          <button
            className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-2 rounded-md "
            disabled={isLoading || isFetching}
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div className="my-1">
            {" "}
            Entrance Fee: {ethers.utils.formatUnits(entranceFee)}ETH{" "}
          </div>
          <div className="my-1"> Number of Players: {numOfPlayers}</div>
          <div className="my-1"> RecentWinner:{recentWinner}</div>
        </div>
      ) : (
        <div className="my-1">No Raffle Address Detected </div>
      )}
    </div>
  );
}

export default LotteryEntrance;
